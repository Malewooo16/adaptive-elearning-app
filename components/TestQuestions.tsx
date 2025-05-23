"use client";

import React, { useEffect, useRef, useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { useReward } from "react-rewards";
import Link from "next/link";
import { Question } from "@prisma/client";
import { processPreassessmentMastery } from "@/actions/mastery";
import { useParams } from "next/navigation";
import { gsap } from "gsap";

interface PreAssesmentComponentProps {
  topicId: string;
  stageNumber: number;
  questions: Question[];
}

const PreAssessment: React.FC<PreAssesmentComponentProps> = ({
  questions,
  stageNumber,
  topicId,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [responses, setResponses] = useState<
    { questionId: number; selectedOption: string | null; correct: boolean }[]
  >([]);
  const [correctAnswerVisible, setCorrectAnswerVisible] = useState(false);
  const [mastery, setMastery] = useState<number | null>();
  const params = useParams<{ slug: string }>();

  const { reward, isAnimating } = useReward("rewardId", "confetti");

  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.to(progressBarRef.current, {
      width: `${(mastery || 0) * 100}%`,
      duration: 1.5,
      ease: "power3.out",
    });
  }, [mastery]);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const correctAnswer = questions[currentQuestion].answer.replace(/\$/g, "");
    const isCorrect = selectedOption.replace(/\$/g, "") === correctAnswer;

    const newResponse = {
      questionId: currentQuestion,
      selectedOption,
      correct: isCorrect,
    };

    setResponses((prev) => [...prev, newResponse]);

    if (isCorrect) {
      setFeedback("Correct!");
      reward();
    } else {
      setFeedback("Incorrect!");
      setCorrectAnswerVisible(true);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setCorrectAnswerVisible(false);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSendResponse = async () => {
    try {
      const response = await processPreassessmentMastery(
        responses,
        params.slug
      );
      setMastery(response?.stageMastery);
    } catch (error) {
      console.error("Error sending responses:", error);
    }
  };

  const renderOption = (option: string) =>
    option.includes("$") ? (
      <InlineMath>{option.replace(/\$/g, "")}</InlineMath>
    ) : (
      option
    );

  const renderQuestion = (questionText: string) =>
    questionText
      .split(/(\$.*?\$)/g)
      .map((part, index) =>
        part.startsWith("$") && part.endsWith("$") ? (
          <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>
        ) : (
          <span key={index}>{part}</span>
        )
      );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-orange-50">
      {currentQuestion < questions.length ? (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center border border-orange-200">
          <h2 className="text-2xl font-semibold text-orange-900">
            {renderQuestion(questions[currentQuestion].question)}
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(option)}
                className={`w-full px-5 py-3 rounded-lg font-medium text-lg transition-all duration-200 ${
                  selectedOption === option
                    ? "bg-orange-900 text-white"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
                disabled={isAnimating}
              >
                {renderOption(option)}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className={`mt-5 w-full px-5 py-3 rounded-lg font-semibold text-lg transition ${
              feedback ? "hidden" : "bg-green-600 text-white hover:bg-green-700"
            }`}
            disabled={!selectedOption}
          >
            Submit
          </button>

          {feedback && (
            <div className="mt-4 text-lg font-semibold animate-pulse">
              <p
                className={
                  feedback === "Correct!"
                    ? "text-green-600 drop-shadow"
                    : "text-red-500 drop-shadow"
                }
              >
                {feedback}
              </p>
              {correctAnswerVisible && (
                <p className="text-red-500 mt-2">
                  Correct answer:{" "}
                  {renderOption(questions[currentQuestion].answer)}
                </p>
              )}
            </div>
          )}

          {feedback && (
            <button
              onClick={handleNext}
              className="mt-5 w-full px-5 py-3 rounded-lg font-semibold text-lg bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Next
            </button>
          )}
          <span id="rewardId" />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="text-center bg-white shadow-lg p-6 rounded-xl max-w-lg mx-auto border border-orange-300"
        >
          <h2 className="text-2xl font-bold text-orange-900">
            🎉 Preassessment Complete!
          </h2>

          {/* Mastery Progress Bar */}
          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-800">
              Mastery Level
            </p>
            <div className="relative w-full max-w-md mx-auto bg-gray-200 rounded-full h-6 shadow-inner overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-orange-600 text-white text-sm font-bold flex items-center justify-center transition-all rounded-full"
                style={{ width: "0%" }}
              >
                {Math.round((mastery || 0) * 100)}%
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-4">
            {!mastery || mastery === 0 ? (
              <button
                onClick={handleSendResponse}
                className="w-full max-w-sm px-5 py-3 rounded-lg font-semibold text-lg bg-orange-600 text-white hover:bg-orange-700 transition transform"
              >
                Send Responses
              </button>
            ) : (
              <Link href="/topics">
                <button className="w-full max-w-sm px-5 py-3 rounded-lg font-semibold text-lg bg-orange-600 text-white hover:bg-orange-700 transition transform">
                  Go to Topics
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreAssessment;
