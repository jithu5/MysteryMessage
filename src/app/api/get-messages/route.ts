import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return NextResponse.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    const user: User = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);

    const {recieverId} = await req.json();

    try {

        // Aggregation Pipeline
        const messages = await UserModel.aggregate([
            { $match: { _id: userId } }, // Match the logged-in user
            { $unwind: "$messages" }, // Unwind the messages array
            { $match: { "messages.reciever": recieverId } }, // Filter messages where receiverId matches
            { $sort: { "messages.createdAt": 1 } }, // Sort by createdAt (oldest first)
            { $project: { _id: 0, messages: 1 } } // Return only messages
        ])

        // if (messages.length === 0) {
        //     return NextResponse.json({success:true,})
        // }

        return NextResponse.json({ success: true, messages, message:"Fteched messages successfully" },{status:200});
    } catch (error: any) {
        console.error("Error retrieving messages:", error);
        return NextResponse.json(
            { message: "Error retrieving messages", success: false },
            { status: 500 }
        );
    }
}
