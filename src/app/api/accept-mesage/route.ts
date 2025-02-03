import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            message: "Invalid session, Not authenticated",
            success: false
        }, { status: 401 })
    }

    const userId: string = user._id as string;

    const { acceptMessage } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: userId },
            {
                isAcceptingMessage: acceptMessage
            }, { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json({
                message: "Failed to update user status to accept message",
                success: false,
                updatedUser
            }, { status: 401 });
        }
        return NextResponse.json({
            message: "User status updated successfully",
            success: true
        }, { status: 200 })
    } catch (error: any) {
        console.error("Error accepting message ", error)
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: error.status })
    }

}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            message: "Invalid session, Not authenticated",
            success: false
        }, { status: 401 })
    }

    const userId: string = user._id as string;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({
                message: "Failed to find user",
                success: false
            }, { status: 404 });
        }
        return NextResponse.json({
            message: "User fetched successfully",
            success: true,
            isAcceptingMessage: user.isAcceptingMessage
        }, { status: 200 })

    } catch (error: any) {
        console.log("Error i finding user ", error)
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: error.status })
    }

}
