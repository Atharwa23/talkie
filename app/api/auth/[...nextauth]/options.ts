import { NextAuthOptions } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bycrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) : Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ email: credentials.email,});
                    if(!user) {
                        throw new Error("No user found with the provided email.");
                    }

                    if(!user.isVerified) {
                        throw new Error("Email not verified. Please verify your email before logging in.");
                    }

                    const isPasswordValid = await bycrypt.compare(credentials.password, user.password);
                    if(isPasswordValid) {
                        return user;
                    } else {
                        throw new Error("Invalid password. Please try again.");
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    throw new Error(`Authentication failed: ${message}`);
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },

        async session({ session, token }) {
            if(token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    secret: process.env.NEXTAUTH_SECRET,
}