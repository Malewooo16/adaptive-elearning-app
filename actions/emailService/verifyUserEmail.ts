"use server"
import WelcomeEmail from '@/components/EmailTemplates/VerifyEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({userEmail, userName, verificationLink}: {userEmail:string; userName: string, verificationLink: string}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@jaadvocates.co.tz>',
      to: userEmail,
      subject: 'EduNex - Verify Your Email Address',
      react: WelcomeEmail({
        userName, verificationLink,}),
    });

    if (error) {
        console.error("Error sending email:", error);
      return {success: false, message: error.message};
    }

    return {success: true, message: 'Verification email sent successfully'};
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {success: false, message: "Verification Failed"}
  }
}