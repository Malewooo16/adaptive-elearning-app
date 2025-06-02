//@ts-check
"use server"

import prisma from "@/db/prisma";
import { string } from "mathjs";



export async function generateVerificationToken(email:string){
    const token = crypto.randomUUID()
    const expires = new Date(new Date().getTime()+ 1000 * 60 * 60 * 24); // 24 hours

    const existingToken = await prisma.verificationRequest.findFirst({
        where: {
            email
        }
    })
    
    if(existingToken){
        await prisma.verificationRequest.delete({
            where: {
                id:existingToken.id
            },
            
        })
    }

    const verificationRequest = await prisma.verificationRequest.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verificationRequest.token; 
}


export async function verifyUserToken(token:string){
    try {
        const verificationRequest = await prisma.verificationRequest.findFirst({
            where: {
                token
            }
        });
        if(!verificationRequest){
            return{success:false, message:"Failed to verify email"}
        }
        if(verificationRequest.expires < new Date()){
            return{success:false, message:"Token expired"}
        }
        await prisma.user.update({
            where: {
                email: verificationRequest.email
            },
            data: {
                emailVerified: new Date(),
            }
        });
        return {success:true, message:"Email verified"}

    } catch (err) {
        console.log(err);
        return{success:false, message:"Failed to verify user"}
    }
}