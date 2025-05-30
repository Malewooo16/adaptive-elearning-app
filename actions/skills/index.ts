

"use server";
import prisma from "@/db/prisma";
import { getUserSessionInclusive } from "../user";

export const getAllSkillsInAStageForStudent = async (stageId: string) => {
  const user = await getUserSessionInclusive();
  if (!user) {
    throw new Error("User not authenticated");
  }
  try {
    const studentSkills = await prisma.studentSkillProgress.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        skill: true,
      },
    });

    const stageSkills = await prisma.stageSkill.findMany({
      where: {
        stageId,
      },
      include: {
        skill: true,
      },
    });

    return { studentSkills, stageSkills }; // Return both sets of data
  } catch (error) {
    return null;
  }
};

export const getAllStageSkills = async (stageId: string) => {
  try {
    const stageSkills = await prisma.stageSkill.findMany({
      where: {
        stageId,
      },
      include: {
        skill: true,
      },
    });

    return stageSkills;
  } catch (error) {
    return null;
  }
};



export const getStudentSkillProgress = async () => {
  const user = await getUserSessionInclusive();
  if (!user) {
    throw new Error("User not authenticated");
  }
  try {
    const studentSkills = await prisma.studentSkillProgress.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        skill: true,
      },
    });

   

    return { studentSkills}; // Return both sets of data
  } catch (error) {
    return null;
  }
};


export const getStudentSkillProgressByStageId = async (stageId: string, userId:string) => {
    try{
    const studentSkills = await prisma.studentSkillProgress.findMany({
      where: {
        studentId:userId,
      },
      include: {
        skill: {
          include: {
            stageSkills: {
              where: {
                stageId: stageId,
              },
            },
          },
        },
      },
    }
    );
    return studentSkills.filter(skill => skill.skill.stageSkills.length > 0);
  } catch (error) {
    console.error("Error fetching student skill progress by stage ID:", error);
    return null;
  }
   
}
