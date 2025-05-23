//@ts-nocheck
import { auth } from "@/auth/authOptions";
import { fetchAiQuestions, generateAiQuestions } from "@/actions/questions";
import QuestionsMap from "@/components/Questions/QuestionsMap";
import TopicOneStageOne from "@/components/TopicOne/StageOne/Explainer";


export interface IQuestion {
  question: string;
  options: string[];
  answer: string;
  metadata: {
    skills: string[];
    difficulty: string;
  };
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;
  const session = await auth();

  if (!session?.user) throw new Error("Not authenticated");

  // Simulating quiz completion
  const quizCompleted = true;
  if (!quizCompleted) {
    return <TopicOneStageOne />;
  }

  // Attempt to fetch AI-generated questions
  const questionsArray = await fetchAiQuestions(id as string, session.user.id as string);
 // console.log(questionsArray?.questions.map(q=>q.options));

  // If no questions exist, generate new ones
  if (questionsArray === null) {
    const prompt = `Generate 10 multiple-choice questions for Stage 1: Introduction to Expressions. The questions should cover variables, coefficients, and constants. Each question should include four answer options, specify the correct answer, and include a metadata object.

    Each question should have a **metadata** field containing:
    - **skills**: An array listing the specific skills tested (Skills for this stage ["Identifying Variables, Coefficients and Constants"]).
    - **difficulty**: One of the following difficulty levels:
      - "1: Easy"
      - "2: Medium"
      - "3: Hard"
    Ensure that the questions have different difficulty levels Some should be hard some medium some easy.
    
    Use LaTeX delimiters (\`$...$\`) for mathematical expressions. Respond in an array format.
    
    ### Example Response:
    [
      {
        "question": "What is the coefficient of $5x + 3$?",
        "options": ["5", "3", "x", "8"],
        "answer": "5",
        "metadata": {
          "skills": ["Identifying Variables, Coefficients and Constants"],
          "difficulty": "1"
        }
      },
      {
        "question": "Which part of the expression $7y - 4$ is the constant?",
        "options": ["7", "y", "-4", "None"],
        "answer": "-4",
        "metadata": {
          "skills": ["Identifying Variables, Coefficients and Constants"],
          "difficulty": "2"
        }
      },
    
    ]`
    

    const generatedQuestions = await generateAiQuestions(
      prompt,
      session.user.id as string,
      id as string
    );

    console.log(generatedQuestions)

    return (<div>
      <QuestionsMap questions={generatedQuestions?.questions} stageId={id as string} aiQuestionId={generatedQuestions?.id} />
    </div>);
  }

  return (<div>
    <QuestionsMap questions={questionsArray.questions} stageId={id as string} />
  </div>);
}
