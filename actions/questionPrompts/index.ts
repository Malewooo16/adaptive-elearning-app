"use server";

import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";

type UpsertQuestionPromptInput = {
  id?: string; // Optional if creating new
  prompt: string;
  stageId: string;
};

export async function upsertQuestionPrompt(data: UpsertQuestionPromptInput) {
  const { id, prompt, stageId } = data;

 try{
     const upserted = await prisma.questionPrompts.upsert({
    where: {
      id: id ?? '___invalid_id___', // Fallback to avoid accidental match
    },
    update: {
      prompt,
    },
    create: {
      prompt,
      stageId,
    },
  });

  revalidatePath("/update-question-prompts");

  return {success: true, message: "Question prompt updated successfully."};
 } catch (error) {
    console.error("Error upserting question prompt:", error);
    return {success: false, message: "Failed to update question prompt."};
 }
}
