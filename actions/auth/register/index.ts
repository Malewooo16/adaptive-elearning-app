"use server";
import prisma from "@/db/prisma";


export default async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
   await prisma.user.create({
    data: {
      name: formData.name,
      email: formData.email,
      password: formData.password, // Ensure this is hashed before storing in production
    },
   })
   return {success: true,
    message: "User registered successfully",}
  } catch (error) {
    console.error('Error during registration:', error);
    throw error; // Propagate the error to be handled by the caller
  }

}