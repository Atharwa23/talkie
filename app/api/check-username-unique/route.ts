import UserModel from "@/app/models/User";
import dbConnect from "@/app/lib/dbConnect";
import { UsernameValidation } from "@/app/Schema/signUpSchema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();
    console.log("DEBUG: URI is", process.env.MONGODB_URI ? "Defined" : "UNDEFINED");
    try {
        const { searchParams } = new URL(request.url);
        const usernameQuery = searchParams.get('username')

        const result = UsernameValidation.safeParse(usernameQuery);

        if(!result.success) {
            return NextResponse.json({ success: false, message: "Invalid username format." }, { status: 400 });
        }

        const username = result.data;
        
        const existingUser = await UserModel.findOne({username, isVerified: true});
        if(existingUser) {
            return NextResponse.json({ success: false, message: "Username is already taken." }, { status: 409 });
        }

        return NextResponse.json({ success: true, message: "Username is unique" });

    }   catch (error) {
        return NextResponse.json({ success: false, message: "An error occurred while validating the username." }, { status: 500 });
    }
}