"use server";
import prisma from "@/db/prisma";
import { generateVerificationToken } from "../verification";
import { sendVerificationEmail } from "@/actions/emailService/verifyUserEmail";


export default async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
   const newUser = await prisma.user.create({
    data: {
      name: formData.name,
      email: formData.email,
      password: formData.password, // Ensure this is hashed before storing in production
    },
   })

   const verificationToken = await generateVerificationToken(newUser.email as string);
   // Here you would typically send the verification email with the token
   const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}`;

   const verifactionEmailObject = {
    userEmail: newUser.email as string,
    userName: newUser.name as string,
    verificationLink: verificationLink,
    };
   const emailResponse = await sendVerificationEmail(verifactionEmailObject);
   if (!emailResponse.success) {  
      console.error("Failed to send verification email:", emailResponse);
      return{success:false, message:"Failed to send verification email"}
    }
   return {success: true,
    message: "User registered successfully",}
  } catch (error) {
    console.error('Error during registration:', error);
    throw error; // Propagate the error to be handled by the caller
  }

}