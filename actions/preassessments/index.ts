"use server";

import { auth } from "@/auth/authOptions";
import prisma from "@/db/prisma";
import testBKTSequence from "../bkt";



export const getSamplePreassessments = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      currentStageNumber: true,
      currentTopicId: true,
    },
  });

  //console.log(user);

  if (!user || !user.currentTopicId || user.currentStageNumber === null) {
    // Handle the case where user, topic, or stage number is missing
    return null; // or throw an error, or return an empty array, depending on your needs
  }

  const stage = await prisma.stage.findFirst({
    where: {
      topicId: user.currentTopicId,
      number: user.currentStageNumber,
    },
    select: {
      Question: true,
      topicId: true,
      number: true,
    },
  });

  if (!stage) {
    // Handle the case where the stage is not found
    console.log("Stage not found");
    return null; // or throw an error, or return an empty array
  }

  return stage; // Return only the questions array
};




export const getPreasssessments = async (id:string) =>{
  try {
    const questions = await prisma.stage.findUnique({
      where: {
         id,
      },
      select: {
        Question: true,
        topicId: true,
        number: true,
      },
    })
    return questions;
  } catch (error) {
    console.error(error)
    return null;
  }
}
