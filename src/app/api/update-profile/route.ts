import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from 'next-auth';
import UserModel from '@/model/User';
import { authOptions } from '../auth/[...nextauth]/options';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export async function POST(req: Request) {
    if (req.method !== 'POST')
        return NextResponse.json({ message: "Invalid request", success: false }, { status: 404 });

    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "User not authenticated", success: false }, { status: 401 });
    }

    const user: User = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);
    if (!userId)
        return NextResponse.json({ message: "User not authenticated", success: false }, { status: 401 });

    const currentUser = await UserModel.findById(userId).select("-password -verifyCode -verifyCodeExpiry -messages");
    if (!currentUser)
        return NextResponse.json({ message: "User not found", success: false }, { status: 401 });

    // Get FormData from request
    const formData = await req.formData();
    const file = formData.get('profileImage') as File;

    if (!file)
        return NextResponse.json({ message: 'No file uploaded', success: false }, { status: 400 });

    // Delete the old profile image from Cloudinary
    if (currentUser.profileImage) {
        const profileImageUrl = currentUser.profileImage;
        const parts = profileImageUrl.split('/');
        const publicIdWithExtension = parts[parts.length - 1]; // Last part of the URL
        const publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension

        try {
            await cloudinary.uploader.destroy(`whatsapp-profile/${publicId}`);
        } catch (error) {
            console.log("Error deleting profile image:", error);
            return NextResponse.json({ message: 'Error deleting profile image', success: false }, { status: 400 });
        }
    }

    try {
        // Convert File object to Buffer for Cloudinary upload
        const fileBuffer = Buffer.from(await file.arrayBuffer());


        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "whatsapp-profile", resource_type: "auto" },
                async (error, uploadedImage) => {
                    if (error || !uploadedImage) {
                        reject(NextResponse.json({ message: "Cloudinary upload failed", success: false }, { status: 500 }));
                        return;
                    }

                    console.log("Uploaded image:", uploadedImage);

                    try {
                        const updatedUser = await UserModel.findByIdAndUpdate(
                            userId,
                            { profileImage: uploadedImage.secure_url },
                            { new: true } // ✅ Returns the updated user
                        );

                        if (!updatedUser) {
                            reject(NextResponse.json({ message: "User not found", success: false }, { status: 404 }));
                            return;
                        }

                        resolve(NextResponse.json({ message: "Profile updated", success: true, data: updatedUser }, { status: 200 }));
                    } catch (dbError) {
                        reject(NextResponse.json({ message: "Error updating profile image", success: false }, { status: 400 }));
                    }
                }
            ).end(fileBuffer);
        });

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: error.message, success: false, error: error.message }, { status: 500 });
    }
}
