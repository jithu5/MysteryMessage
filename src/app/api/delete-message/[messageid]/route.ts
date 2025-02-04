import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextResponse } from "next/server";


export async function DELETE(request: Request, { params }: { params: { messagid: string } }) {
    const messageId = params.messagid;

    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            message: "Invalid session, Not authenticated",
            success: false
        }, { status: 401 })
    }
    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            {
                $pull: {
                    messages: {
                        _id: messageId
                    }
                }
            }
        )
        if (updatedResult.matchedCount === 0) {
            return NextResponse.json({
                message: "Message not found",
                success: false
            }, { status: 404 })
        }
        return NextResponse.json({
            message: "Message deleted successfully",
            success: true
        }, { status: 200 })
    } catch (error: any) {
        console.log("Error in deleting message", error)
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: error.status });
    }
}