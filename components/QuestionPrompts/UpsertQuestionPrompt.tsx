"use client";
import { upsertQuestionPrompt } from "@/actions/questionPrompts";
import React, { useState } from "react";

interface QuestionPrompt {
  id: string;
  createdAt: Date;
  stageId: string;
  prompt: string;
}



export default function UpdateQuestionPrompt({
  questionPrompt,
  stageId
}: {
  questionPrompt?: QuestionPrompt;
  stageId: string;
}) {
  const isNew = !questionPrompt?.prompt;
  const [promptText, setPromptText] = useState(questionPrompt?.prompt || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await upsertQuestionPrompt({
        id: questionPrompt?.id,
        stageId: isNew ? stageId : "",
        prompt: promptText,
      });

      if (!response.success) {
       setStatus("error");
      }
      setStatus("success");
      setMessage(isNew ? "Prompt created successfully." : "Prompt updated successfully.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          {isNew ? "Add a Prompt" : "Update Prompt"}
        </label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter the question prompt..."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
      </div>

      {message && (
        <p
          className={`text-sm ${
            status === "success"
              ? "text-green-600"
              : status === "error"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || !promptText.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {isNew ? "Add Prompt" : "Update Prompt"}
        </button>
      </div>
    </div>
  );
}
