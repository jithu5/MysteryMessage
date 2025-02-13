import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import MessageModel from "@/model/message";


export async function POST(req: NextRequest) {
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

    const rawBody = await req.text(); // Get the raw body as a string

    console.log("Raw request body:", rawBody);
    if (!rawBody) {
        return NextResponse.json({ message: "Invalid request body", success: false }, { status: 400 });
    }

    const receiverId = JSON.parse(rawBody);
        console.log("receiver id ", receiverId)

        if (!receiverId) {
            return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401});
        }
        try {
            const users = await MessageModel.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: new mongoose.Types.ObjectId(userId) },
                            { receiver: new mongoose.Types.ObjectId(userId) }
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            $cond: {
                                if: { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                                then: "$receiver",
                                else: "$sender"
                            }
                        },
                        lastMessage: { $last: "$$ROOT" } // Get the last message document
                    }
                },
                {
                    $lookup: {
                        from: "users", // Collection name in MongoDB
                        localField: "_id",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: "$userDetails._id",
                        username: "$userDetails.username",
                        email: "$userDetails.email",
                        profileImage: "$userDetails.profileImage",
                        lastMessage: {
                            text: "$lastMessage.content", // Assuming `content` stores the message
                            createdAt: "$lastMessage.createdAt",
                            
                        }
                    }
                }
            ]);

            console.log(users)
            return NextResponse.json({ message: "Success", success: true, data:users });
        } catch (error: any) {
            console.log("Error in getting contact",error)
            return NextResponse.json({ message: "Failed to get contacts", success: false, error: error.message }, { status: 500 });
        }
}