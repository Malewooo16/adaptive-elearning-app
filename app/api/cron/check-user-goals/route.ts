// /app/api/cron/check-user-goals/route.ts (for App Router)
import {NextResponse} from "next/server";
import prisma from "@/db/prisma";
import {sendEmailReminder} from "@/actions/emailService/sendDailyGoalsReminder";

export async function GET() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  try {
    const knowledgeStates = await prisma.knowledgeState.findMany({
      where: {
        updatedAt: {
          gte: startOfDay,
        },
      },
      select: {
        userId: true,
        mastery: true,
      },
    });

    const questionResponses = await prisma.questionResponse.groupBy({
      by: ["userId"],
      where: {
        timestamp: {
          gte: startOfDay,
        },
      },
      _count: {
        _all: true,
      },
    });

    const userGoals = await prisma.userGoals.findMany();

    for (const goal of userGoals) {
      const userId = goal.userId;

      const hasQuestionGoal = typeof goal.questionsGoal === "number";
      const hasMasteryGoal = typeof goal.masteryGoal === "number";

      if (!hasQuestionGoal && !hasMasteryGoal) {
        continue; // Skip users with no goals set
      }

      const questionCount =
        questionResponses.find((q) => q.userId === userId)?._count._all || 0;
      const userMastery = knowledgeStates
        .filter((ks) => ks.userId === userId)
        .reduce((sum, ks) => sum + ks.mastery, 0);

      let goalMet = true;

      if (hasQuestionGoal && questionCount < goal.questionsGoal!) {
        goalMet = false;
      }

      if (hasMasteryGoal && userMastery < goal.masteryGoal!) {
        goalMet = false;
      }

      if (!goalMet) {
        await sendEmailReminder(userId);
      }
    }

    return NextResponse.json({status: "success"});
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}
