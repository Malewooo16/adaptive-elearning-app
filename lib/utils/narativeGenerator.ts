import { LearningInsights } from "@/app/smart-insights/page";
import { KnowledgeState } from "@prisma/client";
import { Prisma } from "@prisma/client";

const knowledgeState = Prisma.validator<Prisma.KnowledgeStateDefaultArgs>()({
  include: {
    stage: {
      include: {
        topic: true
      }}
  } })

type KnowledgeStateWithStage = Prisma.KnowledgeStateGetPayload<typeof knowledgeState>;

export function generateLearningNarrative(
  insights:LearningInsights | null,
  knowledgeState: KnowledgeStateWithStage | null,
  stage?: any
  
) {
  let narrative = "";

  const currentStageKnowledge = knowledgeState

  // Start with current progress
  if (currentStageKnowledge) {
    narrative += `You're currently in **${currentStageKnowledge.stage.topic.name} - Stage ${currentStageKnowledge.stage.number}: ${currentStageKnowledge.stage.title}**. Your mastery for this stage is **${Math.round(currentStageKnowledge.mastery * 100)}%**! `;
  } else {
    narrative += `Welcome to your learning journey! You're currently in **${stage.topic.name} - Stage ${stage.number}: ${stage.title}**. `;
  }

  // General Performance Summary (from insights if available)
  if (insights) {
    narrative += `Looking at your recent performance, you've answered **${insights.correctAnswers} out of ${insights.totalQuestions} questions correctly**, leading to an **accuracy of ${Math.round(insights.accuracy * 100)}%**. `;

    // Skill-based feedback
    const strugglingSkills = insights.skillMastery.filter(
      (s) => s.avgPosteriorP_L < 0.6 && s.avgPosteriorP_L > 0 // Only include if mastery is not zero
    );
    const strongSkills = insights.skillMastery.filter(
      (s) => s.avgPosteriorP_L >= 0.8
    );

    if (strugglingSkills.length > 0) {
      narrative += `It looks like you could benefit from reviewing concepts related to: **${strugglingSkills.map((s) => s.skill).join(", ")}**. Keep practicing, and you'll get there! `;
    } else if (strongSkills.length === insights.skillMastery.length && insights.skillMastery.length > 0) {
      narrative += `You're demonstrating strong understanding across all the skills you've encountered recently. Keep up the great work! `;
    } else {
        narrative += `You're building a solid foundation across your skills. Keep pushing forward! `;
    }

    // Difficulty insights
    const challengingDifficulties = insights.difficultyInsights.filter(
      (d) => parseInt(d.difficulty) >= 2 && d.accuracy < 0.7
    );
    if (challengingDifficulties.length > 0) {
      narrative += `Specifically, you might want to focus on **${challengingDifficulties.map(d => `Level ${d.difficulty}`).join(" and ")} questions**, where there's still room for improvement. `;
    }

    // Progression recommendation
    if (insights.shouldPromote) {
      narrative += `Based on your consistent performance, strong recent streak, and mastery of harder questions, **we are confident in you're ability to move to the next stage! 🚀** This is a fantastic achievement!`;
    } else {
      narrative += `To fully solidify your understanding, let's work on reinforcing a few more key concepts in this stage. Continued practice will help you build even greater confidence! 💪`;
    }
  } else {
    // Fallback if no recent assessment insights are available
    narrative += `To get personalized insights, complete your first assessment or practice questions in this stage.`;
  }

  return narrative;
}