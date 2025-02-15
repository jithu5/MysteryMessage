"use client";
import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import useChatBoxStore from "@/store/chatBoxStore";
import axios from "axios";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import useChatStore from "@/store/ChatStore";

const socket = io("http://localhost:5000");

function ChatBox() {
  const { data: session } = useSession();
  const { messages, addMessage, setMessages } = useChatStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { chatBox } = useChatBoxStore();


  useEffect(() => {
    if (!session?.user._id || !chatBox) return;

    const roomId = [session.user?._id, chatBox?.toString()].sort().join("_");
    console.log("Joining Room:", roomId);
    socket.emit("joinRoom", { roomId });
  }, [chatBox, session?.user._id]);


  // Keep the listener active for real-time updates

  useEffect(() => {
    // if (!session?.user._id) return;
    console.log("hello world")
    socket.on("receiveMessage", (msg: any) => {
      console.log("Message received:", msg);
      if (session?.user._id != msg.sender) {

        addMessage(msg);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatBox]); // Runs only once and keeps listening

  useEffect(() => {
    if (!session?.user || !chatBox) return;

    const fetchMessage = async () => {
      try {
        const { data } = await axios.post("/api/read-messages", JSON.stringify(chatBox), {
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

      if (!data.success) {
        return
      }


      // Emit the message via socket
      socket.emit("sendMessage", {
        roomId: [session?.user._id, chatBox?.toString()].sort().join("_"),
        sender: session?.user._id,
        receiver: chatBox?.toString(),
        content: message.trim(),
        createdAt: new Date().toISOString(),
        _id: data.data._id,
      });

      addMessage(data.data); // here to avoid duplicate messages
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
        {messages && messages.length > 0 && messages.map((msg, index) => {
          const isSender = msg.sender === session?.user._id;
          const msgDate = new Date(msg.createdAt).toLocaleDateString();

          // Check if the date is different from the last message's date
          const showDate = index === 0 || new Date(messages[index - 1].createdAt).toLocaleDateString() !== msgDate;


          return (
            <React.Fragment key={msg?._id}>
              {showDate && (
                <div className="text-center text-gray-500 my-2 font-semibold">
                  {msgDate}
                </div>
              )}
              <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </React.Fragment>
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
