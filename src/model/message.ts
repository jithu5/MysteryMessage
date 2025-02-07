import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    content: string;
    createdAt: Date;
    sender: mongoose.Types.ObjectId;
    reciever: mongoose.Types.ObjectId;
    role: "sender" | "receiver";
}

const MessageSchema: Schema<IMessage> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciever: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: ["sender", "receiver"],
        default: "sender"
    }
});

const MessageModel = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export default MessageModel;
