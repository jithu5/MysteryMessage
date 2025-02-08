"use client";
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import { IApiResponse } from '@/types/ApiResponse';

// Hardcoded data for contacts
const contacts = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, are we still on for the meeting?",
    time: "10:45 AM",
    image: "https://randomuser.me/api/portraits/men/1.jpg", // Random image URL for demo
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Check out the new project proposal!",
    time: "Yesterday",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    lastMessage: "Can you send me the report by EOD?",
    time: "2 hours ago",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "Bob Lee",
    lastMessage: "Let's catch up soon!",
    time: "5:30 PM",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Tom Green",
    lastMessage: "I'm running late, will be there in 10 minutes.",
    time: "9:00 AM",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "Emma White",
    lastMessage: "I'll send you the file right away.",
    time: "3:30 PM",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: 7,
    name: "David Lee",
    lastMessage: "Can you please clarify the details of the task?",
    time: "10 minutes ago",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: 8,
    name: "Olivia Brown",
    lastMessage: "Had a great time at the event last night!",
    time: "Yesterday",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: 9,
    name: "Mark Wilson",
    lastMessage: "The design looks great! Let's finalize it.",
    time: "5:15 PM",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: 10,
    name: "Sophia Miller",
    lastMessage: "Looking forward to our call tomorrow.",
    time: "2 hours ago",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    id: 11,
    name: "James Taylor",
    lastMessage: "Don't forget to send me the report by end of day.",
    time: "9:45 AM",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 12,
    name: "Chloe Martin",
    lastMessage: "Let me know if you need anything from me.",
    time: "This morning",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 13,
    name: "Lucas Harris",
    lastMessage: "I'll check the code and get back to you.",
    time: "3 hours ago",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    id: 14,
    name: "Grace Robinson",
    lastMessage: "Can you share the meeting notes from yesterday?",
    time: "10:30 AM",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: 15,
    name: "Liam Clark",
    lastMessage: "I've attached the updated presentation.",
    time: "Yesterday",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

function Contacts() {
  const [isScrollable, setIsScrollable] = useState<boolean>(false)
  const [contactList, setContactList] = useState(contacts)
  const [searchUser, setSearchUser] = useState('')

 const onMouseEnter = (e: React.MouseEvent) =>{
   setIsScrollable(true)
 }
 const onMouseLeave = (e: React.MouseEvent) =>{
   setIsScrollable(false)
 }

 const handelSignOut = (e: React.MouseEvent) =>{

  signOut()
 }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUser(e.target.value);
  };


 useEffect(() => {
  async function search_user() {
    try {
      const { data } = await axios.get<IApiResponse>(`/api/search-user?search=${searchUser}`)
      console.log(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  search_user()
   
 }, [searchUser])
 

  return (
    <>
      <div className='fixed w-[30vw]  top-0 left-0 h-screen bg-lightBackground overflow-hidden'>
        <header className='w-[30vw] top-0 left-0 fixed bg-lightBackground h-24 flex flex-col items-center gap-3 py-4 px-4 md:px-10'>
          <div className='flex items-center justify-between w-full'>

          <button onClick={handelSignOut} className='text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full'>Sign Out</button>
          <h1 className='text-3xl font-semibold text-center'>Contacts</h1>
          </div>
          <Input value={searchUser} onChange={handleChange} className='bg-stone-900 px-3 py-2' placeholder='Search here...'>
          </Input>
        </header>
        <main onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`w-full mt-24 py-3 px-4 md:px-8 flex-1 overflow-x-hidden ${isScrollable ? "overflow-y-auto" : "overflow-y-hidden"} no-scroll `} style={{ height: "calc(100vh - 8rem)" }} // Adjusting for mt-24 (6rem)
>
          {/* Contacts list */}
          <div className='space-y-4'>
            {contactList.map(contact => (
              <div key={contact.id}>
                <div className='flex items-center gap-4 p-3 bg-darkGray rounded-lg'>

                <img src={contact.image} alt={contact.name} className='w-12 h-12 rounded-full object-cover' />
                <div className='flex flex-col'>
                  <span className='font-semibold text-white'>{contact.name}</span>
                  <span className='text-sm text-gray-400'>{contact.lastMessage}</span>
                </div>
                <span className='ml-auto text-sm text-gray-500'>{contact.time}</span>
                </div>
                <Separator orientation='horizontal' className="my-1 bg-white h-[0.5px]" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Contacts;
