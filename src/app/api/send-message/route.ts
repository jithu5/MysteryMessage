import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { IMessage } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 })
        }

        // is user accepting messages 
        if (!user.isAcceptingMessage) {
            return NextResponse.json({ message: "User is not accepting messages", success: false }, { status: 403 })
        }

        const newMessage: IMessage = {
            content: content,
            createdAt: new Date(),
        }

        user.messages.push(newMessage)
        await user.save()

        return NextResponse.json({ message: "Message sent successfully", success: true }, { status: 201 })
    } catch (error: any) {
        console.log("Error in sending message ",error)
        return NextResponse.json({ message: error.message, success: false }, { status: error.status })
    }
}