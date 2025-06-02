"use client";
import { updateBKTParameters } from "@/actions/bkt/parameters";
import React, { useState } from "react";

interface BKTParameters {
  id: string;
  topicId: string;
  stageId: string;
  prior: number;
  learnRate: number;
  guessRate: number;
  slipRate: number;
  forgetRate: number;
}

export default function UpdateParameters({
  BKTParameters,
}: {
  BKTParameters: BKTParameters;
}) {
  const [params, setParams] = useState({
    prior: BKTParameters.prior,
    learnRate: BKTParameters.learnRate,
    guessRate: BKTParameters.guessRate,
    slipRate: BKTParameters.slipRate,
    forgetRate: BKTParameters.forgetRate,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (key: keyof typeof params, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setStatus("loading");
    setMessage("");

    try {
      // Replace with your actual API call
      const response = await updateBKTParameters(BKTParameters.id, params)

      if (!response.success) {
        throw new Error("Failed to update parameters");
      }

      setStatus("success");
      setMessage("Parameters updated successfully.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred.");
    }
  };

  return (
    <div>
      {Object.entries(params).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-4 py-2"
        >
          <label className="text-gray-700 font-medium w-1/2">{key}</label>
          <input
            type="number"
            step="0.01"
            className="border border-gray-300 rounded px-2 py-1 w-1/2"
            value={value}
            onChange={(e) => handleChange(key as keyof typeof params, parseFloat(e.target.value))}
          />
        </div>
      ))}

      <div className="mt-4 flex justify-end">
        <button
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition disabled:opacity-50"
          onClick={handleSubmit}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Updating..." : "Update Parameters"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-2 text-sm ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
