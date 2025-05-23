"use server"
import prisma from "@/db/prisma";
import testBKTSequence from "../bkt";
import { getUserSessionInclusive } from "../user";
import { getStageInfo } from "../stages";
import { saveUserResponse } from "../questionsResponses";


interface  QuestionResponses {
    questionId: number;
    selectedOption: string | null;
    correct: boolean;
    skill: string[];
    difficulty: string;
    timeSpent: number;
    assessmentId?: string; 
}
export const getUserKnowledgeStates = async (userId:string) =>{
    try {
        const knowledgeStates  = await prisma.knowledgeState.findMany({
            where: {
                userId
            }, include:{
              stage:true
            }
        })

        return knowledgeStates
        
    } catch (error) {
        console.log(error);
        return null;
    }
}



export const getCurrentStageMastery = async (stageId:string, userId:string) =>{
    try {
        const stageMastery = await prisma.knowledgeState.findFirst({
            where: {
                stageId
            }
        })
        return stageMastery
        
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const processPreassessmentMastery = async (
  data: { questionId: number; selectedOption: string | null; correct: boolean }[],
  stageId: string
) => {
  try {
    const user = await getUserSessionInclusive();
    if (!user) return;

    console.log(data)

    // Extract necessary parameters for BKT
    const stageResponsesForBKT = data.map((q) => ({
      questionId: q.questionId,
      correct: q.correct,
    }));

    const params = await getBKTParameters(stageId)

    if(!params) return;
    const bktResults = testBKTSequence(stageResponsesForBKT, params);

    let finalMastery = bktResults[bktResults.length - 1].posteriorP_L;


    const formattedParams = {
      prior: params.P_L0,
      learnRate: params.P_T,
      guessRate: params.P_G,
      slipRate: params.P_S,
  };
    // Calculate accuracy
    const correctCount = data.filter((item) => item.correct).length;
    const accuracy = correctCount / data.length;

    if (finalMastery > 0.8 && accuracy < 1) {
      finalMastery = finalMastery * accuracy;
    } 
    if(finalMastery > 0.9){
      finalMastery = 0.85;
      console.log(finalMastery)
    }

    await updateStageMastery(finalMastery, user?.id as string, stageId);

    // Adjust BKT parameters
    const adjustedParams = adjustBKTParams(formattedParams, accuracy);

    // Update BKT parameters in database
    await updateUserBKTParams(user.id, stageId, adjustedParams);

    return { stageMastery: finalMastery }; // returning enriched results
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const processUserMastery = async (
  data: QuestionResponses[],
  stageId: string
) => {
  try {
    const user = await getUserSessionInclusive();
    if (!user) return;

    // Extract necessary parameters for BKT
    const stageResponsesForBKT = data.map((q) => ({
      questionId: q.questionId,
      correct: q.correct,
    }));

    const params = await getBKTParameters(stageId);
    if (!params) return;

    const bktResults = testBKTSequence(stageResponsesForBKT, params);

    const finalMastery = bktResults[bktResults.length - 1].posteriorP_L;

    // Combine original data with BKT results
    const enrichedResults = data.map((q, index) => ({
      ...q,
      questionId: q.questionId.toString(),
      correct: undefined,
      isCorrect: q.correct,
      priorP_L: bktResults[index].priorP_L,
      posteriorP_L: bktResults[index].posteriorP_L,
      userId: user.id,
      stageId,
      assessmentId:q.assessmentId
    }));

    // Save the enriched results to the database
    await saveUserResponse(enrichedResults);
    const groupedBySkill = groupQuestionsBySkill(data);
    const updatedCorrectResponseRatios = await getSkillRatiosWithIdsAndUpdateSkillMastery(
      groupedBySkill,
      user?.id as string
    );
    
    await updateStageMastery(finalMastery, user?.id as string, stageId);

    // Calculate accuracy
    const correctCount = data.filter((item) => item.correct).length;
    const accuracy = correctCount / data.length;

    const formattedParams = {
      prior: params.P_L0,
      learnRate: params.P_T,
      guessRate: params.P_G,
      slipRate: params.P_S,
  };
    // Adjust BKT parameters
    const adjustedParams = adjustBKTParams(formattedParams, accuracy);

    // Update BKT parameters in database
    await updateUserBKTParams(user.id, stageId, adjustedParams);

    await promoteStudentToNextStage(user.id, updatedCorrectResponseRatios, finalMastery, user, stageId);

    return { stageMastery: finalMastery, updatedCorrectResponseRatios, enrichedResults };
  } catch (error) {
    console.error(error);
    return null;
  }
};




async function getBKTParameters(stageId: string) { 
    const bktParams = await prisma.bKTParameters.findFirst({
        where: { stageId }
    });

    if (!bktParams) {
        console.error(`BKT parameters not found for stageId: ${stageId}`);
        return null;
    }

    return {
        P_L0: bktParams.prior,
        P_T: bktParams.learnRate,
        P_G: bktParams.guessRate,
        P_S: bktParams.slipRate
    };
}

async function getSkillRatiosWithIdsAndUpdateSkillMastery(
  groupedBySkill: Record<string, { correct: boolean }[]>,
  studentId: string
): Promise<Record<string, { skillId: string; skillName: string; ratio: number }>> {
  const result: Record<string, { skillId: string; skillName: string; ratio: number }> = {};

  for (const skill in groupedBySkill) {
    const questions = groupedBySkill[skill];
    const totalResponses = questions.length;
    const correctResponses = questions.filter((q) => q.correct).length;
    const ratio = totalResponses > 0 ? correctResponses / totalResponses : 0;

    console.log(ratio , totalResponses, correctResponses);
    // Find the skill ID from the database
    const skillRecord = await prisma.skill.findFirst({
      where: { 
        name: { equals: skill.toLowerCase(), mode: "insensitive" } 
      },
      select: { id: true, name: true },
    });

    if (skillRecord) {
      // Upsert student skill progress
      await prisma.studentSkillProgress.upsert({
        create: {
          studentId,
          skillId: skillRecord.id,
          mastery: ratio,
        },
        update: {
          mastery: ratio,
        },
        where: {
          studentId_skillId: {
            studentId,
            skillId: skillRecord.id,
          },
        },
      });

      // Store the result with skillName included
      result[skill] = {
        skillId: skillRecord.id,
        skillName: skillRecord.name, // Include skill name
        ratio,
      };
    } else {
      console.warn(`Skill '${skill}' not found in the database.`);
    }
  }

  return result;
}



const updateStageMastery = async (mastery:number, userId:string,stageId:string) => {
    const stage = await getStageInfo(stageId)
    try {
        await prisma.knowledgeState.upsert({
            create: {
              userId,
              stageId,
              mastery,
              topicId: stage?.topicId as string,
            },
            update: {
              mastery,
             assessmentNumber:{increment: 1},
            },
            where: {
              userId_stageId: {
                userId,
                stageId,
              },
            },
          });
    } catch (error) {
        console.log(error)
    }
}

const promoteStudentToNextStage = async (
  userId: string, 
  skillsMastery: Record<string, { skillId: string; ratio: number }>, 
  stageMastery: number, 
  user: any, 
  stageId: string
) => {
  try {
    const topics = [
      { name: 'Intro to Expressions' },
      { name: 'Polynomials' },
      { name: 'Linear Equations' },
      { name: 'System of Equations' },
      { name: 'Quadratic Equations' },
    ];

    let userCurrentTopicId = user.currentTopicId;
    let userCurrentStageNumber = user.currentStageNumber;


    
    // Get the current user's knowledge states for the skills and stages
    const currentStageMastery = await getCurrentStageMastery(stageId, userId);



    console.log(`SkillsMAstery:${Object.values(skillsMastery).map(sk => sk.ratio).join(', ')}`);
    console.log(`CurrentStageMastery:${currentStageMastery}`);
    
    // Check if the skills and stage mastery are above the threshold
    const allSkillsMasteryAboveThreshold = Object.values(skillsMastery).every(sk => sk.ratio >= 0.84);
    const stageMasteryAboveThreshold = stageMastery >= 0.9;

    // Debug logs to identify the issue
    console.log("All skills above threshold?", allSkillsMasteryAboveThreshold);
    console.log("Stage mastery above threshold?", stageMasteryAboveThreshold);

    // The key fix: Only promote if the user is currently at this stage (prevent double promotion)
    // Fetch the stage info to get the stage number for this stageId
    const stageInfo = await getStageInfo(stageId);
    if (!stageInfo) {
      console.log("Stage info not found.");
      return null;
    }
    const thisStageNumber = stageInfo.number; // Assuming this is the stage number

    // Only promote if the user's current stage matches the assessment's stage
    if (userCurrentStageNumber !== thisStageNumber) {
      console.log(`User already promoted past this stage. No further promotion.`);
      return null;
    }

    if(currentStageMastery && currentStageMastery?.assessmentNumber <= 1){
      console.log(`User hasn't completed enough assessments for this stage.`);
      return null; // Not enough assessments completed

    }

    // The key fix: Add a strict AND condition and return early if not met
    if (!allSkillsMasteryAboveThreshold || !stageMasteryAboveThreshold) {
      console.log(`Student hasn't mastered all skills or stage mastery is below threshold.`);
      return null; // Explicitly return null to indicate no promotion
    }

    // Promotion logic for stage and topic
    if (userCurrentStageNumber < 4) {
      // If the student is eligible for promotion and not yet in stage 4, increment stage number
      userCurrentStageNumber = userCurrentStageNumber + 1;
    } else {
      // If the student is already in the last stage, check for the next topic
      const topicIndex = topics.findIndex(t => t.name === userCurrentTopicId);
      if (topicIndex === -1 || topicIndex === topics.length - 1) {
        console.log(`Student has reached the last topic.`);
        return null; // No further promotion is possible
      } else {
        // Promote to the next topic and reset to stage 1
        userCurrentTopicId = topics[topicIndex + 1].name;
        userCurrentStageNumber = 1;
      }
    }

    // Update user stage and topic in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStageNumber: userCurrentStageNumber,
        currentTopicId: userCurrentTopicId,
      },
    });

    console.log(`Student promoted to next stage: Stage ${userCurrentStageNumber}, Topic: ${userCurrentTopicId}`);
    return updatedUser;

  } catch (error) {
    console.error("Error promoting student to next stage:", error);
    return null;
  }
};




  function groupQuestionsBySkill(questions: { questionId: number; correct: boolean; skill: string[] }[]): Record<string, { questionId: number; correct: boolean }[]> {
    const grouped: Record<string, { questionId: number; correct: boolean }[]> = {};

    for (const question of questions) {
        for (const skill of question.skill) {
            if (!grouped[skill]) {
                grouped[skill] = [];
            }
            grouped[skill].push({ questionId: question.questionId, correct: question.correct });
        }
    }

    return grouped;
}

export async function updateUserBKTParams(
  userId: string,
  stageId: string,
  adjustedParams: { prior: number; learnRate: number; guessRate: number; slipRate: number;}
) {
  try {
    await prisma.userBKTParameters.upsert({
      where: { userId_stageId: { userId, stageId } },
      update: { ...adjustedParams },
      create: { userId, stageId, ...adjustedParams },
    });
  } catch (error) {
    console.error('Error updating user BKT parameters:', error);
  }
}

function adjustBKTParams(
  params: { prior: number; learnRate: number; guessRate: number; slipRate: number },
  accuracy: number
) {
  let adjustedPrior = params.prior;
  let adjustedGuess = params.guessRate;
  let adjustedSlip = params.slipRate;
  let adjustedLearn = params.learnRate;

  // Adjust prior based on accuracy
  if (accuracy > 0.8) {
    adjustedPrior = Math.min(params.prior + 0.2, 1); // Increase prior
  } else if (accuracy < 0.4) {
    adjustedPrior = Math.max(params.prior - 0.2, 0); // Decrease prior
  }

  // Adjust guess and slip rates (example logic)
  if (accuracy > 0.9 && params.guessRate < 0.25) {
    adjustedGuess = params.guessRate + 0.05;
  }
  if (accuracy < 0.2 && params.slipRate < 0.25) {
    adjustedSlip = params.slipRate + 0.05;
  }

    //Adjust learn rate.
  if (accuracy > 0.7){
      adjustedLearn = Math.min(params.learnRate + 0.05, 1);
  } else {
      adjustedLearn = Math.max(params.learnRate -0.05, 0);
  }

  return {
    prior: adjustedPrior,
    learnRate: adjustedLearn,
    guessRate: adjustedGuess,
    slipRate: adjustedSlip,
  };
}

async function getUserBKTParams(userId:string, stageId:string){
   try{
     const userParams = await prisma.userBKTParameters.findFirst({
       where: { userId, stageId },
       select: { prior: true, learnRate: true, guessRate: true, slipRate: true },
     });

     if(!userParams) return
     return {
      
        P_L0: userParams?.prior,
        P_T: userParams?.learnRate,
        P_G: userParams?.guessRate,
        P_S: userParams?.slipRate,
    
     };
   } catch (err) {
    console.error(err);
    return null
   }
}



