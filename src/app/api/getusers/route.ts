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

        if (!recieverId) {
            return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401});
        }
        try {
            const users = await UserModel.aggregate([
                {$match:{_id:userId}},
                
            ])
        } catch (error) {
            
        }
}