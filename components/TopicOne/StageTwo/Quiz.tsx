import React, {useState, useEffect, useRef} from "react";
import gsap from "gsap";
import {updateLearningStatus} from "@/actions/stages";
import {useSearchParams} from "next/navigation";
import Link from "next/link";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type Feedback = "correct" | "incorrect" | null;

export default function TopicOneStageTwoQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [score, setScore] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const checkmarkRef = useRef<HTMLSpanElement | null>(null);
  const redXRef = useRef<HTMLSpanElement | null>(null);
  const searchParams = useSearchParams();

  const stageId = searchParams.get("ks"); //TODO Use Id instead of ks
  const questions: Question[] = [
    {
      question: "Evaluate: If x = 3, what is 2x + 1?",
      options: ["5", "7", "8", "9"],
      correctAnswer: "7",
    },
    {
      question: "If y = 4, what is y - 2?",
      options: ["1", "2", "6", "8"],
      correctAnswer: "2",
    },
    {
      question: "Evaluate: If a = 2 and b = 3, what is a + 2b?",
      options: ["5", "6", "8", "10"],
      correctAnswer: "8",
    },
    {
      question: "If m = 5, what is 3m - 5?",
      options: ["10", "15", "20", "25"],
      correctAnswer: "10",
    },
    {
      question: "Evaluate: If p = 1 and q = 6, what is 4p + q?",
      options: ["7", "8", "9", "10"],
      correctAnswer: "10",
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      ".quiz-question",
      {opacity: 0, y: 50},
      {opacity: 1, y: 0, duration: 1, ease: "power2.out"}
    );
  }, [currentQuestion]);

  useEffect(() => {
    console.log("Quiz complete:", quizComplete); // Debugging output
    if (!quizComplete) return;

    const updateKs = async () => {
      console.log("Updating learning status...");
      await updateLearningStatus(stageId as string, true, score);
    };

    updateKs();
  }, [quizComplete]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore((prevScore) => prevScore + 20);
      gsap.fromTo(
        checkmarkRef.current,
        {opacity: 0, scale: 0},
        {opacity: 1, scale: 1, duration: 0.5}
      );
      setFeedback("correct");
    } else {
      gsap.fromTo(
        redXRef.current,
        {opacity: 0, scale: 0},
        {opacity: 1, scale: 1, duration: 0.5}
      );
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizComplete(true);
      }
    }, 500);
  };

  return (
   <div className="flex flex-col items-center justify-center p-6 my-6 w-full max-w-2xl bg-white rounded-lg shadow-md min-h-[80vh] border border-gray-200">
  {!quizComplete && (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-orange-600 mb-4 text-center">
      Quiz
      </h2>
      <p className="text-gray-800 text-center mb-6 text-lg">
        {questions[currentQuestion].question}
      </p>

      <div className="grid grid-cols-1 gap-4 mb-4">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`p-3 rounded-md border text-center w-full transition ${
              selectedAnswer === option
                ? "bg-orange-600 text-white shadow-md"
                : "border-gray-300 hover:bg-gray-100"
            } ${feedback ? "cursor-not-allowed opacity-70" : ""}`}
            onClick={() => handleAnswer(option)}
            disabled={!!feedback}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          className={`mt-4 px-5 py-2 bg-orange-600 text-white rounded-lg shadow-md transition ${
            !selectedAnswer || feedback
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-orange-700"
          }`}
          onClick={handleNextQuestion}
          disabled={!selectedAnswer || !!feedback}
        >
          Next
        </button>
      </div>
    </div>
  )}

  {feedback && (
    <div className="feedback mt-6 text-center">
      {feedback === "correct" ? (
        <span
          ref={checkmarkRef}
          className="text-green-600 text-4xl"
        >
          ✅ Correct!
        </span>
      ) : (
        <span
          ref={redXRef}
          className="text-red-500 text-4xl"
        >
          ❌ Not quite.
        </span>
      )}
    </div>
  )}

  {quizComplete && (
    <div className="mt-8 text-center">
      <h3 className="text-xl font-bold text-green-700">🎉 Quiz Complete!</h3>
      <p className="mt-2 text-gray-800">Your score: {score}</p>

      <Link href="/topics">
        <button className="mt-4 px-5 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition">
          Go to Topics
        </button>
      </Link>
    </div>
  )}
</div>

  );
}
