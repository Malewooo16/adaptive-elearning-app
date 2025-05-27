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
  Icon,
} from "lucide-react";

import {getUserResponses} from "@/actions/questionsResponses";
import {getUserSessionInclusive} from "@/actions/user";
import {getStudentSkillProgress} from "@/actions/skills";
import {getUserKnowledgeStates} from "@/actions/mastery";

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

interface SkillMasteryInsight {
  skill: string;
  avgPosteriorP_L: number;
}

interface DifficultyInsight {
  difficulty: string;
  count: number;
  accuracy: number;
}

interface LearningInsights {
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

import { type ComponentType, SVGProps } from "react";

type Accent = "orange" | "green" | "purple" | "blue";

interface CardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>; // lucide-react / heroicons, etc.
  title: string;
  value: string | number;
  color: Accent;
}

const Card = ({ icon: Icon, title, value, color }: CardProps) => {
  const bg: Record<Accent, string> = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${bg[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};



// --- Component ---

const UserProgressDashboarde = async () => {
  const loading = false; // This will likely be a state or prop in a client component

  // These actions should be typed at their source to ensure correct return types
  const userData = await getUserSessionInclusive(); // Make sure this returns UserData
  const skillProgress = await getStudentSkillProgress(); // Make sure this matches the return type
  const userResponses = await getUserResponses(userData?.id || ""); // Ensure ID is passed and handled
  const knowledgeStates = await getUserKnowledgeStates(userData?.id || ""); // Ensure ID is passed and handled

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

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Round seconds for cleaner display
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (date: Date): string => {
    // Changed type to Date object
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMasteryColor = (mastery: number): string => {
    if (mastery >= 0.8) return "text-green-600 bg-green-100";
    if (mastery >= 0.6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getMasteryLabel = (mastery: number): string => {
    if (mastery >= 0.8) return "Advanced";
    if (mastery >= 0.6) return "Proficient";
    if (mastery >= 0.4) return "Developing";
    return "Beginning";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading progress data...</span>
        </div>
      </div>
    );
  }

  //console.log("User Data", userData);

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
  // Calculate overall accuracy if insights are not available (e.g., no recent assessments)
  const overallAccuracy =
    knowledgeStates.reduce((acc, k) => acc + k.correctAnswers, 0) /
    knowledgeStates.reduce((acc, k) => acc + k.totalQuestions, 0);

  if (!skillProgress) {
    return null;
  }

  // Calculate average mastery from skillProgress if available
  const avgSkillMastery =
    skillProgress?.studentSkills.length > 0
      ? skillProgress.studentSkills.reduce((acc, s) => acc + s.mastery, 0) /
        skillProgress.studentSkills.length
      : 0;

      
  return (
   <div className="max-w-6xl mx-auto p-6 bg-orange-50 min-h-screen">
  {/* Header */}
  <div className="bg-white rounded-2xl shadow p-6 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
          <p className="text-gray-600">{userData.email}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Current Stage</p>
        <p className="text-xl font-semibold text-orange-600">
          Stage {userData.currentStageNumber}
        </p>
        <p className="text-sm text-gray-600">{userData.currentTopicId}</p>
      </div>
    </div>
  </div>

  {/* AI Insights */}
  {insights && (
    <div className="bg-white rounded-2xl shadow border-l-4 border-orange-500 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-orange-600" />
        AI Learning Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Final Knowledge Level</p>
          <p className="text-2xl font-bold text-orange-600">
            {Math.round(insights.finalPL * 100)}%
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Hard Questions Accuracy</p>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(insights.hardAccuracy * 100)}%
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Recommendation</p>
          <p className="text-lg font-semibold">{insights.promotion}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">
            Performance Indicators
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Recent Streak:</span>
              <span
                className={
                  insights.recentCorrect ? "text-green-600" : "text-red-600"
                }
              >
                {insights.recentCorrect ? "Strong ✅" : "Needs Work ❌"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Steady Growth:</span>
              <span
                className={
                  insights.steadyGrowth ? "text-green-600" : "text-red-600"
                }
              >
                {insights.steadyGrowth ? "Yes ✅" : "Inconsistent ❌"}
              </span>
            </div>
          </div>
        </div>

        {insights.difficultyInsights && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Difficulty Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              {insights.difficultyInsights.map((diff) => (
                <div key={diff.difficulty} className="flex justify-between">
                  <span>Level {diff.difficulty}:</span>
                  <span>
                    {Math.round(diff.accuracy * 100)}% ({diff.count} questions)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )}

  {/* Overview Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card icon={BookOpen} title="Stages Completed" value={knowledgeStates.length} color="orange" />
    <Card icon={Target} title="Overall Accuracy" value={`${Math.round((insights?.accuracy ?? overallAccuracy) * 100)}%`} color="green" />
    <Card icon={Clock} title="Total Study Time" value={formatTime(knowledgeStates.reduce((acc, k) => acc + k.totalTimeSpent, 0))} color="purple" />
    <Card icon={Award} title="Avg Mastery" value={`${Math.round(avgSkillMastery * 100)}%`} color="blue" />
  </div>

  {/* Progress Sections */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Skill Mastery Progress */}
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-orange-600" />
        Skill Mastery Progress
      </h2>
      <div className="space-y-4">
        {skillProgress?.studentSkills.map((skill) => (
          <div
            key={skill.id}
            className="border-b border-gray-100 pb-3 last:border-none"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{skill.skill.name}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(skill.mastery)}`}
                >
                  {getMasteryLabel(skill.mastery)}
                </span>
                <span className="text-sm text-gray-600">{Math.round(skill.mastery * 100)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${skill.mastery * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Updated: {formatDate(skill.lastUpdated)}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Stage Progress */}
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-orange-600" />
        Stage Progress
      </h2>
      <div className="space-y-4">
        {knowledgeStates.map((stage) => (
          <div
            key={stage.id}
            className="border rounded-xl p-4 hover:bg-orange-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {stage.preassessmentCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <h3 className="font-medium text-gray-900">
                  {stage.stage.title}
                </h3>
              </div>
              <span className="text-sm text-gray-500">
                {Math.round(stage.mastery * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>Time: {formatTime(stage.totalTimeSpent)}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stage.mastery * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default UserProgressDashboarde;
