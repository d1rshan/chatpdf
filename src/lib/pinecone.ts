import { Pinecone} from "@pinecone-database/pinecone";
import { downloadFromUploadthing } from "./uploadthing-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {Document,RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter"
import { getEmbeddings } from "./embeddings";
import md5 from "md5";

// interface Vector {
//     id: string;
//     values: number[];
//     metadata: {
//         text: string;
//         pageNumber: number;
//     };
// }

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
});

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {
            pageNumber: number;
        }
    }
}

export async function loadFileToPinecone(fileKey: string){
    // 1.Obtain the pdf from uploadthing
    console.log("Downloading file from uploadthing...");
    const file_name = await downloadFromUploadthing(fileKey);
    if (!file_name) {
        throw new Error("Failed to download file from uploadthing");
    }
    const loader = new PDFLoader(file_name)
    const pages = (await loader.load()) as PDFPage[]

    // 2. Split and segment the pdf into chunks (now it splits by page which is default but obviously we will store the embeddings based on chunks for more accurate responses )
    // we are calling the chunks as documents
    const documents = await Promise.all(pages.map(prepareDocument))

    // 3. Vectorize and embed individual chunks (documents)
    const vectors = await Promise.all(documents.flat().map(embedDocuments)) // final result vectors corresponding to each document

    // 4. Upload the vectors to pinecone
    const pineconeIndex = pinecone.index("chatpdf");
    const namespace = pineconeIndex.namespace(fileKey);
    
    console.log("Inserting vectors to pinecone");
    await namespace.upsert(vectors);

    return documents[0]
}


async function embedDocuments(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text as string,
                pageNumber: doc.metadata.pageNumber as number
            }
        };
    } catch (error) {
        console.log("Error embedding document", error);
        throw error;
    }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const encoder = new TextEncoder()
    return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0,bytes))
}

// async function prepareDocument(page: PDFPage){
//     let {pageContent,metadata} = page
//     pageContent = pageContent.replace(/\n/g,"") // to replace all new line characters with empty string
//     // split the docs
//     const splitter = new RecursiveCharacterTextSplitter()
//     const docs = await splitter.splitDocuments([
//         new Document({
//             pageContent,
//             metadata: {
//                 pageNumber: metadata.loc.pageNumber,
//                 text: truncateStringByBytes(pageContent, 36000), // pinecone has a limit of 36kb of metadata so to avoid problems with it later we are doing this
//             }
//         })
//     ])
//     return docs
// }

// metadata has chunk text (not the entire page text)
async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
  
    // Remove newlines to reduce noise in embeddings
    pageContent = pageContent.replace(/\n/g, "");
  
    // Split the full page into smaller semantic chunks
    const splitter = new RecursiveCharacterTextSplitter();
    const rawChunks = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {}, // start with no metadata to avoid it being copied
      }),
    ]);
  
    // Now enrich each chunk with unique metadata
    const enrichedChunks = rawChunks.map((chunk, idx) => {
      return new Document({
        pageContent: chunk.pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
        //   chunkIndex: idx, // Optional but helpful for tracing
          text: truncateStringByBytes(chunk.pageContent, 36000), // Pinecone 36KB metadata limit
        },
      });
    });
  
    return enrichedChunks;
  }