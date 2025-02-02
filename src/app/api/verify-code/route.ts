import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

import {z} from "zod";
import { verifySchema } from "@/schemas/verifySchema";


const VerifyCodeQuerySchema = z.object({
    code: verifySchema
})

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const result = await VerifyCodeQuerySchema.safeParse(code)
        if (!result.success) {
            const codeErrors = result.error.format().code?._errors || [];

            return NextResponse.json({
                message: codeErrors?.length > 0 ? codeErrors.join(', ') : "Invalid query parameters",
                success: false
            }, { status: 400 })
        }

        
    } catch (error) {
        console.log("Error verifying user ",error)
        return NextResponse.json({
            message: "Failed to create new user",
            success: false
        })
    }
}