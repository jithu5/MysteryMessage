import mongoose from "mongoose";

const unreadCountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    unreadCount: { type: Number, default: 0 },
});

const UnreadCountModel = mongoose.models.UnreadCount || mongoose.model("UnreadCount", unreadCountSchema);

export default UnreadCountModel;