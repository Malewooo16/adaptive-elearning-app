

// page.tsx (or your component file)

import { getUserKnowledgeStates } from "@/actions/mastery";
import {
  getAllSkillsInAStageForStudent,
  getAllStageSkills,
} from "@/actions/skills";
import { auth } from "@/auth/authOptions";

export default async function StageInfoWithSkills({ stageId }: { stageId: string }) {
  const session = await auth();
  if (!session) return;

  const knowledgeStates = await getUserKnowledgeStates(session.user?.id as string);
  if (!knowledgeStates)
    return <p className="text-center text-red-500">Oops! No Topics Available</p>;

  const getMastery = (id: string) => {
    const mastery = knowledgeStates.find((t) => t.stageId === id);
    return mastery ? mastery.mastery : 0;
  };

  const mastery = getMastery(stageId) * 100;

  const { studentSkills, stageSkills } = await getAllSkillsInAStageForStudent(stageId) || {studentSkills:[], stageSkills:[]};

 // console.log(stageSkills)

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 my-2">
        Pre-Assessment:{" "}
        {mastery === 0 ? (
          <span className="text-red-500">❌ Not Completed</span>
        ) : (
          <span className="text-green-600">✅ Completed</span>
        )}
      </p>

      <div className="bg-white/90 shadow-lg rounded-2xl p-4 w-full max-w-md border-2 border-blue-400">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Skills</h2>
        <ul className="mt-3 space-y-3">
          {stageSkills.map((sk, index) => {
            const studentSkill = studentSkills.find(
              (ss) => ss.skillId === sk.skillId
            );
            const skillMastery = studentSkill ? studentSkill.mastery * 100 : 0;

            return (
              <li
                key={index}
                className="p-3 bg-blue-50 border border-blue-300 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <p className="text-blue-800 font-medium">{sk.skill?.name}</p>
                  <p className="text-blue-600 font-semibold mx-2">
                    {Math.round(skillMastery)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.round(skillMastery)}%`,
                      backgroundColor: skillMastery > 0 ? "blue" : "gray",
                    }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}