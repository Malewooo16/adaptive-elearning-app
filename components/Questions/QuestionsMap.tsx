"use client";

import React, {useState, useEffect} from "react";
import "katex/dist/katex.min.css";
import {InlineMath} from "react-katex";
import {useReward} from "react-rewards";
import useRenderMath from "@/lib/utils/renderMath";
import {useRouter} from "next/navigation";
import MistakeExplainerMain from "../MistakeExplainer/MistakeExplainerMain";
import {IQuestion} from "@/app/topicOne/stageOne/page";
import {processUserMastery} from "@/actions/mastery";
import {deleteAiQuestion} from "@/actions/questions";
import Link from "next/link";

interface PreAssessmentComponentProps {
  aiQuestionId: string;
  stageId: string;
  questions: IQuestion[];
}

interface Response {
  questionId: number;
  selectedOption: string | null;
  correct: boolean;
  skill: string[];
  difficulty: string;
  timeSpent: number;
  assessmentId: string;
}

const QuestionsMap: React.FC<PreAssessmentComponentProps> = ({
  aiQuestionId,
  stageId,
  questions,
}) => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [correctAnswerVisible, setCorrectAnswerVisible] = useState(false);
  const [mastery, setMastery] = useState<number>(0);
  const [skillsResponse, setSkillsResponse] = useState<any>({});
  const [initialized, setInitialized] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const renderMath = useRenderMath();
  const {reward, isAnimating} = useReward("rewardId", "confetti");

  useEffect(() => {
    const savedState = localStorage.getItem(`quiz-state-${stageId}`);
    if (savedState) {
      const {currentQuestion, responses} = JSON.parse(savedState);
      setCurrentQuestion(currentQuestion);
      setResponses(responses);
      setMastery(0);
    }
    setInitialized(true);
  }, [stageId]);

  useEffect(() => {
    if (!initialized) return;
    const stateToSave = {currentQuestion, responses};
    localStorage.setItem(`quiz-state-${stageId}`, JSON.stringify(stateToSave));
  }, [currentQuestion, responses, stageId, initialized]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  useEffect(() => {
    if (typeof window !== "undefined" && mastery > 0) {
      import("gsap").then((gsap) => {
        gsap.gsap.fromTo(
          ".mastery-progress",
          {width: "0%"},
          {width: `${mastery * 100}%`, duration: 1.5, ease: "power2.out"}
        );
        gsap.gsap.fromTo(
          ".skill-ratio",
          {scale: 0.8, opacity: 0},
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
            delay: 0.3,
            stagger: 0.1,
          }
        );
      });
    }
  }, [mastery]);

  const handleSubmit = () => {
    if (!selectedOption) return;
    const correctAnswer = questions[currentQuestion].answer.replace(/\$/g, "");
    const isCorrect = selectedOption.replace(/\$/g, "") === correctAnswer;

    const timeSpent = (Date.now() - startTime) / 1000;
    const newResponse: Response = {
      questionId: currentQuestion,
      selectedOption,
      correct: isCorrect,
      skill: questions[currentQuestion].metadata.skills,
      difficulty: questions[currentQuestion].metadata.difficulty,
      timeSpent,
      assessmentId: aiQuestionId,
    };

    setResponses((prev) => [...prev, newResponse]);
    if (isCorrect) {
      setFeedback("Correct!");
      reward();
    } else {
      setFeedback("Incorrect!");
      setCorrectAnswerVisible(true);
    }
    setStartTime(Date.now());
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setCorrectAnswerVisible(false);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSendResponse = async () => {
    try {
      const response = await processUserMastery(responses, stageId);
      if (!response) return;
      setMastery(response.stageMastery);
      setSkillsResponse(response.updatedCorrectResponseRatios);
    } catch (error) {
      console.error("Error sending responses:", error);
    } finally {
      handleReset();
    }
  };
  console.log("skillsResponse", skillsResponse);
  Object.entries(skillsResponse).map(([skill, ratio]) =>
    console.log("Skill", skill, "Ratio", ratio)
  );
  const handleReset = async () => {
    try {
      deleteAiQuestion(aiQuestionId);
      localStorage.removeItem(`quiz-state-${stageId}`);
    } catch (error) {
      console.error("Error resetting quiz:", error);
    }
  };

  const handleSidebar = (t: boolean) => {
    setSidebar(t);
  };

  const renderOption = (option: string) => (
    <InlineMath>{option.replace(/\$/g, "")}</InlineMath>
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

  if (!initialized) {
    return (
      <div className="flex justify-center items-center h-screen text-orange-600">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`flex items-center min-h-screen px-4 py-6 bg-[#fffefb] transition-all ${
        sidebar ? "justify-start" : "justify-center"
      }`}
    >
      {currentQuestion < questions.length ? (
        <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between mb-4 text-sm text-gray-600">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <button
              onClick={handleReset}
              className="text-orange-600 hover:underline"
            >
              Reset Quiz
            </button>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {renderMath(questions[currentQuestion].question)}
          </h2>

          <div className="flex flex-col gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(option)}
                disabled={isAnimating || feedback !== null}
                className={`px-4 py-2 rounded-lg shadow text-white transition-all duration-200 ${
                  selectedOption === option
                    ? "bg-orange-700"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {renderOption(option)}
              </button>
            ))}
          </div>

          {!feedback && (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="mt-5 w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
            >
              Submit
            </button>
          )}

          {feedback && (
            <div className="mt-4 text-lg font-semibold">
              <p
                className={`${
                  feedback === "Correct!" ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback}
              </p>
              {correctAnswerVisible && (
                <div className="mt-2">
                  <p className="text-red-600 text-sm">
                    Correct answer:{" "}
                    {renderQuestion(questions[currentQuestion].answer)}
                  </p>
                  <button
                    onClick={() => setSidebar(true)}
                    className="mt-3 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                  >
                    Explain My Mistake
                  </button>
                </div>
              )}
            </div>
          )}

          {feedback && (
            <button
              onClick={handleNext}
              className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow"
            >
              Next
            </button>
          )}
          <span id="rewardId" />
        </div>
      ) : (
        <div className="text-center max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
          <h2 className="text-3xl font-extrabold text-orange-700">
            🎉 Task Completed!
          </h2>
          <p className="text-lg font-medium text-gray-800">Mastery Level</p>
          <div className="relative w-full h-6 bg-orange-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold flex items-center justify-center transition-all duration-700 ease-out"
              style={{width: `${(mastery * 100).toFixed(0)}%`}}
            >
              {(mastery * 100).toFixed(0)}%
            </div>
          </div>
          {!mastery ? <button
            onClick={handleSendResponse}
            className="mt-4 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-xl shadow transition-transform transform hover:scale-105"
          >
            View Results
          </button> : <Link href={`/topics`}> <button
            className="mt-4 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-xl shadow transition-transform transform hover:scale-105"
          >
           Back To Topics
          </button> </Link>}
        </div>
      )}

      {sidebar && (
        <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white border-l shadow-lg z-50">
          <MistakeExplainerMain
            sidebar={sidebar}
            handleSidebar={handleSidebar}
            currentQuestion={questions[currentQuestion]}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionsMap;
