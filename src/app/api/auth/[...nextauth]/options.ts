import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                console.log(credentials)

                try {
                    // Find user by email or username
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.email }, { username: credentials.email }]
                    });

                    if (!user) {
                        throw new Error("No user found with this email or username.");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before logging in.");
                    }

                    // Check password
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Invalid email or password.");
                    }

                    // Return only serializable user data (avoid returning full Mongoose document)
                    return user
                } catch (error: any) {
                    console.error("Auth error:", error.message);
                    throw new Error(error.message || "Something went wrong");
                }
            }
        })
    ],
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in",  // Redirect to custom login page
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,


};
