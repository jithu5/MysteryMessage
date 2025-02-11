"use client";
import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketProvider";
import useChatBoxStore from "@/store/chatBoxStore";
import axios from "axios";
import { useSession } from "next-auth/react";

interface IMessage {
  _id: string;
  content: string;
  sender: { _id: string; name: string };
  createdAt: Date;
}

function ChatBox() {
  const { data: session } = useSession();
  const socket = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { chatBox } = useChatBoxStore();
  console.log(chatBox)

  useEffect(() => {
    if (!chatBox || !socket || !session?.user._id) return;

    const participants = [session.user._id, chatBox].sort();
    const roomId = participants.join("_");

    console.log(`Joining room: ${roomId}`);
    socket.emit("joinRoom", roomId);

    const handleNewMessage = (message: IMessage) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]); // Ensures UI updates without refresh
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      console.log(`Leaving room: ${roomId}`);
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", roomId);
    };
  }, [chatBox, socket, session?.user._id]);

  useEffect(() => {
    console.log(chatBox,socket,session?.user._id)
    if (!chatBox || !socket || !session?.user._id) return;
    async function fetchMessages() {
      const { data } = await axios.post('/api/get-messages', JSON.stringify(chatBox), { headers: { 'Content-Type': 'application/json' } });
      console.log(data)
      if (data.success) {
        setMessages(data.data);
      } else {
        console.error("Error fetching messages:", data.message);
      }
    }
    fetchMessages();
  },[])


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatBox) return;

    const tempMessage: IMessage = {
      _id: Date.now().toString(), // Temporary ID
      content: newMessage,
      sender: { _id: session?.user._id || "", name: "You" },
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]); // Show immediately

    try {
      await axios.post("/api/send-message", {
        chatBox,
        content: newMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setNewMessage(""); // Clear input
  };


  if (!chatBox) return null;

  return (
    <div className="w-[60%] h-screen flex flex-col bg-gray-100 fixed right-[10%] top-0">
      <header className="p-4 bg-white border-b flex items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {messages[0]?.sender._id === chatBox
              ? messages[0]?.sender.name
              : "Loading..."}
          </h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === session?.user._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender._id === session?.user._id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
                }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;