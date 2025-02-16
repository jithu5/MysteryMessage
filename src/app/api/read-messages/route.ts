import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/message";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    try {
        const rawBody = await request.text(); // Get the raw body as a string
        console.log("Raw request body:", rawBody);
        // Manually parse the JSON
        const receiverId = JSON.parse(rawBody);
        const senderId = session.user._id;

        if (!senderId) {
            return NextResponse.json({ message: "Invalid user ID", success: false }, { status: 400 });
        }
        const unreadMessage = await MessageModel.find({
            isRead: false,
            sender: { $ne: session.user._id }
        })

        let message = null
        if (receiverId) {
            const roomId = [senderId, receiverId].sort().join("_");

            // Fetch the updated messages after marking them as read
            const updatedMessages = await MessageModel.find({ roomId });

            updatedMessages.forEach(async message => {
                console.log("in updating to true ", JSON.stringify(message.sender), JSON.stringify(receiverId), message.content);
                if (JSON.stringify(message.sender) == JSON.stringify(receiverId)) {
                    console.log('inside')
                    await MessageModel.updateMany({ roomId }, { $set: { isRead: true } });
                }
            })
            message = await MessageModel.find({ roomId })
        }

        console.log('unread message in chatbox :', unreadMessage)
        return NextResponse.json({ data: { message:message, unreadMessage }, success: true, message: "successfully fetched messages" }, {
            status: 200  // Status code 200 means the request was successful.
        });


    } catch (error: any) {
        console.log(error)
        return NextResponse.json(
            { message: "Error fetching messages", success: false, error: error.message },
            { status: 500 }
        );
    }
}