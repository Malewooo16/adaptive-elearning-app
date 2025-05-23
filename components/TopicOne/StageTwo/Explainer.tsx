"use client";
import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { evaluate } from "mathjs";
import TopicOneStageTwoQuiz from "./Quiz";
import YouTubeVideoLink from "@/components/Common/YoutubeVideoLink";

export default function TopicOneStageTwo() {
  const [expression] = useState("3x + 2y");
  const [xValue, setXValue] = useState(4);
  const [yValue, setYValue] = useState(5);
  const [substitutedExpression, setSubstitutedExpression] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  const [hint, setHint] = useState("");

  useEffect(() => {
    gsap.fromTo(
      ".burst-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, [burst]);

  const handleSubstitution = () => {
    const substituted = expression.replace(/x/g, `(${xValue})`).replace(/y/g, `(${yValue})`);
    setSubstitutedExpression(substituted);
    setHint("Awesome! You’ve substituted the values into the expression.");
    setBurst(2);
  };

  const handleEvaluation = () => {
    try {
      const calculated = evaluate(substitutedExpression);
      setResult(calculated);
      setHint("🎉 Well done! You’ve evaluated the expression.");
      setBurst(3);
    } catch (error) {
      setHint("⚠️ Oops! Double-check your inputs.");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-2xl space-y-6">

        {/* Burst 1: Intro */}
        {burst === 0 && (
          <div className="burst-card bg-white p-6 rounded-xl shadow-md border-l-8 border-orange-400">
            <h2 className="text-xl font-bold text-orange-700 mb-2">🎯 Learning Burst: Substitution & Evaluation</h2>
            <p className="text-gray-700">
              You’re given an expression: <strong>{expression}</strong>. Think of it like a recipe! <br />
              'x' is cups of flour and 'y' is eggs. Let's plug in some values to see how many cookies you can bake 🍪.
            </p>
            <button
              onClick={() => setBurst(1)}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Let’s Start
            </button>
          </div>
        )}

        {/* Burst 2: Input Values */}
        {burst === 1 && (
          <div className="burst-card bg-white p-6 rounded-xl shadow-md border-l-8 border-orange-400">
            <h3 className="text-lg font-semibold text-orange-700 mb-3">🔢 Step 1: Set Your Values</h3>
            <p className="mb-4 text-gray-700">Choose values for x and y to substitute into <strong>{expression}</strong>.</p>
            <div className="flex gap-6 mb-4">
              <div>
                <label className="block text-sm text-gray-600">Cups of flour (x):</label>
                <input
                  type="number"
                  value={xValue}
                  onChange={(e) => setXValue(parseInt(e.target.value || "0"))}
                  className="border p-2 rounded w-24 text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Eggs (y):</label>
                <input
                  type="number"
                  value={yValue}
                  onChange={(e) => setYValue(parseInt(e.target.value || "0"))}
                  className="border p-2 rounded w-24 text-center"
                />
              </div>
            </div>
            <button
              onClick={handleSubstitution}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Substitute Now
            </button>
          </div>
        )}

        {/* Burst 3: Show Substitution */}
        {burst === 2 && (
          <div className="burst-card bg-white p-6 rounded-xl shadow-md border-l-8 border-orange-400">
            <h3 className="text-lg font-semibold text-orange-700 mb-3">🔍 Step 2: Substituted Expression</h3>
            <p className="text-gray-700 mb-3">
              After plugging in x = {xValue} and y = {yValue}, we get:
            </p>
            <p className="text-xl font-bold text-blue-800">{substitutedExpression}</p>
            <p className="mt-2 text-sm text-green-700">{hint}</p>
            <button
              onClick={handleEvaluation}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Calculate Result
            </button>
          </div>
        )}

        {/* Burst 4: Final Result */}
        {burst === 3 && (
          <div className="burst-card bg-white p-6 rounded-xl shadow-md border-l-8 border-green-500">
            <h3 className="text-lg font-semibold text-green-700 mb-3">✅ Final Step: Evaluation Result</h3>
            <p className="text-gray-700">You’ve simplified the expression and calculated the total:</p>
            <p className="text-2xl font-bold text-green-700 mt-2">= {result}</p>
            <p className="mt-2 text-sm text-green-700">{hint}</p>
          </div>
        )}

        {/* Burst 5: Order of Operations */}
        {burst >= 3 && (
          <div className="burst-card bg-white p-6 rounded-xl shadow-md border-l-8 border-yellow-400">
            <h3 className="text-lg font-bold text-yellow-700 mb-2">📘 Bonus Tip: Order of Operations</h3>
            <p className="text-gray-700 mb-4">
              Let’s see why following BODMAS is important.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-blue-800 font-semibold">Correct:</p>
              <p className="text-gray-800">6x + 1 when x = 6</p>
              <p className="text-gray-800">= 6(6) + 1 = <strong className="text-green-700">37</strong></p>

              <hr className="my-3" />

              <p className="text-red-800 font-semibold">Incorrect:</p>
              <p className="text-gray-800">6 × (6 + 1) = 6 × 7 = <strong className="text-red-700">42 ❌</strong></p>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Always follow <strong>BODMAS</strong>: Brackets, Orders, Division, Multiplication, Addition, Subtraction.
            </p>
          </div>
        )}

        {/* Video Section */}
        {burst >= 3 && (
          <div className="burst-card bg-white p-6 rounded-xl shadow-md border-l-8 border-orange-400">
            <h3 className="text-lg font-bold text-orange-700 mb-2">📺 Need Help?</h3>
            <p className="text-gray-700 mb-2">Watch this short video to understand substitution and evaluation better.</p>
            <YouTubeVideoLink videoId="K16dLKw2oMo" linkText="Click to watch the video" />
          </div>
        )}

        {/* Quiz Section */}
        {burst >= 3 && <TopicOneStageTwoQuiz />}
      </div>
    </div>
  );
}
