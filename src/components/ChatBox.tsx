"use client";
import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketProvider";

interface IChat {
  id: number;
  sender: string;
  content: string;
  time: string;
}

function ChatBox() {
  const socket = useSocket();
  const [messages, setMessages] = useState<IChat[]>([
    { id: 1, sender: "John", content: "Hey there! How's it going?", time: "10:05 AM" },
    { id: 2, sender: "You", content: "Hey! I'm doing great. What about you?", time: "10:06 AM" },
    { id: 3, sender: "John", content: "Just chilling. Any plans for today?", time: "10:07 AM" },
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    const handleMessage = (message: IChat) => {
      console.log("Received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || newMessage.trim() === "") return;

    const messageData: IChat = {
      id: Date.now(),
      sender: "You",
      content: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", messageData);

    // Prevent duplicate by checking if the server already broadcasts the message
    // setMessages([messageData]);

    setNewMessage("");
  };

  return (
    <main className="w-[63vw] h-screen bg-stone-800 fixed right-[7%] top-0 flex flex-col overflow-hidden">
      <header className="flex items-center justify-between p-4 h-20 bg-stone-900">
        <span className="text-xl font-semibold text-white">John Doe</span>
        <div className="w-10" />
      </header>

      <section className="py-5 px-4 md:px-16 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 8rem)" }}>
        <div className="overflow-y-auto h-full w-full no-scroll">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === "You" ? "text-right" : "text-left"}`}>
              <div className={`inline-block ${message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"} p-3 rounded-lg`}>
                <p>{message.content}</p>
                <span className="block text-xs mt-1">{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </section>

      <div className="fixed w-[60vw] right-[7%] bottom-0 flex items-center bg-stone-700">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="px-6 md:px-10 py-4 bg-stone-700 text-white w-full outline-none"
        />
        <div className="px-7">
          <SendHorizontal className="text-white cursor-pointer" onClick={sendMessage} />
        </div>
      </div>
    </main>
  );
}

export default ChatBox;
