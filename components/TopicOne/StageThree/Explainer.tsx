"use client";
import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import TopicOneStageThreeQuiz from "./Quiz";
import YouTubeVideoLink from "@/components/Common/YoutubeVideoLink";

export default function TopicOneStageThree() {
  const [expression, setExpression] = useState("3x + 2y - x + 4y");
  const [simplifiedSteps, setSimplifiedSteps] = useState<{ text: string; key: string }[]>([]);
  const [step, setStep] = useState(0); // 0: initial, 1: showing steps, 2: final answer

  useEffect(() => {
    gsap.from(".stage-three-content", { opacity: 0, y: 50, duration: 1, ease: "power2.out" });
  }, []);

  const handleSimplify = () => {
    const steps = [
      { text: "Group like terms: (3x - x) + (2y + 4y)", key: "step1" },
      { text: "Simplify: 2x + 6y", key: "step2" },
    ];

    setSimplifiedSteps(steps);
    setStep(1);

    gsap.fromTo(
      ".simplification-steps p",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.3 }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-orange-100 p-8 min-h-screen">
      <div className="stage-three-content w-full max-w-xl p-8 bg-white rounded-lg border-2 border-orange-700 shadow-2xl text-center">
        <h2 className="text-4xl font-extrabold text-orange-800 mb-6">Stage 3: Combining Like Terms</h2>

        <p className="mb-6 text-orange-900 text-lg font-semibold leading-relaxed max-w-prose mx-auto">
          Imagine you have a bag of apples 🍏 and oranges 🍊. Instead of counting them separately,
          you combine them:{" "}
          <strong className="text-orange-700">3 apples - 1 apple = 2 apples</strong>. In math,
          we do the same with like terms!
        </p>

        <p className="mb-8 text-orange-900 text-xl font-bold">
          Let's simplify:{" "}
          <span className="text-orange-700 bg-orange-200 px-2 rounded-md">{expression}</span>
        </p>

        {step === 0 && (
          <button
            onClick={handleSimplify}
            className="mt-4 px-8 py-3 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-orange-400"
            aria-label="Combine like terms"
          >
            Combine Like Terms
          </button>
        )}

        {step >= 1 && (
          <div className="simplification-steps mt-6 space-y-4 max-w-lg mx-auto">
            {simplifiedSteps.map(({ text, key }) => (
              <p key={key} className="text-lg font-semibold text-orange-800 bg-orange-100 p-4 rounded-md shadow-inner">
                {text}
              </p>
            ))}
          </div>
        )}

        {step === 1 && (
          <button
            onClick={() => setStep(2)}
            className="mt-6 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-green-400"
            aria-label="Show final answer"
          >
            Show Final Answer
          </button>
        )}

        {step === 2 && (
          <div className="mt-8 text-3xl font-extrabold text-green-700 bg-green-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
            Final Answer: <span className="text-black ml-2">2x + 6y</span>
          </div>
        )}

        {/* Additional explanation */}
        <div className="mt-12 p-6 bg-orange-50 border border-orange-300 rounded-lg max-w-xl mx-auto shadow-inner">
          <h3 className="text-2xl font-bold mb-4 text-orange-800">Why Combine Like Terms?</h3>
          <p className="text-orange-900 text-md leading-relaxed">
            Combining like terms helps simplify expressions so that they are easier to work with.
            Like terms are terms that have the same variable parts (for example, <code>3x</code> and <code>-x</code>),
            and you can add or subtract their coefficients.
          </p>
          <p className="mt-4 text-orange-900 text-md leading-relaxed">
            This is important for solving equations and understanding how variables interact in algebra.
          </p>
        </div>

        <div className="mt-12 p-8 bg-orange-100 border border-orange-400 rounded-lg shadow-md max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-orange-800">🎥 Watch Video for More Info</h3>
          <YouTubeVideoLink videoId="o8mHyddtq3o" linkText="Click to watch the video" />
        </div>
      </div>

      <div className="mt-12 w-full max-w-xl">
        <TopicOneStageThreeQuiz />
      </div>
    </div>
  );
}
