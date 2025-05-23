"use server"

import prisma from "@/db/prisma";
import questionGen from "../claudeAi"

export const generateAiQuestions = async(prompt:string, userId:string, stageId:string) =>{
  try {
    const questions = await questionGen(prompt);
    const data = JSON.parse(questions);
   
    const questionsArray = data;

    const questionsToSave = await prisma.aIQuestions.create({
      data:{
        userId,
        stageId,
        questions: questionsArray
      }
    })
    return questionsToSave;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const fetchAiQuestions = async(stageId:string, userId:string) =>{
  try {
    const questions = await prisma.aIQuestions.findFirst({
      where:{
        stageId,
        userId
      }
    })
    return questions;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export const explainMistake = async (question: any) => {
  try {
    const prompt = `Provide a detailed explanation for the following multiple-choice math question. 
Focus on explaining the correct answer. 
Use LaTeX delimiters (\`$...$\`) for mathematical expressions where necessary. 
If the question requires multiple steps to solve, provide each step in an array with a description. 
Respond in parseable JSON format without json annotation.

Question:
{
  "question": "${question.question}",
  "options": ${JSON.stringify(question.options)},
  "answer": "${question.answer}"
}

Example Response (Single Step):
{
  "question": "${question.question}",
  "explanation": "The coefficient in an expression like $5x + 3$ is the number that multiplies the variable. In this case, $5$ is the coefficient because it is the number in front of $x$. The number $3$ is a constant term, and $x$ is the variable."
}

Example Response (Multi-Step):
{
  "question": "${question.question}",
  "explanation": [
    {
      "step": "Substitute the value of x into the expression.",
      "calculation": "2(3) + 1"
    },
    {
      "step": "Perform the multiplication.",
      "calculation": "6 + 1"
    },
    {
      "step": "Add the numbers to get the final result.",
      "calculation": "7"
    }
  ],
  "finalAnswer": "7"
}

Note: If the solution requires multiple steps, return an array of objects, each with 'step' and 'calculation' keys. If it's a single-step explanation, return a string under the 'explanation' key. If there are multiple steps include the final answer as a string under the 'finalAnswer' key.`;

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
      where: { id: questionId }  
    })
  } catch (error) {
    console.log(error)
  }
}



