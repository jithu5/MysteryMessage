"use client"
import Contacts from '@/components/Contacts'
import ChatBox from '@/components/ChatBox'
import SideBar from "@/components/SideBar"
import React, { useEffect } from 'react'
import useUserStore from '@/store/userSore'
import axios from 'axios'

function page() {
  const { setUser,user } = useUserStore()
  useEffect(() => {
    async function fetchUser() {
      const {data} = await axios.get('/api/get-user')
      if (!data.success) {
        return
      }
      setUser(data.data)
    }
    fetchUser()
  }, [setUser])

  return (
    <>
      <main className='w-full relative grid grid-cols-1 md:grid-cols-3 h-screen overflow-hidden'>
        <Contacts />
        <ChatBox />
        {/* <SideBar /> */}
      </main>
    </>
  )
}

export default page
