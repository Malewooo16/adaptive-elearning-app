import {getSamplePreassessments} from "@/actions/preassessments";
import "katex/dist/katex.min.css";
import PreAssessment from "@/components/TestQuestions";
import {auth} from "@/auth/authOptions";
import {getUser} from "@/actions/user";

export default async function page() {
  const session = await auth();

  if (!session?.user) return null;

  const user = await getUser(session.user.id as string);

  const questions = await getSamplePreassessments(session.user.id as string);
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
