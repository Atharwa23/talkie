import dbConnect from "@/app/lib/dbConnect"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/app/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);
    
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: userId, messages: {$push: '$messages'}}}
        ]).exec();

        if(!user || user.length === 0) {
            return NextResponse.json({success: false, message: "User not found"}, {status: 404});
        }

        return NextResponse.json({success: true, messages: user[0].messages}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, message: "An error occurred while fetching messages"}, {status: 500});
    }
}