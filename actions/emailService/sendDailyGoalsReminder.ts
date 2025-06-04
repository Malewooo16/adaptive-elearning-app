"use server"
import DailyGoalReminderEmail from '@/components/EmailTemplates/DailyGoalsReminder';
import WelcomeEmail from '@/components/EmailTemplates/VerifyEmail';
import prisma from '@/db/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailReminder(userId: string) {
    if (!userId) {
        throw new Error("User ID is required");
    }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    console.log("User found:", user?.email);
    if(!user){
        console.error("User not found");
        return {success: false, message: "User not found"};
    }
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@jaadvocates.co.tz>',
      to: user.email?.trim() as string,
      subject: 'EduNex - Daily Goals Reminder',
      react: DailyGoalReminderEmail({name: user.name as string}),
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