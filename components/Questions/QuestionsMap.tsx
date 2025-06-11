"use client";

import React, {useState, useEffect, useCallback} from "react";
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
  questions: IQuestion[]; // Assuming IQuestion does NOT have an 'id' property
}

interface Response {
  originalQuestionIndex: number; // Renamed for clarity, stores the index from the 'questions' array
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

  // New states for handling wrong questions
  // Stores the ORIGINAL INDICES of questions that were answered incorrectly
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([]);
  const [reviewingWrongQuestions, setReviewingWrongQuestions] = useState(false);
  const [currentWrongQuestionIndex, setCurrentWrongQuestionIndex] = useState(0); // Index within the wrongQuestions array

  const renderMath = useRenderMath();
  const {reward, isAnimating} = useReward("rewardId", "confetti");

  // Load state from local storage
  useEffect(() => {
    const savedState = localStorage.getItem(`quiz-state-${stageId}`);
    if (savedState) {
      const {
        currentQuestion: savedCurrentQuestion,
        responses: savedResponses,
        wrongQuestions: savedWrongQuestions,
        reviewingWrongQuestions: savedReviewingWrongQuestions,
        currentWrongQuestionIndex: savedCurrentWrongQuestionIndex,
      } = JSON.parse(savedState);

      setCurrentQuestion(savedCurrentQuestion);
      setResponses(savedResponses);
      setWrongQuestions(savedWrongQuestions || []);
      setReviewingWrongQuestions(savedReviewingWrongQuestions || false);
      setCurrentWrongQuestionIndex(savedCurrentWrongQuestionIndex || 0);
      setMastery(0); // Mastery is recalculated at the end
    }
    setInitialized(true);
  }, [stageId]);

  // Save state to local storage
  useEffect(() => {
    if (!initialized) return;
    const stateToSave = {
      currentQuestion,
      responses,
      wrongQuestions,
      reviewingWrongQuestions,
      currentWrongQuestionIndex,
    };
    localStorage.setItem(`quiz-state-${stageId}`, JSON.stringify(stateToSave));
  }, [
    currentQuestion,
    responses,
    stageId,
    initialized,
    wrongQuestions,
    reviewingWrongQuestions,
    currentWrongQuestionIndex,
  ]);

  // Reset start time when question changes
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion, currentWrongQuestionIndex, reviewingWrongQuestions]);

  // GSAP animation for mastery progress
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

  //console.log(skillsResponse)

  // Determine the question object currently being displayed
  const currentActiveQuestion: IQuestion | undefined = reviewingWrongQuestions
    ? questions[wrongQuestions[currentWrongQuestionIndex]] // Get question by its original index
    : questions[currentQuestion];

  // Determine the original index of the question currently being displayed
  const currentActiveQuestionOriginalIndex: number = reviewingWrongQuestions
    ? wrongQuestions[currentWrongQuestionIndex]
    : currentQuestion;

  const processMasteryAndFinish = useCallback(async () => {
    try {
      const response = await processUserMastery(responses, stageId);
      if (!response) return;
      setMastery(response.stageMastery);
      setSkillsResponse(response.skillsResults);
      console.log(skillsResponse);
      // Automatically delete the AI question and clear local storage upon completion
      await deleteAiQuestion(aiQuestionId);
      localStorage.removeItem(`quiz-state-${stageId}`);
    } catch (error) {
      console.error("Error processing mastery:", error);
    }
  }, [responses, stageId, aiQuestionId]);

  const handleSubmit = () => {
    if (!selectedOption || !currentActiveQuestion) return;

    const correctAnswer = currentActiveQuestion.answer.replace(/\$/g, "");
    const isCorrect = selectedOption.replace(/\$/g, "") === correctAnswer;

    const timeSpent = (Date.now() - startTime) / 1000;

    const newResponse: Response = {
      originalQuestionIndex: currentActiveQuestionOriginalIndex, // Use the original index for the response
      selectedOption,
      correct: isCorrect,
      skill: currentActiveQuestion.metadata.skills,
      difficulty: currentActiveQuestion.metadata.difficulty,
      timeSpent,
      assessmentId: aiQuestionId,
    };

    setResponses((prev) => [...prev, newResponse]);

    if (isCorrect) {
      setFeedback("Correct!");
      reward();
      // If correct and in review mode, remove from wrongQuestions
      if (reviewingWrongQuestions) {
        const updatedWrongQuestions = wrongQuestions.filter(
          (index) => index !== currentActiveQuestionOriginalIndex
        );
        setWrongQuestions(updatedWrongQuestions);

        if (updatedWrongQuestions.length === 0) {
          // If no more wrong questions, proceed to mastery
          setReviewingWrongQuestions(false);
          processMasteryAndFinish();
        } else {
          // If there are still wrong questions, move to the next one in the review list
          // This logic ensures we cycle through remaining wrong questions
          setCurrentWrongQuestionIndex((prev) =>
            prev >= updatedWrongQuestions.length - 1 ? 0 : prev + 1
          );
        }
      }
      // Note: For initial questions, `handleNext` will manage progression
    } else {
      setFeedback("Incorrect!");
      setCorrectAnswerVisible(true);
      // Add the original index of the incorrect question to wrongQuestions if not already there
      if (!wrongQuestions.includes(currentActiveQuestionOriginalIndex)) {
        setWrongQuestions((prev) => [
          ...prev,
          currentActiveQuestionOriginalIndex,
        ]);
      }
      // User stays on the current question if incorrect unless they click "Next" (main quiz) or "Try Again" (review quiz)
    }
    // Note: selectedOption is NOT cleared here for incorrect answers,
    // allowing the user to easily change their selection and re-submit.
  };

  const handleNext = () => {
    setSelectedOption(null); // Clear selected option
    setFeedback(null); // Clear feedback
    setCorrectAnswerVisible(false); // Hide correct answer explanation

    // Logic for advancing to the next question or phase
    if (reviewingWrongQuestions) {
      // If we are reviewing wrong questions, 'Next' button implies 'Try Again' for incorrect or 'Continue' for correct.
      // However, if we reach this `handleNext` during reviewingWrongQuestions, it means the user got it right,
      // and `handleSubmit` already filtered `wrongQuestions` and updated `currentWrongQuestionIndex`.
      // The `isQuizCompleted` check will catch the final state.
    } else {
      // If not reviewing wrong questions (i.e., in the main quiz flow)
      setCurrentQuestion((prev) => prev + 1); // Always move to the next question in the initial set
      if (
        currentQuestion + 1 >= questions.length &&
        wrongQuestions.length > 0
      ) {
        // If all initial questions are answered and there are wrong questions,
        // transition to review mode for wrong questions.
        setReviewingWrongQuestions(true);
        setCurrentWrongQuestionIndex(0);
      } else if (
        currentQuestion + 1 >= questions.length &&
        wrongQuestions.length === 0
      ) {
        // If all initial questions are answered and NO wrong questions, process mastery directly
        processMasteryAndFinish();
      }
    }
  };

  const handleReset = async () => {
    try {
      await deleteAiQuestion(aiQuestionId);
      localStorage.removeItem(`quiz-state-${stageId}`);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setFeedback(null);
      setStartTime(Date.now());
      setResponses([]);
      setCorrectAnswerVisible(false);
      setMastery(0);
      setSkillsResponse({});
      setWrongQuestions([]);
      setReviewingWrongQuestions(false);
      setCurrentWrongQuestionIndex(0);
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

  // Determine if the quiz is completed (all initial questions processed and no wrong questions left)
  const isQuizCompleted =
    currentQuestion >= questions.length && wrongQuestions.length === 0;

  // Render "Loading question..." if currentActiveQuestion is undefined (e.g., questions array is empty or index is out of bounds)
  if (!currentActiveQuestion && !isQuizCompleted) {
    return (
      <div className="flex justify-center items-center h-screen text-orange-600">
        Loading question...
      </div>
    );
  }

  return (
    <div
      className={`flex items-center min-h-screen px-4 py-6 bg-[#fffefb] transition-all ${
        sidebar ? "justify-start" : "justify-center"
      }`}
    >
      {!isQuizCompleted ? (
        <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between mb-4 text-sm text-gray-600">
            <span>
              {reviewingWrongQuestions
                ? `Reviewing Wrong: ${currentWrongQuestionIndex + 1} of ${
                    wrongQuestions.length
                  }`
                : `Question ${currentQuestion + 1} of ${questions.length}`}
            </span>
            <button
              onClick={handleReset}
              className="text-orange-600 hover:underline"
            >
              Reset Quiz
            </button>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {renderMath(currentActiveQuestion.question)}
          </h2>

          <div className="flex flex-col gap-3">
            {currentActiveQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(option)}
                disabled={isAnimating} // Only disable if animation is running
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

          {/* Submit Button: Always present if quiz not completed and not animating confetti, and sidebar is not open */}
          {!sidebar && (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="mt-5 w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
            >
              Submit
            </button>
          )}

          {/* Feedback Display: Shows if feedback is available */}
          {feedback && (
            <div className="mt-4 text-lg font-semibold">
              <p
                className={`${
                  feedback === "Correct!" ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback}
              </p>
              {feedback === "Incorrect!" &&
                correctAnswerVisible && ( // Correct answer explanation visible only for incorrect attempts
                  <div className="mt-2">
                    <p className="text-red-600 text-sm">
                      Correct answer:{" "}
                      {renderQuestion(currentActiveQuestion.answer)}
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

          {/* "Next" Button: This button appears after any submission, handling different flows */}
          {feedback && ( // Only show if feedback is present
            <button
              onClick={handleNext}
              className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow"
            >
              {/* Conditional text based on quiz state */}
              {reviewingWrongQuestions && feedback === "Incorrect!"
                ? "Try Again" // When reviewing wrong answers and got it wrong, prompt to try again
                : "Next"}
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
              className="mastery-progress h-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold flex items-center justify-center transition-all duration-700 ease-out"
              style={{
                width: `${(mastery * 100).toFixed(0)}%`,
                minWidth:
                  mastery > 0 && mastery * 100 < 10 ? "2rem" : undefined,
              }}
            >
              {(mastery * 100).toFixed(0)}%
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Skill Breakdown:
            </h3>
            {Object.entries(skillsResponse).length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(skillsResponse).map(([skill, value]) => {
                  const skillValue = value as {
                    skillId: string;
                    skillName: string;
                    ratio: number;
                  };
                  return (
                    <li
                      key={skillValue.skillId}
                      className="skill-ratio bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <span className="text-gray-700 font-medium">
                        {skill}:
                      </span>
                      <span
                        className={`font-bold ${
                          skillValue.ratio >= 0.8
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {(skillValue.ratio * 100).toFixed(0)}% Correct
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600">No skill data available.</p>
            )}
          </div>
          <Link href={`/topics`}>
            {" "}
            <button className="mt-4 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-xl shadow transition-transform transform hover:scale-105">
              Back To Topics
            </button>{" "}
          </Link>
        </div>
      )}

      {sidebar && currentActiveQuestion && (
        <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white border-l shadow-lg z-50">
          <MistakeExplainerMain
            sidebar={sidebar}
            handleSidebar={handleSidebar}
            currentQuestion={currentActiveQuestion}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionsMap;
