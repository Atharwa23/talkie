import dbConnect from "@/app/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
    }

    const userId = session.user._id;
    const {acceptMessages} = await req.json();
    try {
        const User = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessages: acceptMessages}, {new: true});

        if(!User) {
            return NextResponse.json({success: false, message: "User not found"}, {status: 404});
        }
        return NextResponse.json({success: true, message: "Message preference updated successfully", isAcceptingMessages: User.isAcceptingMessages});
    } catch (error) {
        return NextResponse.json({success: false, message: "An error occurred while updating message preference"}, {status: 500});
    }
}