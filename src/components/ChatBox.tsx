"use client";
import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import useChatBoxStore from "@/store/chatBoxStore";
import axios from "axios";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import useChatStore from "@/store/ChatStore";

interface IMessage {
  _id: string;
  content: string;
  sender: { _id: string; name: string };
  createdAt: Date;
}
const socket = io("http://localhost:5000");

function ChatBox() {
  const { data: session } = useSession();
  const { messages, addMessage, setMessages } = useChatStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { chatBox } = useChatBoxStore();
  
  useEffect(() => {
    if (!session?.user || !chatBox) return;

    const roomId = [session.user._id, chatBox].sort().join("_");
    socket.emit("joinRoom", { roomId });
  }, [chatBox, session?.user._id]); // Runs only when user or chatbox changes

  // Keep the listener active for real-time updates
  useEffect(() => {
    const handleMessageReceive = (msg: any) => {
      console.log(msg.sender,msg.reciever)
      if (msg.sender !== msg.reciever) {
      addMessage(msg);
      }
    };

    socket.on("receiveMessage", handleMessageReceive);

    return () => {
      socket.off("receiveMessage", handleMessageReceive);
    };
  }, []); // Runs only once and keeps listening


  useEffect(() => {
    if (!session?.user || !chatBox) return;

    const fetchMessage = async () => {
      try {
        const { data } = await axios.post("/api/get-messages", JSON.stringify(chatBox), {
          headers: { "Content-Type": "application/json" },
        });

        if (!data.success) {
          console.log(data.message);
          return;
        }
        setMessages(data.data);
      } catch (error) {
        console.log("Error in fetching messages", error);
      }
    };

    fetchMessage();
  }, [session?.user._id, chatBox]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage = {
      content: message,
      receiverId: chatBox,
    };

    try {
      const { data } = await axios.post("/api/send-message", newMessage);

      // Emit the message via socket
      socket.emit("sendMessage", {
        roomId: [session?.user._id, chatBox?.toString()].sort().join("_"),
        sender: session?.user._id,
        reciever: chatBox?.toString(),
        content: message.trim(),
        createdAt: new Date().toISOString()
      });

      // ✅ Remove `addMessage(data.data);` here to avoid duplicate messages
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatBox) return null;

  return (
    <div className="w-[60%] h-screen flex flex-col bg-gray-100 fixed right-[10%] top-0">
      <header className="p-4 bg-white border-b flex items-center">
        <h2 className="text-lg font-semibold">Chat</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isSender = msg.sender === session?.user._id;
          console.log(msg.createdAt)
          return (
            <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${isSender ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
