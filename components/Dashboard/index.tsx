"use client";
import {useEffect, useRef} from "react";
import gsap from "gsap";
import {DashboardInfo} from "@/types/types";
import Link from "next/link";

const Dashboard = ({userData}: {userData: DashboardInfo}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const {user, currentStage, knowledgeStates, skillProgress} = userData;

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto p-6  bg-white shadow-xl rounded-xl"
    >
      {/* User Greeting */}
      <h1 className="text-2xl font-bold text-[#0f172a]">
        Welcome, {user.name} 👋
      </h1>

      {/* Current Learning Stage */}
      <div className="mt-6 p-5 bg-[#eff6ff] border-l-4 border-[#0f172a] rounded-lg shadow">
        <h2 className="text-xl font-semibold text-[#0f172a]">
          📌 {currentStage?.title}
        </h2>
        <p className="text-gray-700">{currentStage?.topic.name}</p>
      </div>

      {/* Knowledge State */}
      <div className="mt-6 p-5 bg-[#f3f4f6] rounded-lg shadow">
        <h2 className="text-lg font-semibold text-[#374151]">
          📊 Knowledge State
        </h2>
        {knowledgeStates.map((state) => (
          <div
            key={state.id}
            className="mt-3 p-3 bg-white rounded-md shadow-sm"
          >
            <p className="font-medium text-[#374151]">{state.stage.title}</p>
            <p className="text-[#0f172a] font-semibold">
              {Math.round(state.mastery * 100)}% Mastery
            </p>
          </div>
        ))}
      </div>

      {/* Skill Progress */}
      <div className="mt-6 p-5 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold text-[#374151]">
          🎯 Skill Progress
        </h2>
        <div className="mt-3 space-y-4">
          {skillProgress.map((skill) => (
            <div
              key={skill.id}
              className="p-4 bg-[#f3f4f6] rounded-md shadow-sm"
            >
              <p className="font-medium text-[#374151]">{skill.skill.name}</p>
              <div className="relative w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="h-full bg-[#0f172a] rounded-full text-center text-xs font-bold text-white"
                  style={{width: `${skill.mastery * 100}%`}}
                >
                  {Math.round(skill.mastery * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 text-center">
        <button className="px-6 py-3 bg-[#f97316] text-white font-semibold rounded-lg shadow hover:bg-[#ea580c] transition">
          <Link href={`/topics`}>Continue Learning 🚀</Link>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
