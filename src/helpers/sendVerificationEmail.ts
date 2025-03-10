import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { IApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<IApiResponse>{

    try {
        
        const res= await resend.emails.send({
            from: '',
            to: email,
            subject: "Mystry Message Verify your email address",
            react:VerificationEmail({username,otp:verifyCode})
        })
        console.log("response from resend: " + res.data)
        console.log("error from resend: " + res.error)
        return{
            status: 200,
            message: "Verification email sent successfully",
            success: true,
            isAcceptingMessage: true,
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Failed to send verification email",
            success: false,
            
        }
    }
}