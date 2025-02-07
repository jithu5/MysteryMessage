import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MessageModel from "@/model/message";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401 });
    }

    const senderId = new mongoose.Types.ObjectId(session.user._id);

    try {
        const { content, recieverid } = await request.json(); // Extract from body

        if (!content || !recieverid) {
            return NextResponse.json({ message: "Content and receiver ID required", success: false }, { status: 400 });
        }

        const recieverId = new mongoose.Types.ObjectId(recieverid);

        // Fetch sender and receiver
        const sender = await UserModel.findById(senderId);
        const reciever = await UserModel.findById(recieverId);

        if (!sender || !reciever) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        if (!reciever.isVerified) {
            return NextResponse.json({ message: "Receiver is not verified", success: false }, { status: 403 });
        }

        // Create and save the message in `MessageModel`
        const newMessage = await MessageModel.create({
            content,
            sender: senderId,
            reciever: recieverId,
            role: "sender",
            createdAt: new Date()
        });
        sender.messages.push(newMessage._id);
        await sender.save();

        reciever.messages.push(newMessage._id);
        await reciever.save();

        return NextResponse.json({ message: "Message sent successfully", success: true, data: newMessage }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error sending message", success: false, error: error.message }, { status: 500 });
    }
}
