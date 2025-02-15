"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import axios from "axios";
import { IApiResponse } from "@/types/ApiResponse";
import useChatBoxStore from "@/store/chatBoxStore";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

type Contact = {
  _id: string;
  username: string;
  profileImage: string;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
};

type SearchedUser = {
  _id: string;
  username: string;
  profileImage: string;
};

const socket = io("http://localhost:5000");

function Contacts() {
  const { data: session } = useSession();
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [searchedUser, setSearchedUser] = useState<SearchedUser>({});
  const [searchUser, setSearchUser] = useState("");
  const { setChatBox, chatBox } = useChatBoxStore();
  const [lastMessage, setLastMessage] = useState<{ [key: string]: string }>({})

  const onMouseEnter = () => setIsScrollable(true);
  const onMouseLeave = () => setIsScrollable(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUser(e.target.value);
  };
  let roomId;
  useEffect(() => {
    if (!session?.user._id && !contactList) return;
    contactList.forEach((contact) => {

      roomId = [session?.user._id, contact._id].sort().join("_");
      socket.emit("joinRoom", { roomId });

    })
  }, [session?.user._id])


  useEffect(() => {
    console.log("hey")
    socket.on("receiveMessage", (message) => {
      console.log("New message received:", message.sender, chatBox?.toString());
      setLastMessage((prevLastMessage) => ({
        ...prevLastMessage,
        [message.roomId]: message.content,
      }));
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup to prevent memory leaks
    };
  }, [chatBox]);


  useEffect(() => {
    async function fetchContacts() {
      try {
        const { data } = await axios.post<IApiResponse>(
          "/api/getusers",
          JSON.stringify({ chatBox }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setContactList(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchContacts();
  }, []);

  useEffect(() => {
    async function searchUserRequest() {
      if (!searchUser) {
        setSearchedUser({});
        return;
      }

      try {
        const { data } = await axios.get<IApiResponse>(
          `/api/search-user?search=${searchUser}`
        );
        setSearchedUser(data.data || {});
      } catch (error) {
        console.error(error);
      }
    }

    searchUserRequest();
  }, [searchUser]);

  const setChatBoxId = (id: string) => {
    setChatBox(id);
  };

  return (
    <div className="fixed w-[30vw] top-0 left-0 h-screen bg-lightBackground overflow-hidden">
      <header className="w-[30vw] top-0 left-0 fixed bg-lightBackground h-24 flex flex-col items-center gap-3 py-4 px-5 md:px-6">
        <h1 className="text-3xl font-semibold text-center">Contacts</h1>
        <Input
          value={searchUser}
          onChange={handleChange}
          className="bg-stone-900 px-3 py-2"
          placeholder="Search here..."
        />
      </header>

      <main
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-full mt-24 py-3 px-4 md:px-8 flex-1 overflow-x-hidden ${isScrollable ? "overflow-y-auto" : "overflow-y-hidden"
          } no-scroll`}
        style={{ height: "calc(100vh - 8rem)" }}
      >
        {contactList.length > 0 && (
          <div className="space-y-4">
            {contactList.map((contact) => (
              <div key={contact._id} onClick={() => setChatBoxId(contact._id)}>
                <div className="flex items-center gap-4 py-3 bg-darkGray rounded-lg hover:bg-stone-700">
                  {contact?.profileImage ? (
                    <img
                      src={contact.profileImage}
                      alt={contact.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full object-cover flex justify-center items-center bg-foreground text-white text-lg font-semibold">
                      {contact.username[0].toLocaleUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {contact.username}
                    </span>
                    {/* ✅ Display the last message */}
                    <span className="text-sm text-gray-400">
                      {/* {contact.lastMessage ? contact.lastMessage.content : "Say Hi..."} */}
                      {/* ✅ Display the number of unread messages */}
                      {lastMessage?.[[session?.user._id, contact._id].sort().join("_")] || contact.lastMessage?.content || "Say Hi..."}


                    </span>
                  </div>
                  {/* ✅ Show only hours and minutes of the last message */}
                  <span className="ml-auto text-[9px] text-gray-500">
                    {contact.lastMessage
                      ? new Date(contact.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : ""}
                  </span>
                  
                </div>
                <Separator orientation="horizontal" className="my-1 bg-white h-[0.5px]" />
              </div>
            ))}
          </div>
        )}

        {searchedUser._id && (
          <div key={searchedUser._id} onClick={() => setChatBoxId(searchedUser._id)}>
            <div className="flex items-center gap-4 p-3 bg-darkGray rounded-lg hover:bg-stone-700">
              {searchedUser.profileImage ? (
                <img
                  src={searchedUser.profileImage}
                  alt={searchedUser.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full object-cover flex justify-center items-center bg-foreground text-white text-lg font-semibold">
                  {searchedUser.username[0].toLocaleUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-white">
                  {searchedUser.username}
                </span>
                <span className="text-sm text-gray-400">Say Hi...</span>
              </div>
              <span className="ml-auto text-sm text-gray-500">67</span>
            </div>
            <Separator orientation="horizontal" className="my-1 bg-white h-[0.5px]" />
          </div>
        )}

        {contactList.length === 0 && !searchedUser._id && (
          <div className="flex flex-col items-center gap-4 p-3">
            <span className="text-2xl text-gray-600">No contacts found</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default Contacts;
