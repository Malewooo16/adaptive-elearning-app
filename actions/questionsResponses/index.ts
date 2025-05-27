"use server"

import prisma from "@/db/prisma"

export const saveUserResponse = async(responses:any)=>{

    try{
        await prisma.questionResponse.createMany({
            data:responses
        })
    }catch(err){
        console.error(err)
        throw new Error("Failed to create user response")
    }

}


export const getUserResponses = async(userId:string, stageId?:string)=>{
    try{
         const response = await prisma.questionResponse.findMany({
      where: {
        userId,
        stageId
      }
    });
    return response
    } catch(err){
      console.log(err)
      return null
    }
}