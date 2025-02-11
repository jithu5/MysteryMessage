import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/message";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    try {
        console.log(request.json())
        const { receiverId } = await request.json();
        const senderId = session.user._id;

        const messages = await MessageModel.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name")
            .lean();

        return NextResponse.json(
            { success: true, messages },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error)
        return NextResponse.json(
            { message: "Error fetching messages", success: false, error: error.message },
            { status: 500 }
        );
    }
}