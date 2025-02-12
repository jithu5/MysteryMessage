import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
import MessageModel from "@/model/message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
// import { getIo } from "../../../../express-server"

export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        console.log(body)
        const { content, receiverId } = body;
        const senderId = session.user._id;

        if (!content || !receiverId) {
            return NextResponse.json(
                { message: "Content and receiver ID required", success: false },
                { status: 400 }
            );
        }

        const roomId = [senderId, receiverId].sort().join("_")

        const newMessage = await MessageModel.create({
            sender: senderId,
            receiver: receiverId,
            content: content,
            roomId: roomId
        })

        console.log(newMessage)

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        },
            {
                status: 201
            })


    } catch (error: any) {
        return NextResponse.json(
            { message: "Error sending message", success: false, error: error.message },
            { status: 500 }
        );
    }
}