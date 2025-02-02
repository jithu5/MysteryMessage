import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)

        const queryParam = {
            username: searchParams.get('username'),
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return NextResponse.json({
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters",
                success: false
            }, { status: 400 })
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return NextResponse.json({
                message: "Username is already taken",
                success: false
            }, { status: 409 })
        }

        return NextResponse.json({
            message: "Username is available",
            success: true
        }, { status: 200 })

    } catch (error) {
        console.error("Error checking username ", error)
        return NextResponse.json({
            message: "Failed to check username",
            success: false
        }, { status: 500 })
    }
}