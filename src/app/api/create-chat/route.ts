import { loadFileToPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
   const {userId} = await auth();
   if(!userId){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
   }
 try {
    const body = await req.json();
    const {file_name,file_key} = body;

    console.log("Creating chat for file", file_name, file_key);
    await loadFileToPinecone(file_key);
    const chat_id = await db.insert(chats).values({
      pdfName: file_name,
      pdfUrl: `https://uploadthing.com/f/${file_key}`,
      userId,
      fileKey: file_key
    }).returning({insertedId: chats.id});
    return NextResponse.json({chat_id: chat_id[0].insertedId}, {status: 200});
 } catch (error) {
    console.error("Error creating chat", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
 }
}