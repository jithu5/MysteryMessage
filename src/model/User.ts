import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    content: string;
    createdAt: Date;
    sender: object;
    reciever: object;
    role:string;
}

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    messages: IMessage[];
    profileImage:string;
}

const MessageSchema: Schema<IMessage> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reciever: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    role:{
        type: String,
        enum: ["sender", "receiver"],
        default: "sender"
    }
})


const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profileImage:{
        type: String,
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User",UserSchema);


export default UserModel;