import TopicOneStageFour from "@/components/TopicOne/StageFour/Explainer";
import TopicOneStageOne from "@/components/TopicOne/StageOne/Explainer";
import TopicOneStageThree from "@/components/TopicOne/StageThree/Explainer";
import TopicOneStageTwo from "@/components/TopicOne/StageTwo/Explainer";


// Mapping topics to lesson components
export const topicComponents: Record<string, React.ComponentType> = {
  "introduction-to-variables": TopicOneStageOne,
  "substitution-and-evaluating-expressions": TopicOneStageTwo,
  "combining-like-terms": TopicOneStageThree,
  "distributive-property-and-simplification":TopicOneStageFour
  // Add other topics and corresponding lesson components here
};
