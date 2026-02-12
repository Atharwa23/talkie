import UserModel from "@/app/models/User";
import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    
    try {
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUsername, verifyCode: code});
        
        if(!user) {
            return NextResponse.json({ success: false, message: "User does not exixt." }, { status: 400 });
        }

        const isValidCode = (user.verifyCode === code)
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isValidCode && isCodeNotExpired) {
            user.isVerified = true;
            user.verifyCode = "";
            user.verifyCodeExpiry = new Date(0);
            await user.save();
            return NextResponse.json({ success: true, message: "Email verified successfully." });
        } else if(!isCodeNotExpired) {
            return NextResponse.json({ success: false, message: "Verification code has expired." }, { status: 400 });
        } else {
            return NextResponse.json({ success: false, message: "Invalid verification code." }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: "An error occurred while verifying the code." }, { status: 500 });
    }
}