import { resend } from "@/app/lib/resend";
import { verificationEmail } from "@/emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";


export async function sendVerificationEmail({username, verifyCode, email}: {username: string, verifyCode: string, email: string}): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Talkie Verification Code',
            react: verificationEmail({ username, verifyCode}),
        });

        return {success: true, message: "Verification email sent successfully."};
    } catch(error) {
        console.error("Error sending verification email:", error);
        return {success: false, message: "Failed to send verification email."};
    }
}