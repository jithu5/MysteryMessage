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
    try {
        const user = await UserModel.findById(userId).select("-password -verifyCode -verifyCodeExpiry -messages");
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ data:user, success: true, message: "User feched successfully"},{status:200});
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching user", success: false },
            { status: 500 }
        )
    }
}