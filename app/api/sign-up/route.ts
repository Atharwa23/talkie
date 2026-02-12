import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const {username, email, password} = await req.json();

        // if user already exists and is verified, return error
        const existingVerifiedUserbyUsername = await UserModel.findOne({ username, isVerified: true });
        if(existingVerifiedUserbyUsername) {
            return Response.json({success: false, message: "User already exists."}, {status: 400});
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(10000+ Math.random() * 90000).toString();

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({ success: false, message: "Email is already registered." }, { status: 400 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
                existingUserByEmail.verifyCode = verifyCode;
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate
            })
        }

        // send Verification Email
        const emailResposne = await sendVerificationEmail({username, verifyCode, email})
        if(!emailResposne.success) {
            return Response.json({ success: false, message: emailResposne.message }, { status: 500 });
        }

        return Response.json({ success: true, message: "User registered successfully. Verification email sent." }, { status: 201 });

    } catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json({ success: false, message: "Internal server error." }, { status: 500 });
    }
}