import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;
    console.log(user)

    if (!session || !session?.user) {
        return NextResponse.json({
            message: "Not authenticated",
            success: false
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: { 'messages.createdAt': -1 }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: "$messages" }
                }
            }
        ])

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            },{status:401})
        }

        return NextResponse.json({
            message: "User messages retrieved successfully",
            success: true,
            messages: user[0].messages
        },{status:200})
    } catch (error: any) {
        console.log("Error i finding user in messages", error)
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: error.status })
    }

}