import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function getContext(query: string, fileKey: string) {
  const queryEmbedding = await embeddings.embedQuery(query);
  const index = pinecone.Index(process.env.PINECONE_INDEX!);

  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 5,
    filter: { fileKey },
    includeMetadata: true,
  });

  const matches = queryResponse.matches || [];
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  if (!qualifyingDocs.length) {
    return "No relevant context found.";
  }

  return qualifyingDocs
    .map((match) => match.metadata?.text)
    .join("\n\n");
} 