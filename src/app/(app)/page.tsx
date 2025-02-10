"use client"
import Contacts from '@/components/Contacts'
import ChatBox from '@/components/ChatBox'
import SideBar from "@/components/SideBar"
// import Footer from '@/components/Footer'
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
  console.log(user)
  return (
    <>
      <main className='flex items-center justify-between w-full relative'>
        <Contacts />
        <ChatBox />
        <SideBar />
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default page
