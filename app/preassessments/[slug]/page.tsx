import { getPreasssessments } from "@/actions/preassessments";
import { getUser } from "@/actions/user";
import { auth } from "@/auth/authOptions";
import PreAssessment from "@/components/TestQuestions";


export default async function page({params}:{
    params: Promise<{slug: string}>;
  }) {
  const session = await auth();

  if (!session?.user) return null;

  const {slug} = await params
  

  const questions = await getPreasssessments(slug);
  //console.log(questions)
  if (questions !== null) {
    return (
      <PreAssessment
        questions={questions.Question}
        topicId={questions.topicId}
        stageNumber={questions.number}
      />
    );
  }
}
