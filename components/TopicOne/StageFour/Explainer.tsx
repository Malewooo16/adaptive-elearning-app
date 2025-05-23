"use client";
import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import TopicOneStageFourQuiz from "./Quiz";
import YouTubeVideoLink from "@/components/Common/YoutubeVideoLink";

export default function TopicOneStageFour() {
  const [expression, setExpression] = useState("2(x + 3) + 4x - 5");
  const [simplifiedExpression, setSimplifiedExpression] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    gsap.from(".stage-four-content", { opacity: 0, y: 40, duration: 0.8, ease: "power2.out" });
  }, []);

  const handleDistribute = () => {
    setSimplifiedExpression("2x + 6 + 4x - 5");
    setStep(1);
    gsap.fromTo(
      ".distribution-step",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  };

  const handleCombine = () => {
    setSimplifiedExpression("6x + 1");
    setStep(2);
    gsap.fromTo(
      ".final-step",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-orange-50 min-h-screen p-6">
      <div className="stage-four-content w-full max-w-2xl p-6 md:p-8 bg-white shadow-xl rounded-2xl border-l-4 border-orange-500">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-orange-600">
          Stage 4: Distributive Property
        </h2>

        <p className="mb-6 text-gray-700 text-lg">
          The distributive property helps us eliminate parentheses by distributing multiplication over addition or subtraction. Let's simplify step by step.
        </p>

        <div className="bg-orange-100 border border-orange-300 p-4 rounded-xl">
          <p className="text-lg font-semibold text-orange-700">Original Expression:</p>
          <p className="text-2xl font-bold text-orange-900 tracking-wide">{expression}</p>
        </div>

        {step === 0 && (
          <button
            onClick={handleDistribute}
            className="mt-6 px-6 py-2.5 bg-orange-600 text-white rounded-xl shadow-md hover:bg-orange-700 transition-all duration-300"
          >
            Distribute
          </button>
        )}

        {step >= 1 && (
          <div className="distribution-step mt-8 p-5 bg-teal-50 border-l-4 border-teal-400 rounded-xl">
            <p className="text-lg font-semibold text-teal-700">After Distribution:</p>
            <p className="text-xl font-bold text-teal-900 mt-2">{simplifiedExpression}</p>

            {step === 1 && (
              <button
                onClick={handleCombine}
                className="mt-5 px-6 py-2.5 bg-teal-600 text-white rounded-xl shadow hover:bg-teal-700 transition"
              >
                Combine Like Terms
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="final-step mt-8 p-6 bg-purple-50 border-l-4 border-purple-500 rounded-xl">
            <p className="text-lg font-semibold text-purple-700">Final Simplified Expression:</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">6x + 1</p>
            <p className="mt-3 text-sm text-gray-600 italic">🎉 Great job! You've mastered distribution and combining like terms.</p>
          </div>
        )}

        <div className="mt-10 p-4 bg-orange-100 rounded-xl border border-orange-300">
          <h3 className="text-xl font-semibold text-orange-700 mb-2">Need a recap?</h3>
          <YouTubeVideoLink videoId="r5GJ8UMUMP8" linkText="Watch this video explanation" />
        </div>
      </div>

      <div className="mt-12 w-full max-w-2xl">
        <TopicOneStageFourQuiz />
      </div>
    </div>
  );
}
