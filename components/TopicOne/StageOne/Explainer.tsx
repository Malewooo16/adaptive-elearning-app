"use client";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import TopicOneStageOneQuiz from "./Quiz";
import YouTubeVideoLink from "@/components/Common/YoutubeVideoLink";

export default function TopicOneStageOne() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    gsap.from(".mystery-box", { opacity: 0, y: -50, duration: 1, ease: "bounce.out" });
    gsap.from(".variables-list", { opacity: 0, x: -50, duration: 1, delay: 0.5 });
    gsap.from(".coefficients-section", { opacity: 0, x: 50, duration: 1, delay: 1 });
  }, []);

  const revealValue = () => {
    gsap.to(".mystery-box", { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
    setTimeout(() => setRevealed(true), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-orange-100 p-8 min-h-screen">
      <div className="text-center w-full max-w-xl p-8 bg-white shadow-xl rounded-lg border-2 border-orange-700">
        <h2 className="text-4xl font-extrabold mb-6 text-orange-800">Stage 1: Understanding Variables</h2>
        <p className="mb-8 text-orange-900 text-lg font-semibold leading-relaxed">
          A variable is like a mystery box that holds a number.
        </p>

        {/* Mystery Box Animation */}
        <div
          className="mystery-box w-28 h-28 bg-gradient-to-tr from-orange-600 to-orange-800 text-white flex items-center justify-center text-6xl font-extrabold rounded-lg shadow-2xl mx-auto mb-6 cursor-pointer select-none"
          onClick={revealValue}
          title="Click to reveal"
        >
          {revealed ? "5" : "?"}
        </div>
        <button
          onClick={revealValue}
          className="mt-3 px-8 py-3 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-orange-400"
          aria-label="Reveal the mystery value"
        >
          Reveal the Value
        </button>
      </div>

      {/* Variables List Animation */}
      <div className="variables-list mt-12 text-center p-8 w-full max-w-xl bg-white shadow-xl rounded-lg border-2 border-orange-700">
        <h3 className="text-3xl font-bold mb-7 text-orange-800">Examples of Variables</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-5 bg-orange-600 text-white rounded-md shadow-lg font-semibold text-xl">x = 3</div>
          <div className="p-5 bg-orange-700 text-white rounded-md shadow-lg font-semibold text-xl">y = 7</div>
          <div className="p-5 bg-orange-500 text-white rounded-md shadow-lg font-semibold text-xl">a = 10</div>
          <div className="p-5 bg-orange-800 text-white rounded-md shadow-lg font-semibold text-xl">b = 15</div>
        </div>
      </div>

      {/* Coefficients Section */}
      <div className="coefficients-section mt-12 text-center p-8 w-full max-w-xl bg-white shadow-xl rounded-lg border-2 border-orange-700">
        <h3 className="text-3xl font-bold mb-7 text-orange-800">Understanding Coefficients</h3>
        <p className="mb-6 text-orange-900 text-lg font-semibold leading-relaxed">
          Sometimes, a variable has a number in front of it. This number is called a <strong>coefficient</strong>.
        </p>
        <p className="mb-9 text-orange-900 text-md leading-relaxed max-w-prose mx-auto">
          <strong>Analogy:</strong> Think of it like buying multiple packs of the same item. If you buy 3 packs of apples, and each pack has 'x' apples, you have 3x apples. Here, 3 is the coefficient.
        </p>
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          <div className="p-5 bg-orange-600 text-white rounded-md shadow-lg font-semibold text-xl">2x (2 is the coefficient)</div>
          <div className="p-5 bg-orange-700 text-white rounded-md shadow-lg font-semibold text-xl">5y (5 is the coefficient)</div>
        </div>

        <div className="mt-12 p-8 bg-orange-100 border border-orange-400 rounded-lg shadow-md max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-5 text-orange-800">🎥 Watch Video for More Info</h3>
          <YouTubeVideoLink videoId="go9b2LPXTuA" linkText="Click to watch the video" />
        </div>
      </div>

      {/* Quiz Section */}
      <div className="mt-12 w-full max-w-xl">
        <TopicOneStageOneQuiz />
      </div>
    </div>
  );
}
