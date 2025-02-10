"use client";
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import axios from 'axios';
import { IApiResponse } from '@/types/ApiResponse';

type contacts =  {
  _id: number;
  username: string;
  profileImage: string;
}

type serchedUser ={
  _id: string;
  username: string;
  profileImage: string;
}



function Contacts() {
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const [contactList, setContactList] = useState<contacts[]>([]);
  const [searchedUser, setSearchedUser] = useState<serchedUser>({ });
  const [searchUser, setSearchUser] = useState('');

  const onMouseEnter = () => setIsScrollable(true);
  const onMouseLeave = () => setIsScrollable(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUser(e.target.value);
  };

  useEffect(() => {
    async function fetchContacts() {
      try {
        const { data } = await axios.get<IApiResponse>('/api/get-users');
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
        const { data } = await axios.get<IApiResponse>(`/api/search-user?search=${searchUser}`);
        setSearchedUser(data.data || {});
      } catch (error) {
        console.error(error);
      }
    }

    searchUserRequest();
  }, [searchUser]);


  return (
    <div className='fixed w-[30vw] top-0 left-0 h-screen bg-lightBackground overflow-hidden'>
      <header className='w-[30vw] top-0 left-0 fixed bg-lightBackground h-24 flex flex-col items-center gap-3 py-4 px-4 md:px-10'>
        <h1 className='text-3xl font-semibold text-center'>Contacts</h1>
        <Input value={searchUser} onChange={handleChange} className='bg-stone-900 px-3 py-2' placeholder='Search here...' />
      </header>

      <main onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`w-full mt-24 py-3 px-4 md:px-8 flex-1 overflow-x-hidden ${isScrollable ? "overflow-y-auto" : "overflow-y-hidden"} no-scroll`} style={{ height: "calc(100vh - 8rem)" }}>
        {contactList.length > 0 ? (
          <div className='space-y-4'>
            {contactList.map(contact => (
              <div key={contact._id}>
                <div className='flex items-center gap-4 p-3 bg-darkGray rounded-lg hover:bg-stone-700'>
                  <img src={contact.profileImage} alt={contact.username} className='w-12 h-12 rounded-full object-cover' />
                  <div className='flex flex-col'>
                    <span className='font-semibold text-white'>{contact.username}</span>
                    <span className='text-sm text-gray-400'>hello</span>
                  </div>
                  <span className='ml-auto text-sm text-gray-500'>67</span>
                </div>
                <Separator orientation='horizontal' className="my-1 bg-white h-[0.5px]" />
              </div>
            ))}
          </div>
        ) : !searchedUser._id && (
          <p className="text-center text-gray-400 mt-4">No contacts found</p>
        )}

        {searchedUser._id && (
          <div key={searchedUser._id}>
            <div className='flex items-center gap-4 p-3 bg-darkGray rounded-lg hover:bg-stone-700'>
              <img src={searchedUser.profileImage} alt={searchedUser.username} className='w-12 h-12 rounded-full object-cover' />
              <div className='flex flex-col'>
                <span className='font-semibold text-white'>{searchedUser.username}</span>
                <span className='text-sm text-gray-400'>hello</span>
              </div>
              <span className='ml-auto text-sm text-gray-500'>67</span>
            </div>
            <Separator orientation='horizontal' className="my-1 bg-white h-[0.5px]" />
          </div>
        )}

      </main>
    </div>
  );
}

export default Contacts;
