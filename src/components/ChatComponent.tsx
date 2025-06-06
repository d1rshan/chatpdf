"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  // Fetch existing chat messages
  //   const { data, isLoading } = useQuery({
  //     queryKey: ["chat", chatId],
  //     queryFn: async () => {
  //       const response = await axios.post<Message[]>("/api/get-messages", {
  //         chatId,
  //       });
  //       return response.data;
  //     },
  //   });

  // Initialize useChat with the fetched messages
  const { input, handleInputChange, handleSubmit, messages, setMessages } =
    useChat({
      api: "/api/chat",
      // We'll send messages and chatId on submit, so body is empty here
      body: {},
      //   initialMessages: data || [],
    });

  // Once data is fetched, sync it with the chat messages state
  //   useEffect(() => {
  //     if (data && data.length > 0) {
  //       setMessages(data);
  //     }
  //   }, [data, setMessages]);

  // Override handleSubmit to send messages + chatId to API
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    await handleSubmit(e, {
      // add chatId and messages to the body sent to /api/chat
      body: {
        chatId,
        messages,
      },
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <MessageList messages={messages} isLoading={false} />

      <form
        onSubmit={onSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2" type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
