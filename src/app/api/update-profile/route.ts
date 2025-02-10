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

    const currentUser = await UserModel.findById(userId);
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
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.log("Error deleting profile image:", error);
            return NextResponse.json({ message: 'Error deleting profile image', success: false }, { status: 400 });
        }
    }

    try {
        // Convert File object to Buffer for Cloudinary upload
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const result = await cloudinary.uploader.upload_stream(
            { folder: 'whatsapp-profile', resource_type: 'auto' },
            async (error, uploadedImage) => {
                if (error) {
                    return NextResponse.json({ message: 'Cloudinary upload failed', success: false }, { status: 500 });
                }
                currentUser.profileImage = uploadedImage.secure_url;
                await currentUser.save();
            }
        ).end(fileBuffer);

        return NextResponse.json({ data: currentUser, message: "Profile image updated successfully", success: true }, { status: 200 });

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: error.message, success: false, error: error.message }, { status: 500 });
    }
}
