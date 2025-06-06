import { NextResponse } from "next/server";


export async function POST(req: Request) {
 try {
    const body = await req.json();
    const {file_name,file_key} = body;

    console.log("Creating chat for file", file_name, file_key);
    return NextResponse.json({message: "Chat created successfully"}, {status: 200});
 } catch (error) {
    console.error("Error creating chat", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
 }
}