import {getUserKnowledgeStates} from "@/actions/mastery";
import {getTopics} from "@/actions/topics";
import {auth} from "@/auth/authOptions";
import {CheckCircle, Lock, Star, ArrowRight} from "lucide-react";
import Progress from "@/components/Progress";
import Link from "next/link";
import {getUserCurrentStageId} from "@/actions/stages";
import StageInfoWithSkills from "@/components/Stage/StageInfoWithSkills";
import {slugify} from "@/lib/utils/slugify";
import UserNavbar from "@/components/Common/UserNavbar";

export default async function TopicsPage() {
  const session = await auth();
  if (!session) return;

  const currentStage = await getUserCurrentStageId(session.user?.id as string);

  const knowledgeStates = await getUserKnowledgeStates(
    session.user?.id as string
  );
  if (!knowledgeStates) return;

  const topics = await getTopics();
  //console.log(topics?.map(topic => topic.stages.flatMap(s => s.title)).flat())
  if (!topics)
    return (
      <p className="text-center text-red-500">Oops! No Topics Available</p>
    );

  const getMastery = (id: string) => {
    const mastery = knowledgeStates.find((t) => t.stageId === id);
    return mastery ? mastery.mastery : 0;
  };

  const getLearned = (id: string) => {
    const mastery = knowledgeStates.find((t) => t.stageId === id);
   // console.log(mastery, id);
    return mastery ? mastery.hasLearned : false;
  };

  const getPreassessmentCompleted = (id: string) => {
    const mastery = knowledgeStates.find((t) => t.stageId === id);
    return mastery ? mastery.preassessmentCompleted : false;
  };

  const getActionLink = (
    mastery: number,
    stageId: string,
    title: string,
    hasLearned?: boolean,
    preassesmentCompleted?: boolean
  ) => {
    if (mastery === 0) return `/preassessments/${stageId}`; // First step is a pre-assessment
    if (!hasLearned && mastery < 50 && preassesmentCompleted)
      return `/stage/${slugify(title)}?ks=${stageId}`; // Reinforcement if struggling
    if (hasLearned && mastery < 50)
      return `/questions/${stageId}`
    return `/questions/${stageId}`; // Direct to questions if learned or progressing well
  };

  return (
  <div className="w-full mx-auto min-h-screen bg-gradient-to-b from-orange-100 to-orange-300">
  <UserNavbar />
  <div className="flex flex-col justify-center p-6">
    <h1 className="text-4xl font-bold text-center text-orange-600 mb-8">
      Topics
    </h1>

    <div className="grid grid-cols-1 gap-6">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="bg-white rounded-2xl shadow-xl p-6 border border-orange-300"
        >
          <h2 className="text-2xl font-semibold text-orange-600">
            {topic.name}
          </h2>

          <div className="mt-4">
            <div className="join join-vertical w-full">
              {topic.stages.map((stage) => {
                const mastery = getMastery(stage.id) * 100;
                const hasLearned = getLearned(stage.id);
                const isCurrentStage = stage.id === currentStage;
                const isLocked = !isCurrentStage && mastery < 100;
                const preassesmentCompleted = getPreassessmentCompleted(stage.id);

                return (
                  <div
                    key={stage.id}
                    className="collapse collapse-arrow border border-orange-200 bg-orange-50 rounded-lg shadow-sm mb-2"
                  >
                    <input
                      type="radio"
                      name="accordion-topic"
                      defaultChecked={isCurrentStage}
                    />
                    <div className="collapse-title text-lg font-semibold flex justify-between items-center">
                      <span className="text-orange-700">{stage.title}</span>
                      <div className="flex items-center gap-3">
                        {mastery >= 100 ? (
                          <CheckCircle className="text-green-500" size={24} />
                        ) : mastery > 50 ? (
                          <Star className="text-yellow-400" size={24} />
                        ) : (
                          <Lock className="text-gray-400" size={24} />
                        )}
                        <p className="text-sm text-gray-700">{mastery}%</p>
                        <Progress
                          value={mastery}                          
                        />
                      </div>
                    </div>

                    <div className="collapse-content">
                      <p className="text-gray-700 text-sm mb-2">
                        Improve your mastery by solving more problems!
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <StageInfoWithSkills stageId={stage.id} />
                        <Link
                          href={
                            isLocked
                              ? "#"
                              : getActionLink(
                                  mastery,
                                  stage.id,
                                  stage.title,
                                  hasLearned,
                                  preassesmentCompleted
                                )
                          }
                        >
                          <button
                            className={`btn btn-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow
                              ${
                                isLocked
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-orange-500 text-white hover:bg-orange-600"
                              }`}
                            disabled={isLocked}
                          >
                            {mastery === 0
                              ? "Start Pre-Assessment"
                              : !hasLearned
                              ? "Reinforce"
                              : "Continue"}
                            <ArrowRight size={16} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Recap Card After Topic */}
<div className="mt-6 p-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border-l-4 border-orange-500 shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
  <div>
    <h3 className="text-2xl font-bold text-orange-700 mb-2">
      🧠 Topic Recap: {topic.name}
    </h3>
    <p className="text-gray-700 mb-4">
      Here’s a summary of your progress in <strong>{topic.name}</strong>:
    </p>
    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
      {topic.stages.map((stage) => {
        const mastery = getMastery(stage.id) * 100;
        return (
          <li key={stage.id}>
            <span className="font-semibold">{stage.title}</span>:{" "}
            {mastery >= 100 ? (
              <span className="text-green-600">✅ Mastered</span>
            ) : (
              <span className="text-yellow-600">{mastery}% complete</span>
            )}
          </li>
        );
      })}
    </ul>

   
    
   
  </div>

  <div className="self-stretch lg:self-center">
  <Link href={`/final-assessment/${topic.id}`}>
    <button
      className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center gap-2
        ${topic.stages.every((s) => getMastery(s.id) * 100 >= 100)
          ? "bg-orange-600 text-white hover:bg-orange-700"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
      disabled={!topic.stages.every((s) => getMastery(s.id) * 100 >= 100)}
    >
      📝 Do Final Assessment
    </button>
  </Link>
</div>
          
  
</div>

          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}
