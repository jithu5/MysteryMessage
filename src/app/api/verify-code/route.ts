import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";


const VerifyCodeQuerySchema = z.object({
    code: verifySchema
})

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const result = await VerifyCodeQuerySchema.safeParse(code)
        if (!result.success) {
            const codeErrors = result.error.format().code?._errors || [];

            return NextResponse.json({
                message: codeErrors?.length > 0 ? codeErrors.join(', ') : "Invalid query parameters",
                success: false
            }, { status: 400 })
        }

        const user = await UserModel.findOne({ username: username })

        if (!user) {
            return NextResponse.json({
                message: "No user found with this username",
                success: false
            }, { status: 404 })
        }

        const isCodeValid = user.verifyCode === code;

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (!isCodeValid || !isCodeNotExpired) {
            return NextResponse.json({
                message: "Invalid verification code or code has expired",
                success: false
            }, { status: 401 })
        }

        user.isVerified = true;
        user.verifyCode = '';
        await user.save();

        return NextResponse.json({
            message: "User has been verified successfully",
            success: true
        }, { status: 200 })

    } catch (error) {
        console.log("Error verifying user ", error)
        return NextResponse.json({
            message: "Failed to create new user",
            success: false
        })
    }
}