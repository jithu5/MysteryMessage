"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import axios from "axios";
import { IApiResponse } from "@/types/ApiResponse";
import useChatBoxStore from "@/store/chatBoxStore";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import useUnreadMessagesStore from "@/store/unReadMessages";
import { Popover, PopoverTrigger } from "./ui/popover";
import ProfileSetting from "./ProfileSetting";
import useUserStore from "@/store/userSore";
import { Menu } from "lucide-react";

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
  const { data: session, status } = useSession();
  const { user, clearUser } = useUserStore()
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [searchedUser, setSearchedUser] = useState<SearchedUser>({
    _id: "",
    username: "",
    profileImage: "",
});
  const [searchUser, setSearchUser] = useState("");
  const { setChatBox, chatBox } = useChatBoxStore();
  const [lastMessage, setLastMessage] = useState<{ [key: string]: string }>({})
  // const [unreadMessageCount, setUnreadMessageCount] = useState<{ [key: string]: number }>({})
  const { unreadMessages, setUnreadMessage } = useUnreadMessagesStore()

  const { toast } = useToast()
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
      if (message.sender === chatBox?.toString()) {
        // setUnreadMessageCount((prevCount) => {
        //   const updatedCount = { ...prevCount };
        //   updatedCount[message.sender] = 0;
        //   return updatedCount;
        // })
        setUnreadMessage(message.sender, 0)
      } else {
        // setUnreadMessageCount((prevCount) => {
        //   const updatedCount = {...prevCount };
        //   updatedCount[message.sender] = (updatedCount[message.sender] || 0) + 1;
        //   return updatedCount;
        // })
        setUnreadMessage(message.sender)
      }
      setLastMessage((prevLastMessage) => ({
        ...prevLastMessage,
        [message.roomId]: message.content,
      }));
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup to prevent memory leaks
    };
  }, [chatBox, socket]);

  useEffect(() => {
    async function fetcUnreadCount() {
      const { data } = await axios.post('/api/read-messages', {
        headers: { "Content-Type": "application/json" }
      })

      if (!data.success) {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive"
        })
        return
      }
      console.log(data.data)
      toast({
        title: "Unread Messages",
        description: "Messages fetched successfully",
        variant: "default"
      })
      data.data.unreadMessage.forEach((contact: { [key: string]: number }) => {
        if (contact.sender?.toString() == chatBox?.toString()) {
          console.log('inside if')
          setUnreadMessage(contact.sender.toString(), 0)
        } else {
          console.log('not inside if')
          setUnreadMessage(contact.sender?.toString())
        }

      })
    }
    fetcUnreadCount()
  }, []);

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
        setSearchedUser({
          _id: "",
          username: "",
          profileImage: "",
});
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



  console.log(unreadMessages)

  return (
    <div className="h-screen bg-lightBackground overflow-hidden">
      <header className="w-full md:w-[30vw] top-0 left-0 fixed bg-lightBackground h-24 flex flex-col items-center gap-3 py-4 px-5 md:px-6">
        <div className="relative w-full">

          <h1 className="text-3xl font-semibold text-center">Contacts</h1>
          {/* 
              <img src={user?.profileImage || "/user.png"} alt="" className="w-10 h-10 object-cover cursor-pointer rounded-full object-center" />
            */}
          <Popover>
            <PopoverTrigger asChild>
            
              <Menu className="absolute top-[50%] -translate-y-[50%] right-1 cursor-pointer" />
            </PopoverTrigger>
            <ProfileSetting />
          </Popover> 
           

        </div>
        <Input
          value={searchUser}
          onChange={handleChange}
          className="bg-stone-900 px-3 py-2 w-[90%] "
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
              <div key={contact._id} onClick={() => setChatBoxId(contact._id)} className="relative">
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
                      {lastMessage?.[[session?.user._id, contact._id].sort().join("_")]?.slice(0, 10) || contact.lastMessage?.content.slice(0, 10) || "Say Hi..."}

                      {unreadMessages &&
                        unreadMessages.get(contact._id) &&
                        unreadMessages.get(contact._id)! > 0 && (
                          <span className="absolute bottom-2 right-2 bg-foreground flex h-5 w-5 justify-center items-center text-md font-semibold text-white rounded-full">
                            {unreadMessages.get(contact._id)}
                          </span>
                        )
                      }
                    </span>
                  </div>
                  {/* ✅ Show only hours and minutes of the last message */}
                  <span className="ml-auto text-[9px] text-gray-500">
                    {contact.lastMessage
                      ? new Date(contact.lastMessage.createdAt).toLocaleTimeString("En-Us", {
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
