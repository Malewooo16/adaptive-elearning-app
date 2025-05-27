//@ts-nocheck
import { auth } from "@/auth/authOptions";
import { fetchAiQuestions, generateAiQuestions } from "@/actions/questions";
import QuestionsMap from "@/components/Questions/QuestionsMap";
import TopicOneStageOne from "@/components/TopicOne/StageOne/Explainer";
import { getStageQuestionGenPrompt } from "@/actions/stages";
import { getTopics } from "@/actions/topics";


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
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) throw new Error("Not authenticated");

  // Simulating quiz completion
  const quizCompleted = true;
  if (!quizCompleted) {
    return <TopicOneStageOne />;
  }

  // Attempt to fetch AI-generated questions
  const questionsArray = await fetchAiQuestions(slug as string, session.user.id as string);

  // If no questions exist, generate new ones
  if (questionsArray === null) {
   const prompt = await getStageQuestionGenPrompt(slug as string);
   const enhancedPrompt = prompt + ""
   
  
// console.log(prompt);
    const generatedQuestions = await generateAiQuestions(
      prompt as string, 
      session.user.id as string,
      slug as string
    );

  console.log(generatedQuestions?.id)

    return (<div>
      <QuestionsMap questions={generatedQuestions?.questions} stageId={slug as string} aiQuestionId={generatedQuestions?.id} />
    </div>);
  }

  return (<div>
    <QuestionsMap questions={questionsArray.questions} stageId={slug as string} aiQuestionId={questionsArray.id} />
  </div>);
}
