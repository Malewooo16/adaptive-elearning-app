import {auth} from "@/auth/authOptions";
import {redirect} from "next/navigation";

// Importing lesson components for each topic
import {topicComponents} from "./topicComponents";
// Add imports for other lessons here as needed

// Function to slugify text (already given)
function slugify(text: string) {
  return text.toLowerCase().replace(/,/g, "").replace(/\s+/g, "-");
}

// Array of topics
const topics = [
  "Introduction to Variables",
  "Substitution and Evaluating Expressions",
  "Combining Like Terms",
  "Distributive Property and Simplification",
  "Introduction to Polynomials",
  "Polynomial Operations",
  "Factoring Polynomials",
  "Applications of Polynomials",
  "One-step Equations",
  "Two-step Equations",
  "Multi-step Equations",
  "Word Problems Involving Linear Equations",
  "Solving Systems of Equations: Substitution Method",
  "Solving Systems of Equations: Elimination Method",
  "Graphical Method for Solving Systems of Equations",
  "Real-World Applications of Systems of Equations",
  "Introduction to Quadratic Equations",
  "Solving Quadratic Equations",
  "Nature of Roots",
  "Applications of Quadratic Equations",
];

export default async function StatesPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  console.log("Slug", slug);

  // Slugify the topic and check if it exists in the predefined list
  const topicSlug = slugify(slug);
  const topicIndex = topics.findIndex((topic) => slugify(topic) === topicSlug);

  if (topicIndex === -1) {
    // If the topic doesn't match, redirect to the topics page
    redirect(`/topics`);
  }

  // Find the corresponding component for the topic
  const LessonComponent = topicComponents[topicSlug];

  if (!LessonComponent) {
    // If no matching component exists, render a fallback or error message
    return <p>Lesson for this topic is not available.</p>;
  }

  // Render the dynamic lesson content based on the topic and stage
  return <LessonComponent />;
}
