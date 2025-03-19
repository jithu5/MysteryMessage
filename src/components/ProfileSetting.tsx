"use client";
import React from "react";

import { PopoverContent } from "@/components/ui/popover";
import ProfileImageUpload from "./ProfileImageUpload";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import useUserStore from "@/store/userSore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";

function ProfileSetting() {
  const { user, clearUser } = useUserStore()
  const handelSignOut = (e: React.MouseEvent) => {
    signOut()
    clearUser();
  }
  return (
    <>
      <PopoverContent className="w-[200px] fixed top-0 h-[400px] -right-5 md:-right-16 bg-stone-800 z-20 text-white rounded-xl flex flex-col items-center py-5 gap-6">
        <div className="">
          <div className="space-y-1">

          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button >Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <ProfileImageUpload />
             
            </DialogContent>
          </Dialog>
        </div>
        <LogOut onClick={handelSignOut} className='w-[50%] p-0 text-foreground cursor-pointer hover:text-white' />
      </PopoverContent>
    </>
  );
}

export default ProfileSetting;
