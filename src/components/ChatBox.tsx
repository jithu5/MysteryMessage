"use client";
import { SendHorizontal } from "lucide-react";
import React, { useState } from "react";

interface IChat {
  id: number;
  sender: string;
  content: string;
  time: string;
}

const chats = [
  {
    id: 1,
    sender: "John Doe",
    content: "Hey, are we still on for the meeting?",
    time: "10:45 AM",
  },
  {
    id: 2,
    sender: "You",
    content: "Yes, I'll be there in 10 minutes.",
    time: "10:46 AM",
  },
  {
    id: 3,
    sender: "John Doe",
    content: "Great, see you soon!",
    time: "10:47 AM",
  },
  {
    id: 4,
    sender: "You",
    content: "Looking forward to it!",
    time: "10:48 AM",
  },
  {
    id: 5,
    sender: "John Doe",
    content: "What time is the meeting again?",
    time: "10:50 AM",
  },
  {
    id: 6,
    sender: "You",
    content: "It's at 11 AM.",
    time: "10:51 AM",
  },
  {
    id: 7,
    sender: "John Doe",
    content: "Got it, thanks!",
    time: "10:52 AM",
  },
  {
    id: 8,
    sender: "You",
    content: "No problem, see you then!",
    time: "10:53 AM",
  },
  {
    id: 9,
    sender: "John Doe",
    content: "Can we grab coffee after?",
    time: "10:55 AM",
  },
  {
    id: 10,
    sender: "You",
    content: "Sure, sounds good!",
    time: "10:56 AM",
  },
  {
    id: 11,
    sender: "John Doe",
    content: "I'll message you when I'm free.",
    time: "10:57 AM",
  },
  {
    id: 12,
    sender: "You",
    content: "Great, I'll be available.",
    time: "10:58 AM",
  },
  {
    id: 13,
    sender: "John Doe",
    content: "By the way, did you get my email?",
    time: "11:00 AM",
  },
  {
    id: 14,
    sender: "You",
    content: "Yes, I did. I'm reviewing it now.",
    time: "11:01 AM",
  },
  {
    id: 15,
    sender: "John Doe",
    content: "Let me know if you need any clarification.",
    time: "11:02 AM",
  },
  {
    id: 16,
    sender: "You",
    content: "Will do, thanks for the offer!",
    time: "11:03 AM",
  },
  {
    id: 17,
    sender: "John Doe",
    content: "By the way, I've updated the presentation.",
    time: "11:05 AM",
  },
  {
    id: 18,
    sender: "You",
    content: "Awesome, I'll take a look.",
    time: "11:06 AM",
  },
  {
    id: 19,
    sender: "John Doe",
    content: "Let me know your thoughts once you review it.",
    time: "11:07 AM",
  },
  {
    id: 20,
    sender: "You",
    content: "Definitely, I'll get back to you soon.",
    time: "11:08 AM",
  },
];


function ChatBox() {
  const [messages, setMessages] = useState<IChat []>(chats);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsScrollable(true);
  };

  const onMouseLeave = () => {
    setIsScrollable(false);
  };

  console.log(isScrollable);

  return (
    <main className="w-[70vw] h-screen bg-stone-800 fixed right-0 top-0 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <header className="flex items-center justify-between p-4 h-20 bg-stone-900">
        <span className="text-xl font-semibold text-white">John Doe</span>
        <div className="w-10" /> {/* Spacer for layout */}
      </header>

      {/* Messages Area */}
      <section
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`py-3 px-4 md:px-8 flex-1 ${isScrollable?"overflow-y-auto":"overflow-y-hidden"} no-scroll`}
        style={{ height: "calc(100vh - 20rem)" }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === "You" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block ${message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"} p-3 rounded-lg`}
            >
              <p>{message.content}</p>
              <span className="block text-xs mt-1">{message.time}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Message Input Area */}
      <div className="fixed w-[70vw] bottom-0 flex items-center bg-stone-700">

        <input
          type="text"
          placeholder="Type a message..."
          className="px-6 md:px-10 py-4 bg-stone-700 text-white w-full outline-none"
        />
        <div className="px-7">

        <SendHorizontal className="text-white cursor-pointer"/>
        </div>
      </div>
    </main>
  );
}

export default ChatBox;