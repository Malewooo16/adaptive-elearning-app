"use server"

import prisma from "@/db/prisma";

export const getUserGoals = async (userId: string) => {}

export const createUserGoals = async (userId: string, goals: any) => {
   const { ['Practice Goal']: practiceGoal, ['Mastery Goal']: masteryGoal } = goals;
   try {

    const userGoals = await prisma.userGoals.create({
        data: {
            userId,
            masteryGoal:Number(masteryGoal),
            questionsGoal:Number(practiceGoal)
          }
     });

     await prisma.user.update({
        where: { id: userId },
        data: { newUser: false }
     });

     return {success:true, message: "User goals created successfully"};
   } catch (error) {
     console.log("Error creating user goals:", error);
     return {success:false, message: "Failed to create user goals"};
   }
}