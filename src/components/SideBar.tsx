"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Loader2, LogOut } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


function SideBar() {
  const { data: session, status } = useSession();

  const handelSignOut = (e: React.MouseEvent) => {
    signOut()
  }

  if (!session || status === "unauthenticated" || status === "loading") return <div className=' h-screen w-[7vw] flex justify-center fixed right-0 top-0 bg-lightBackground text-foreground px-2 py-5 md:py-10'>
    <Loader2 className='w-[60%] object-cover animate-spin' />
  </div>


  console.log(session)
  return (
    <>
      <aside className="flex flex-col h-screen w-[7vw] fixed right-0 top-0 bg-lightBackground text-foreground px-2 py-5 md:py-10 items-center justify-start gap-6">
        <Popover>
          <PopoverTrigger asChild>
            <img src={"/user.png"} alt="" className="w-[50%] object-cover cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-[700px] fixed top-0 h-[400px] right-[7%] bg-stone-600 z-20">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">

                </div>
                <div className="grid grid-cols-3 items-center gap-4">

                </div>
                <div className="grid grid-cols-3 items-center gap-4">

                </div>
                <div className="grid grid-cols-3 items-center gap-4">

                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      
        <LogOut onClick={handelSignOut} className='w-[50%] text-foreground' />
      </aside>
      
    </>
  );
}

export default SideBar
