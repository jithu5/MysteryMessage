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

    if (!session || !session.user) {
        return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401 });
    }

    const user: User = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);

    if (!userId) {
        return NextResponse.json({ message: "Not authenticated", success: false }, { status: 404 });
    }

    // Extract query parameter
    const { searchParams } = new URL(req.url);
    const searchedUser = searchParams.get("search");

    if (!searchedUser) {
        return NextResponse.json({ message: "No search query provided", success: false }, { status: 400 });
    }

    try {
        // Case-insensitive search using regex
        const searchUser = await UserModel.findOne({
            username: { $regex: new RegExp(`^${searchedUser}$`, "i") }
        }).select("-password")

        if (!searchUser) {
            return NextResponse.json({ message: "No user found with this username", success: false }, { status: 404 });
        }

        return NextResponse.json({
            message: "User found",
            success: true,
            data: searchUser
        });
    } catch (error) {
        console.error("Error searching user ", error);
        return NextResponse.json({ message: "Failed to search user", success: false }, { status: 500 });
    }
}
