import dbConnect from "@/app/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/app/models/User";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid;
    try {
        dbConnect();
        const session = await getServerSession(authOptions);
        if(!session || !session.user) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
        } 

        const userid = session.user._id;

        const resp = await UserModel.updateOne(
            {id: userid},
            {$pull: {messages: {_id: messageId}}}
        )

        if(resp.modifiedCount === 0) {
            return NextResponse.json({success: false, message: "Message not found"}, {status: 404});
        }

        return NextResponse.json({success: true, message: "Message deleted successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, message: "An error occurred while deleting the message"}, {status: 500});
    }
}