"use client";
import React from "react";

import { PopoverContent } from "@/components/ui/popover";
import ProfileImageUpload from "./ProfileImageUpload";

function ProfileSetting() {
  return (
    <>
      <PopoverContent className="w-[400px] fixed top-0 h-[400px] right-[7%] bg-stone-600 z-20 text-white rounded-xl">
        <div className="">
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-xl md:text-3xl text-center">Profile</h4>
          </div>
         <ProfileImageUpload />
        </div>
      </PopoverContent>
    </>
  );
}

export default ProfileSetting;
