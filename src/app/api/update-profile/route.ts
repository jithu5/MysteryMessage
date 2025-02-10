import { NextResponse } from "next/server";
import upload from "@/lib/multer.middleware";
import { UploadImageToCloudinary, DeleteImageFromCloudinary } from "@/lib/cloudinary.config";
import { getPublicId } from "@/lib/getPublicId";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import fs from "fs";

// Ensure API runs in Node.js environment
export const runtime = "nodejs";

// Convert Multer callback to a promise-based function
const uploadMiddleware = (req: any) =>
    new Promise((resolve, reject) => {
        upload.single("profileImage")(req, {} as any, (err) => {
            if (err) reject(err);
            else resolve(req);
        });
    });

export async function POST(req: Request) {
    console.log("inside upload route")
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401 });
    }

    const user: any = session.user;
    const userId = new mongoose.Types.ObjectId(user._id);

    if (!userId) {
        return NextResponse.json({ message: "User ID not found", success: false }, { status: 404 });
    }

    try {
        const userData = await UserModel.findById(userId);
        console.log(userData)
        if (!userData) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        
        // Parse form-data
        await uploadMiddleware(req as any);
        
        // Ensure file is uploaded
        const multerRequest = req as any;
        console.log(multerRequest)
        if (!multerRequest.file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }
        
        const filePath = req.file.path;
        console.log(filePath)

        // Remove temp file after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Temporary file deleted.");
        }

        // Delete old profile image from Cloudinary
        if (userData.profileImage) {
            const public_id = await getPublicId(userData.profileImage);
            await DeleteImageFromCloudinary(public_id);
        }

        // Upload to Cloudinary
        const uploadedImage = await UploadImageToCloudinary(filePath);

        // Remove temp file after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Temporary file deleted.");
        }

        if (!uploadedImage) {
            return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
        }

        // Update user profile image in DB
        userData.profileImage = uploadedImage.secure_url;
        await userData.save();

        return NextResponse.json({
            url: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
