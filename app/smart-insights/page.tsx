import {
  User,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Brain,
} from "lucide-react";

import {getUserResponses} from "@/actions/questionsResponses";
import {getUserSessionInclusive} from "@/actions/user";
import {getStudentSkillProgress} from "@/actions/skills";
import {getUserKnowledgeStates} from "@/actions/mastery";
import {getStageInfo, getUserCurrentStageId} from "@/actions/stages";
import {generateLearningNarrative} from "@/lib/utils/narativeGenerator";
import {BoldText} from "@/components/Questions/bolder";
import Link from "next/link";
import UserNavbar from "@/components/Common/UserNavbar";

// --- Type Definitions ---

// Assuming `getUserResponses` returns an array of QuestionResponse objects from Prisma
interface QuestionResponseData {
  id: string;
  userId: string;
  stageId: string;
  questionId: string;
  assessmentId: string | null;
  selectedOption: string;
  isCorrect: boolean;
  skill: string[]; // This is already an array of strings in your schema
  difficulty: string; // Your schema defines this as 'String'
  priorP_L: number;
  posteriorP_L: number;
  timeSpent: number;
  timestamp: Date; // Prisma returns Date objects for DateTime fields
}

// --- Insights Interfaces ---

export interface SkillMasteryInsight {
  skill: string;
  avgPosteriorP_L: number;
}

export interface DifficultyInsight {
  difficulty: string;
  count: number;
  accuracy: number;
}

export interface LearningInsights {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  avgPosteriorP_L: number;
  finalPL: number;
  recentCorrect: boolean;
  hardAccuracy: number;
  steadyGrowth: boolean;
  skillMastery: SkillMasteryInsight[];
  difficultyInsights: DifficultyInsight[];
  promotion: string;
  shouldPromote: boolean;
}

// --- Component ---

const UserProgressDashboarde = async () => {
  const loading = false; // This will likely be a state or prop in a client component

  // These actions should be typed at their source to ensure correct return types
  const userData = await getUserSessionInclusive(); // Make sure this returns UserData
  const skillProgress = await getStudentSkillProgress(); // Make sure this matches the return type
  const stageId = await getUserCurrentStageId(userData?.id || ""); // Ensure ID is passed and handled
  const stage = await getStageInfo(stageId as string); // Ensure ID is passed and handled
  const userResponses = await getUserResponses(
    userData?.id as string,
    stageId as string
  ); // Ensure ID is passed and handled

  const knowledgeStates = await getUserKnowledgeStates(userData?.id || ""); // Ensure ID is passed and handled
  const userKnowledgeStates =
    knowledgeStates?.find((ks) => ks.stageId === stageId) || null;

  console.log(stageId);

  //console.log(skillProgress);

  // --- Helper Functions with Types ---

  const getMostRecentAssessment = (
    responses: QuestionResponseData[] | null
  ): QuestionResponseData[] => {
    const grouped: {[key: string]: QuestionResponseData[]} = {};
    if (!responses) return [];
    responses.forEach((r) => {
      if (!r.assessmentId) return; // Skip responses without an assessmentId if null is possible
      if (!grouped[r.assessmentId]) grouped[r.assessmentId] = [];
      grouped[r.assessmentId].push(r);
    });

    const sorted = Object.entries(grouped).sort(([, a], [, b]) => {
      // Ensure timestamps are treated as numbers for comparison
      const aMax = Math.max(...a.map((r) => new Date(r.timestamp).getTime()));
      const bMax = Math.max(...b.map((r) => new Date(r.timestamp).getTime()));
      return bMax - aMax;
    });

    return sorted.length > 0 ? sorted[0][1] : [];
  };

  const runInsights = (
    data: QuestionResponseData[]
  ): LearningInsights | null => {
    if (!data || data.length === 0) return null;

    const total = data.length;
    const correct = data.filter((q) => q.isCorrect).length;
    // Safely access posteriorP_L, handle cases where data might be empty
    const finalPL = data.length > 0 ? data[data.length - 1].posteriorP_L : 0;
    const recentCorrect = data.slice(-3).every((q) => q.isCorrect);
    // Convert difficulty string to number for comparison
    const hardQs = data.filter((q) => parseInt(q.difficulty) >= 2);
    const hardAccuracy = hardQs.length
      ? hardQs.filter((q) => q.isCorrect).length / hardQs.length
      : 0;
    const steadyGrowth = data.every((q, i, arr) => {
      return i === 0 || q.posteriorP_L >= arr[i - 1].posteriorP_L - 0.15;
    });

    // Skill mastery
    const skillStats: {[key: string]: QuestionResponseData[]} = {};
    data.forEach((q) => {
      q.skill.forEach((skill) => {
        if (!skillStats[skill]) skillStats[skill] = [];
        skillStats[skill].push(q);
      });
    });

    const skillMastery: SkillMasteryInsight[] = Object.entries(skillStats).map(
      ([skill, items]) => {
        // Ensure items array is not empty before accessing last element
        const mostRecent =
          items.length > 0 ? items[items.length - 1].posteriorP_L : 0;
        return {skill, avgPosteriorP_L: mostRecent};
      }
    );

    // Difficulty insights
    const difficultyBuckets: {[key: string]: QuestionResponseData[]} = {
      "1": [],
      "2": [],
      "3": [],
    };
    data.forEach((r) => {
      // Ensure difficulty exists and is one of the expected keys
      if (r.difficulty in difficultyBuckets) {
        difficultyBuckets[r.difficulty].push(r);
      }
    });

    const difficultyInsights: DifficultyInsight[] = Object.entries(
      difficultyBuckets
    ).map(([diff, items]) => {
      const correct = items.filter((r) => r.isCorrect).length;
      return {
        difficulty: diff,
        count: items.length,
        accuracy: items.length > 0 ? correct / items.length : 0,
      };
    });

    const shouldPromote =
      finalPL >= 0.9 && recentCorrect && hardAccuracy >= 0.7 && steadyGrowth;

    return {
      totalQuestions: total,
      correctAnswers: correct,
      accuracy: correct / total,
      avgPosteriorP_L:
        total > 0
          ? data.reduce((acc, r) => acc + r.posteriorP_L, 0) / total
          : 0,
      finalPL,
      recentCorrect,
      hardAccuracy,
      steadyGrowth,
      skillMastery,
      difficultyInsights,
      promotion: shouldPromote ? "Promote ✅" : "Reinforce ❌",
      shouldPromote,
    };
  };

  const latestAssessment = getMostRecentAssessment(userResponses);
  const insights = runInsights(latestAssessment);

  const narrative = generateLearningNarrative(
    insights,
    userKnowledgeStates,
    stage
  );

  if (!userData) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen text-center text-red-600">
        User data not available. Please log in.
      </div>
    );
  }

  if (!knowledgeStates || knowledgeStates.length === 0) {
    return null;
  }

  return (
    <>
      <UserNavbar />
      <div className="mx-auto py-6 px-10 bg-gradient-to-b from-orange-50 to-orange-100 min-h-screen">
        {narrative && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-2">
              📖 Teacher Narrative
            </h2>
            <p className="text-gray-700 text-base">
              <BoldText text={`${narrative}`} />
            </p>
          </div>
        )}

        <div className="w-full flex justify-center m-4 mx-auto">
          {" "}
          <button className="px-6 py-3 bg-[#f97316] text-white font-semibold rounded-lg shadow hover:bg-[#ea580c] transition">
            <Link href={`/topics`}>Continue Learning</Link>
          </button>{" "}
        </div>
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
          🧠 Recap Your Skills with Mini Quizzes
        </h1>

        {skillProgress && skillProgress?.studentSkills?.length > 0 ? (
          skillProgress.studentSkills.map((skill) => (
            <div
              key={skill.skill.id}
              className="bg-white border border-orange-100 rounded-xl shadow-sm p-6 mb-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition hover:shadow-md"
            >
              <div>
                <h2 className="text-xl font-semibold text-orange-700">
                  {skill.skill.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Mastery:{" "}
                  <span className="font-medium text-orange-500">
                    {Math.round(skill.mastery * 100)}%
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-2 text-sm">
                <span className="text-gray-500">
                  Last Reviewed:{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(skill.lastUpdated).toLocaleDateString()}
                  </span>
                </span>
                <a
                  href={`/skills/${skill.skill.id}`}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition text-sm font-medium"
                >
                  Review Now
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-6">
            No skills to review yet. Keep learning!
          </p>
        )}
      </div>
    </>
  );
};

export default UserProgressDashboarde;
