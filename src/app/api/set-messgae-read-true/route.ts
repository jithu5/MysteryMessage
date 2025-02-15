// for setting message to true if user chatting with chatbox open

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/message";
import { NextRequest, NextResponse } from "next/server";
import { User } from "next-auth";


export async function POST(request: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!user || !user._id) {
        return NextResponse.json({
            message: "User not authenticated",
            success: false
        }, { status: 400 })
    }

    const rawBody = await request.text(); // Get the raw body as a string
    console.log("Raw request body:", rawBody);
    // Manually parse the JSON
    const receiverId = JSON.parse(rawBody);
    const senderId = user._id
    const roomId = [senderId, receiverId].sort().join("_");
    try {
        await MessageModel.updateMany({ roomId }, { $set: { isRead: true } })
        console.log("successfuly marked as read")
        return NextResponse.json({
            success: true,
            message: "Updated messages to read",
        },
            { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            {
                message: "Failed to update messages",
                success: false
            }, { status: error.status }
        )
    }


}