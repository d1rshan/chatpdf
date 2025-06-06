import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
// import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  // const isPro = await checkSubscription();

  return (
    <div className="flex h-screen">
      <div className="flex w-full h-full">
        {/* chat sidebar */}
        <div className="w-[300px] h-full border-r border-slate-200">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={true} />
        </div>
        {/* pdf viewer */}
        <div className="h-full flex-[5] p-4">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l border-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
