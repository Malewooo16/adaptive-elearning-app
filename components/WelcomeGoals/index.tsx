"use client";

import { createUserGoals } from "@/actions/userGoals";
import Link from "next/link";
import { useState } from "react";

const goals = [
  {
    type: "Practice Goal",
    description: "Solve a number of questions today",
    options: [10, 20, 30, 40],
  },
  {
    type: "Mastery Goal",
    description: "Reach mastery in your learning stage",
    options: [50, 75, 90],
  },
];

export default function WelcomeGoals({userId}:{userId:string}) {
  const [selectedGoals, setSelectedGoals] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState(1);
  const [goalError, setGoalError] = useState(false)
  const [loading, setLoading] = useState(false);

  const handleSelect = (goalType: string, option: string) => {
    setSelectedGoals((prev) => {
      const current = prev[goalType];
      // Toggle off if already selected
      if (current === option) {
        const updated = { ...prev };
        delete updated[goalType];
        return updated;
      }
      return { ...prev, [goalType]: option };
    });
  };

  const isSelected = (goalType: string, option: string) => {
    return selectedGoals[goalType] === option;
  };

const handleStart = async () => {
  setLoading(true);
  setGoalError(false); // Reset error state on new attempt

  if (Object.keys(selectedGoals).length === 0) {
    setGoalError(true);
    setLoading(false);
    return;
  }

  try {
    const response = await createUserGoals(userId, selectedGoals);

    if (response.success) {
      setStep(3);
      console.log("Goals successfully set:", selectedGoals);
    } else {
      setGoalError(true);
      console.error("Failed to create user goals:", response.message);
    }

  } catch (error) {
    setGoalError(true);
    console.error("Error creating user goals:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 space-y-6">
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-orange-600">Welcome 👋</h2>
            <p className="text-gray-600 mt-2">
              Let’s get started with your learning journey. Set your daily goals to stay consistent and focused.
            </p>

            <button
              onClick={() => setStep(2)}
              className="mt-6 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Let's Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold text-orange-600 mb-4">Set Your Daily Goals</h3>
            <p className="text-gray-500 mb-6">Select at least one goal below and choose a level for today’s target.</p>

            <div className="space-y-6">
              {goals.map((goal) => (
                <div key={goal.type} className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-orange-700">{goal.type}</h4>
                  <p className="text-sm text-gray-500 mb-3">{goal.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {goal.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelect(goal.type, String(option))}
                        className={`px-4 py-2 rounded-lg border transition ${
                          isSelected(goal.type, String(option))
                            ? "bg-orange-600 text-white border-orange-600"
                            : "border-gray-300 text-gray-700 hover:bg-orange-100"
                        }`}
                      >
                        {option} {goal.type === "Practice Goal" ? "Qns" : "%"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
              {goalError && (
              <p className="text-red-500 mt-4">
                Please select at least one goal to continue. </p>
              )}
            <button
              onClick={handleStart}
              className="mt-4 w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition"
            >
              {loading ? (
                <span className="loading loading-spinner loading-lg"></span>) :( <span>Continue</span>
              )}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-orange-600">🎉 You're All Set!</h2>
            <p className="text-gray-600">
              Your goals have been saved. Stay consistent and focused — we're excited to help you grow.
            </p>
            <button className="bg-orange-500 text-orange-50 px-6 py-4 rounded-xl font-medium hover:bg-orange-600 transition">
             <Link href="/topics"> Happy Learning! 🚀</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
