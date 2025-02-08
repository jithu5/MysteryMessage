import Contacts from '@/components/Contacts'
import ChatBox from '@/components/ChatBox'
import SideBar from "@/components/SideBar"
// import Footer from '@/components/Footer'
import React from 'react'

function page() {
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
