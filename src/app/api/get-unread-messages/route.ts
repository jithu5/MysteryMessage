import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
import MessageModel from "@/model/message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendError } from "next/dist/server/api-utils";
// import { getIo } from "../../../../express-server"

export async function GET(request: NextRequest) {

    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    const messages = await MessageModel.find({
        isRead: false,
        sender: { $ne: session.user._id }
    })
    // console.log("Unread messages: ", messages)
    return NextResponse.json({ data:messages, success: true });
}

