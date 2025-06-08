import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { chatId, content, role } = await req.json();
    
    await db.insert(messages).values({
      chatId,
      content,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 