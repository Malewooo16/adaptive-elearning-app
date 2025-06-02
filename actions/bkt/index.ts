

import prisma from "@/db/prisma";

interface IBKTResult {
  qn: number;
  answer: string | boolean;
  priorP_L: number | string;
  posteriorP_L: number | string;
}

export default function testBKTSequence(
  answers: { questionId: number; correct: boolean }[],
  params: { P_L0: number; P_T: number; P_G: number; P_S: number } | null
) {
  if (!params) {
    throw new Error("Params object is required");
  }

  let P_L = params.P_L0;
  const results: { qn: number; answer: string; priorP_L: number; posteriorP_L: number }[] = [];

  answers.forEach((answer, index) => {
    const priorP_L = P_L;

    if (answer.correct) {
      P_L = (P_L * (1 - params.P_S)) / (P_L * (1 - params.P_S) + (1 - P_L) * params.P_G);
      // Apply learning transition only on correct answers
      P_L = P_L + (1 - P_L) * params.P_T;
    } else {
      P_L = (P_L * params.P_S) / (P_L * params.P_S + (1 - P_L) * (1 - params.P_G));
    }

    results.push({
      qn: index + 1,
      answer: answer.correct ? "correct" : "incorrect",
      priorP_L: parseFloat(priorP_L.toFixed(3)),
      posteriorP_L: parseFloat(P_L.toFixed(3)),
    });
  });

  return results;
}


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

