"use client";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { CloudUpload, X } from "lucide-react";
import React, { useRef, useState } from "react";

function ProfileImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const profileRef = useRef<HTMLInputElement | null>(null);

  const{toast} = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setImage(selectedFile);
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImage(droppedFile);
  };

  const handleClearImage = () => {
    setImage(null);
    if (profileRef.current) profileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    const formData = new FormData()
    formData.append("profileImage", image!);

    // print formData in for loop
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    // Make API call to upload the image
    try {
      const { data } = await axios.post('/api/update-profile', formData,{withCredentials:true});
      if (!data.success) {
        toast({
          title: "Image Upload Failed",
          description: data.message,
          variant: "destructive",
        })
        return;
      }
      toast({
        title: "Image Uploaded Successfully",
        description: data.message,
        variant: "default",
      })
    } catch (error : any) {
      console.log("Error in uploading profile image")
      toast({
        title: "Image Upload Failed",
        description:error.message,
        variant: "destructive",
      })
    }

  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="flex flex-col items-center max-w-[80%] mx-auto"
    >
      <div className="w-full flex flex-col items-center gap-2 mt-10">
        <label htmlFor="profileImage" className="text-secondary font-semibold text-lg md:text-xl">
          Profile Image
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragDrop}
          className="w-[80px] md:w-[160px] p-4 h-20 md:h-[160px] border-[2px] border-dashed border-white rounded-lg"
        >
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            className="hidden"
            ref={profileRef}
            onChange={handleFileChange}
          />
          {!image ? (
            <label htmlFor="profileImage" className="flex flex-col items-center justify-center cursor-pointer p-2">
              <CloudUpload className="text-3xl md:text-6xl" />
              <span className="text-xs md:text-sm">Drag & Drop or Click to upload</span>
            </label>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <img
                src={URL.createObjectURL(image)}
                alt="Profile"
                className="w-12 h-12 object-cover rounded-xl"
              />
              <X onClick={handleClearImage} className="text-md md:text-lg cursor-pointer" />
            </div>
          )}
        </div>
      </div>
      <button type="submit" className="mt-5 px-2 py-1 text-white bg-stone-800 rounded-md hover:bg-stone-950 w-[60px] md:w-[110px] mx-auto">
        Edit
      </button>
    </form>
  );
}

export default ProfileImageUpload;
