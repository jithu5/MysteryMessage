"use client";
import React from "react";

import { PopoverContent } from "@/components/ui/popover";
import ProfileImageUpload from "./ProfileImageUpload";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import useUserStore from "@/store/userSore";

function ProfileSetting() {
  const { user, clearUser } = useUserStore()
   const handelSignOut = (e: React.MouseEvent) => {
      signOut()
      clearUser();
    }
  return (
    <>
      <PopoverContent className="w-[400px] fixed top-0 h-[400px] left-[10%] bg-stone-600 z-20 text-white rounded-xl">
        <div className="">
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-xl md:text-3xl text-center">Profile</h4>
          </div>
         <ProfileImageUpload />
        </div>
          <LogOut onClick={handelSignOut} className='w-[50%] p-0 text-foreground cursor-pointer hover:text-white' />
      </PopoverContent>
    </>
  );
}

export default ProfileSetting;
