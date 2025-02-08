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
    const user: User = session?.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);

    if (!userId) {
        return NextResponse.json({
            message: "Invalid session, Not authenticated",
            success: false
        }, { status: 401 })
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 401 })
        }
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        }, {
            status: error.status
        })
    }
}