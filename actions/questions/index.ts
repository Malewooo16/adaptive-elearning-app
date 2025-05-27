"use server";

import prisma from "@/db/prisma";
import questionGen from "../claudeAi";
import { getCurrentStageMastery } from "../mastery";

export const generateAiQuestions = async (
  prompt: string,
  userId: string,
  stageId: string
) => {
  try {
    const questions = await questionGen(prompt);
    const data = JSON.parse(questions);

    const questionsArray = data;

    const questionsToSave = await prisma.aIQuestions.create({
      data: {
        userId,
        stageId,
        questions: questionsArray,
      },
    });
    return questionsToSave;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchAiQuestions = async (stageId: string, userId: string) => {
  try {
    const questions = await prisma.aIQuestions.findFirst({
      where: {
        stageId,
        userId,
      },
    });
    return questions;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const explainMistake = async (question: any) => {
  try {
    const prompt = `You are a math explanation engine. Given a multiple-choice question, provide a detailed explanation in valid JSON format. Follow these strict rules:

    1. Use LaTeX inline math inside \`$...$\` delimiters.
    2. All LaTeX commands (e.g., \\cdot, \\frac, \\sqrt) must be double-escaped (i.e., write \\\\cdot, \\\\frac, etc.) so the output is valid JSON and safe to parse with \`JSON.parse()\`.
    3. Do NOT use raw backslashes (e.g., "\\cdot") — always double-escape them as "\\\\cdot".
    4. For fractions, use \`\\\\frac{numerator}{denominator}\`.
    5. **Wrap every mathematical expression in all text fields (including "calculation") inside dollar signs \`$\` to indicate LaTeX math mode.**
    6. Use an array of steps if multiple steps are needed. Each step must have:
      - a "step": describing what to do
      - a "calculation": showing the math expression wrapped in dollar signs, e.g. "$4 \\\\cdot x + 4 \\\\cdot 5$"
    7. If only one step is required, use a string explanation under "explanation" with math expressions wrapped in dollar signs.
    8. If multiple steps are used, include a "finalAnswer" field.
    9. Do NOT include any explanation text outside the JSON (no comments, no markdown, no \`\`\`).

    Input Question:
    {
      "question": "${question.question}",
      "options": ${JSON.stringify(question.options)},
      "answer": "${question.answer}"
    }

    Expected Output Format (Multi-Step Example):
    {
      "question": "${question.question}",
      "explanation": [
        {
          "step": "Apply the distributive property.",
          "calculation": "$4 \\\\cdot x + 4 \\\\cdot 5$"
        },
        {
          "step": "Perform the multiplication.",
          "calculation": "$4x + 20$"
        }
      ],
      "finalAnswer": "$4x + 20$"
    }`;

    const mistake = await questionGen(prompt);
    return mistake;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteAiQuestion = async (questionId: string) => {
  try {
    await prisma.aIQuestions.delete({
      where: {id: questionId},
    });
  } catch (error) {
    console.log(error);
  }
};


// Assuming 'prisma' is already imported and configured

/**
 * Determines the recommended difficulty for the next question (1: Easy, 2: Medium, 3: Hard)
 * based on the student's current BKT mastery within a specific stage.
 *
 * @param userId The ID of the user.
 * @param stageId The ID of the current stage.
 * @returns A number (1, 2, or 3) representing the recommended difficulty, or null if no mastery data.
 */
export async function getRecommendedQuestionDifficultyLabel(
  userId: string,
  stageId: string
): Promise<
  | "Focus on foundational concepts with mostly easy questions and a few medium ones."
  | "Focus mostly on medium questions with occasional challenging ones."
  | "Focus mostly on hard questions with a few medium ones to keep sharp."
  | null
> {
  // 1. Fetch current mastery data
  const currentKnowledgeState = await getCurrentStageMastery(stageId, userId);
  const stageMastery = currentKnowledgeState?.mastery as number;

  // Define mastery thresholds
  const MASTERY_THRESHOLD_EASY = 0.6;
  const MASTERY_THRESHOLD_MEDIUM = 0.85;

  let difficultyLabel:
    | "Focus on foundational concepts with mostly easy questions and a few medium ones."
    | "Focus mostly on medium questions with occasional challenging ones."
    | "Focus mostly on hard questions with a few medium ones to keep sharp.";

  // 2. Use mastery to assign difficulty label
  if (stageMastery !== null) {
    console.log(`User ${userId} - Using overall stage mastery for stage ${stageId}: ${stageMastery.toFixed(2)}`);

    if (stageMastery < MASTERY_THRESHOLD_EASY) {
      difficultyLabel =
        "Focus on foundational concepts with mostly easy questions and a few medium ones.";
    } else if (stageMastery < MASTERY_THRESHOLD_MEDIUM) {
      difficultyLabel =
        "Focus mostly on medium questions with occasional challenging ones.";
    } else {
      difficultyLabel =
        "Focus mostly on hard questions with a few medium ones to keep sharp.";
    }
  } else {
    // No data yet → default to easy
    console.log(`User ${userId} - No mastery data for stage ${stageId}. Defaulting to easiest recommendation.`);
    return "Focus on foundational concepts with mostly easy questions and a few medium ones.";
  }

  console.log(`Recommended difficulty label for user ${userId} in stage ${stageId}: ${difficultyLabel}`);
  return difficultyLabel;
}


// --- Your existing getStudentCurrentMastery function (as provided by you) ---


// --- How you would use it in your application ---
// Example Usage:
// (Imagine this is in an API route or game loop)
/*
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // Initialize your Prisma client

async function runExample() {
  const userId = "cm8jwr92s0000swnkbmd93yro";
  const stageId = "mMd9n1Nup1";

  const recommendedDifficulty = await getRecommendedQuestionDifficulty(userId, stageId);

  if (recommendedDifficulty !== null) {
    console.log(`\nFinal Recommendation: The next question should be of difficulty: ${recommendedDifficulty}`);
    // Now you can use this `recommendedDifficulty` to query for the actual question
    // e.g., prisma.question.findFirst({ where: { stageId: stageId, difficulty: String(recommendedDifficulty) } })
  } else {
    console.log("Could not determine a recommended difficulty. Student might be done or need an alternative path.");
  }
}

runExample();
*/