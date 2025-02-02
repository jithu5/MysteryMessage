import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

import bcrypt from "bcryptjs"



export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            $and: [
                { $or: [{ username: username }, { email: email }] },
                { isVerified: true }]
        })
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({ message: "User already exists", success: false }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUserWithoutVerified = await UserModel.findOne({
            $or: [{ username: username }, { email: email }]
        })


        if (existingUserWithoutVerified) {
            await UserModel.findOneAndUpdate({
                $or: [{ username: username }, { email: email }]
                },
                {
                    username: username,
                    email: email,
                    password: hashedPassword,
                    verifyCode: verifyCode,
                    verifyCodeExpiry: expiryDate
                },
                {new:true,runValidators:true})
        } else {
            await UserModel.create({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate
            })
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        console.log("Email Response",emailResponse)

        if (!emailResponse.success) {
            return NextResponse.json({
                message:emailResponse.message || "Failed to send verification email", success: false
            },{status:500})
        }

        return NextResponse.json({ message: "User registered successfully, Please verify your email.", success: true }, { status: 201 })

    } catch (error) {
        console.log("Error registering user: ", error)
        return NextResponse
            .json(
                {
                    message: "Error registering user", success: false
                },
                { status: 500 }
            )}
}