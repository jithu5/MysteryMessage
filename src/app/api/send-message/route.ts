import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MessageModel from "@/model/message";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getIo} from "../../../../express-server"

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    try {
        const { content, receiverId } = await request.json();
        const senderId = session.user._id;

        if (!content || !receiverId) {
            return NextResponse.json(
                { message: "Content and receiver ID required", success: false },
                { status: 400 }
            );
        }

        // Create new message
        const newMessage = await MessageModel.create({
            content,
            sender: senderId,
            receiver: receiverId
        });

        // Populate sender details
        const populatedMessage = await MessageModel.findById(newMessage._id)
            .populate("sender", "name");

        // Get chat room ID
        const participants = [senderId, receiverId].sort();
        const roomId = participants.join("_");

        // Emit message via socket
        const io = getIo();
        if (io) {
            console.log(`Emitting message to room: ${roomId}`);
            io.to(roomId).emit("newMessage", populatedMessage);
        }

        return NextResponse.json(
            { message: "Message sent", success: true, data: populatedMessage },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error sending message", success: false, error: error.message },
            { status: 500 }
        );
    }
}