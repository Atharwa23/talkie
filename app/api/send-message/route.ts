import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel, { Message } from "@/app/models/User";
import mongoose from "mongoose";
export async function POST(req: Request) {
    await dbConnect();
    const {username, content} = await req.json();

    try {
        const user = await UserModel.findOne({username}).exec();

        if(!user) {
            return NextResponse.json({success: false, message: "Recipient user not found"}, {status: 404});
        }

        if(!user.isAcceptingMessages) {
            return NextResponse.json({success: false, message: "Recipient is not accepting messages"}, {status: 403});
        }

        const newMessage: Message= {
            _id: new mongoose.Types.ObjectId().toString(),
            content,
            createdAt: new Date(),
        }

        user.messages.push(newMessage);
        await user.save();

        return NextResponse.json({success: true, message: "Message sent successfully"}, {status: 200});

    } catch (error) {
        return NextResponse.json({success: false, message: "An error occurred while sending the message"}, {status: 500});
    }
}