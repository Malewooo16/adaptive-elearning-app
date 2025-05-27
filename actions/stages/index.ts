"use server"
import prisma from "@/db/prisma";
import { getUser, getUserSessionInclusive } from "../user";


export const getUserCurrentStageId = async(userId: string) => {
    const user = await getUser(userId);
   // console.log(user)
    if(user === null) return null;

    const stage = await prisma.stage.findFirst({
        where: {
            topic:{
                name: user.currentTopicId
            },
            number: user.currentStageNumber
        }
    });

    
//console.log(stage)
    return stage?.id;
}

export const getStageInfo = async (stageId:string) =>{
 try {
    const stage = await prisma.stage.findUnique({
        where:{id:stageId}, include:{
            topic:true, }
    })
    return stage;
 } catch (error) {
    return null;
 }
}

export const getStageQuestionGenPrompt = async (stageId:string) =>{
    
    try {
        const prompt = await prisma.questionPrompts.findFirst({
            where:{stageId},
            select:{
                prompt:true
            }
        });
        return prompt?.prompt;
    } catch (error) {
        console.log(error)
        return null;
        
    }
}

export const updateLearningStatus = async(stageId: string, hasLearned:boolean, score:any)=>{
  try{
    console.log(score)
    const user = await getUserSessionInclusive()
    await prisma.knowledgeState.update({
        where:{
            userId_stageId:{
                userId:user?.id as string,
                stageId
            }
        },
        data:{hasLearned}
        
    })
    console.log("Executed Successfully")
  } catch (err){
    console.log(err)
    return null
  }
}