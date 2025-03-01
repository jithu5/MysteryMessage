"use client";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import useChatBoxStore from "@/store/chatBoxStore";
import axios from "axios";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import useChatStore from "@/store/ChatStore";
import { useToast } from "@/hooks/use-toast";
import useUnreadMessagesStore from "@/store/unReadMessages";

const socket = io("http://localhost:5000");

function ChatBox() {
  const { data: session } = useSession();
  const { messages, addMessage, setMessages } = useChatStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { chatBox,setChatBox } = useChatBoxStore();
  const { setUnreadMessage,unreadMessages } = useUnreadMessagesStore()
  const { toast } = useToast()


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
      if (session?.user._id != msg.sender) {

        addMessage(msg);
      }
      console.log(msg.receiver, chatBox);
      if (msg.sender === chatBox) {
        async function setessageStatustoRead() {
          const { data } = await axios.post('/api/set-messgae-read-true', JSON.stringify(chatBox))
          if (!data.success) {
            toast({
              title: "Error",
              description: data.message,
              variant: "destructive"
            })
            return;
          }
          toast({
            title: "Message Read",
            description: "Message has been marked as read.",
            variant: "default"
          })
        }
        setessageStatustoRead();
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatBox]);

  useEffect(() => {
    if (!session?.user || !chatBox) return;
    console.log('heyyyyy')
    const fetchMessage = async () => {
      try {
        const { data } = await axios.post("/api/read-messages", JSON.stringify(chatBox), {
          headers: { "Content-Type": "application/json" },
        });

        if (!data.success) {
          return;
        }
        setMessages(data.data.message);
        console.log(data.data.unreadMessage);
        data.data.unreadMessage.forEach((contact: { [key: string]: number }) => {
          console.log(contact.sender?.toString(), chatBox?.toString())
          if (contact.sender?.toString() == chatBox?.toString()) {
            console.log('inside if')
            setUnreadMessage(contact.sender.toString(),0)
          } else {
            if (unreadMessages.get(contact.sender?.toString()) === 0) {
              
              setUnreadMessage(contact.sender?.toString())
            }
          }
  
        })
      } catch (error) {
        console.log("Error in fetching messages", error);
      }
    };

    fetchMessage();
  }, [session?.user._id,chatBox]);

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

      addMessage(data.data);
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
    <div className="h-screen flex flex-col bg-gray-100 md:col-span-2 max-md:w-full max-md:z-40">
      <header className="p-4 bg-white border-b flex items-center w-full justify-between">
        <ArrowLeft onClick={()=>setChatBox(undefined)} className="cursor-pointer hover:bg-stone-200 text-xl rounded-full p-1 md:hidden"/>
        <h2 className="text-lg font-semibold text-center">Chat</h2>
        <div></div>
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
