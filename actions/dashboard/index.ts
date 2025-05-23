import prisma from "@/db/prisma";
import {getUserSessionInclusive} from "../user";
import { DifficultyRecord, SkillsRecord, VerdictRecord } from "@/types/types";


export async function summarizeLearningFromDB(userId: string, stageId: string) {
  try {
    const data = await prisma.questionResponse.findMany({
      where: {
        userId: userId,
        stageId: stageId,
      },
      orderBy: {
        timestamp: "asc", // Ensure responses are ordered by time
      },
    });

    if (!data || data.length === 0) {
      return {error: "No data found for the given user and stage."};
    }

    const mastery =
      data.length > 0 ? data[data.length - 1].posteriorP_L * 100 : 0;
    let masteryVerdict: string;

    if (mastery > 95) {
      masteryVerdict = "Mastered";
    } else if (mastery > 70) {
      masteryVerdict = "Proficient";
    } else if (mastery > 50) {
      masteryVerdict = "Developing";
    } else {
      masteryVerdict = "Needs Improvement";
    }

    // Type Definitions

    // Initialize Objects with Correct Types
    const skills: SkillsRecord = {};
    const difficultyData: DifficultyRecord = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    data.forEach((item) => {
      const skill = item.skill[0]; // Assuming only one skill per item
      if (!skills[skill]) {
        skills[skill] = {correct: 0, total: 0};
      }
      skills[skill].correct += item.isCorrect ? 1 : 0;
      skills[skill].total++;

      totalCorrect += item.isCorrect ? 1 : 0;
      totalQuestions++;

      // Handling difficulty data
      if (!difficultyData[item.difficulty]) {
        difficultyData[item.difficulty] = {correct: 0, total: 0};
      }
      difficultyData[item.difficulty].correct += item.isCorrect ? 1 : 0;
      difficultyData[item.difficulty].total++;
    });

    // Generating skill verdicts
    const skillsVerdict: VerdictRecord = {};
    for (const skill in skills) {
      const accuracy = (skills[skill].correct / skills[skill].total) * 100;
      let verdict: string;

      if (accuracy > 90) {
        verdict = "Mastered";
      } else if (accuracy > 70) {
        verdict = "Proficient";
      } else if (accuracy > 50) {
        verdict = "Developing";
      } else {
        verdict = "Needs Improvement";
      }

      skillsVerdict[skill] = {accuracy: Math.round(accuracy), verdict: verdict};
    }

    // Generating difficulty verdicts
    const difficultyVerdict: {[key: string]: string} = {};
    const difficultyLevels = Object.keys(difficultyData).sort();

    difficultyLevels.forEach((level) => {
      const accuracy =
        (difficultyData[level].correct / difficultyData[level].total) * 100;
      let verdict: string;

      if (accuracy > 90) {
        verdict = "Comfortable";
      } else if (accuracy > 70) {
        verdict = "Comfortable";
      } else if (accuracy > 50) {
        verdict = "Needs Practice";
      } else {
        verdict = "Needs Significant Practice";
      }

      if (level === "1") {
        difficultyVerdict["easy"] = verdict;
      } else if (level === "2") {
        difficultyVerdict["medium"] = verdict;
      } else if (level === "3") {
        difficultyVerdict["hard"] = verdict;
      }
    });

    return {
      mastery: mastery,
      masteryVerdict: masteryVerdict,
      skillsVerdict: skillsVerdict,
      difficultyVerdict: difficultyVerdict,
    };
  } catch (error) {
    console.error("Error summarizing learning:", error);
    return {error: "An error occurred while summarizing learning."};
  }
}

export async function getDashboardInfo() {
  try {
    const user = await getUserSessionInclusive();
    if (!user) return null;

    const currentStage = await prisma.stage.findFirst({
      where: {
        topic: {
          name: user.currentTopicId,
        },
        number: user.currentStageNumber,
      },
      select: {
        id: true,
        title: true,
        number: true,
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const knowledgeStates = await prisma.knowledgeState.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        mastery: true,
        stage: {
          select: {
            id: true,
            title: true,
            number: true,
            topic: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const skillProgress = await prisma.studentSkillProgress.findMany({
      where: {
        studentId: user.id,
      },
      select: {
        id: true,
        mastery: true,
        skill: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      user,
      currentStage,
      knowledgeStates,
      skillProgress,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
