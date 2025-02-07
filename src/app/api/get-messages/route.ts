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

    try {
        const userMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "messages.sender",
                    foreignField: "_id",
                    as: "senderDetails",
                },
            },
            {
                $project: {
                    _id: "$messages._id",
                    content: "$messages.content",
                    sender: { $arrayElemAt: ["$senderDetails.username", 0] },
                    date: "$messages.createdAt",
                },
            },
            { $sort: { date: -1 } },
        ]);

        return NextResponse.json(
            {
                message: "User messages retrieved successfully",
                success: true,
                messages: userMessages.length > 0 ? userMessages : [],
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error retrieving messages:", error);
        return NextResponse.json(
            { message: "Error retrieving messages", success: false },
            { status: 500 }
        );
    }
}
