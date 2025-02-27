"use client"

import { signOut, useSession } from 'next-auth/react'
import { Loader2, LogOut } from 'lucide-react';
import ProfileSetting from "@/components/ProfileSetting"
import useUserStore from '@/store/userSore';

import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover"


function SideBar() {
  const { data: session, status } = useSession();
  const {user,clearUser} = useUserStore()

  const handelSignOut = (e: React.MouseEvent) => {
    signOut()
    clearUser();
  }
  
  

  if (!session || status === "unauthenticated" || status === "loading") return <div className=' h-screen w-[7vw] flex justify-center fixed right-0 top-0 bg-lightBackground text-foreground px-2 py-5 md:py-10'>
    <Loader2 className='w-[60%] object-cover animate-spin' />
  </div>


  return (
    <>
      <aside className="flex flex-col h-screen w-[7vw] fixed right-0 top-0 bg-lightBackground text-foreground px-2 py-5 md:py-10 items-center justify-start gap-6">
        <Popover>
          <PopoverTrigger asChild>
            <img src={user?.profileImage || "/user.png"} alt="" className="w-10 h-10 object-cover cursor-pointer rounded-full object-center" />
          </PopoverTrigger>
          <ProfileSetting />
        </Popover>
      
        <LogOut onClick={handelSignOut} className='w-[50%] p-0 text-foreground cursor-pointer hover:text-white'  />
      </aside>
      
    </>
  );
}

export default SideBar
