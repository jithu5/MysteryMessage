import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!user) return NextResponse.json({ message: "User not found", success: false }, { status: 404 });


    const recipient = req.nextUrl.searchParams.get("recipientId");

    if (!recipient) return NextResponse.json({ message: "Recipient ID is required", success: false }, { status: 400 });
    try {
        if (!mongoose.Types.ObjectId.isValid(recipient)) return NextResponse.json({ message: "Invalid recipient", success: false }, { status: 400 });
        const user = await UserModel.findById(recipient).select("-password -verifyCode -verifyCodeExpiry -messages");
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ data: user, success: true, message: "User feched successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Error fetching user", success: false },
            { status: 500 }
        )
    }

}