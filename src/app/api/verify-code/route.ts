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
        console.log(typeof code)
        const result = await VerifyCodeQuerySchema.safeParse({code:{code}})
        console.log("Error in code valid ", result.error)
        console.log(result.success)
        console.log(result.data)
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
        console.log("user verify code ",user.verifyCode)
        const isCodeValid = user.verifyCode === code;

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        console.log("isCodeValid ", isCodeValid)
        console.log("isCodeNotExpired ", isCodeNotExpired)

        if (!isCodeValid || !isCodeNotExpired) {
            return NextResponse.json({
                message: "Invalid verification code or code has expired",
                success: false
            }, { status: 401 })
        }

        user.isVerified = true;
        // user.verifyCode = '';
        await user.save();

        return NextResponse.json({
            message: "User has been verified successfully",
            success: true
        }, { status: 200 })

    } catch (error: any) {
        console.log("Error verifying user ", error.message);
        return NextResponse.json({
            message: error.message,
            success: false
        })
    }
}