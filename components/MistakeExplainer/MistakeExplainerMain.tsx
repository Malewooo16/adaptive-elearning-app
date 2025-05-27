"use client";
import React, { useState, useEffect } from "react";
import useRenderMath from "@/lib/utils/renderMath";
import { IQuestion } from "@/app/questions/[slug]/page";

interface IMistakeExplainerMainProps {
  sidebar: boolean;
  handleSidebar: (t: boolean) => void;
  currentQuestion: IQuestion;
}

const MistakeExplainerMain: React.FC<IMistakeExplainerMainProps> = ({
  sidebar,
  handleSidebar,
  currentQuestion,
}) => {
  const [explanationData, setExplanationData] = useState<any | null>(null);
  const renderMath = useRenderMath();

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const response = await fetch("/api/ai/explainMistake", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentQuestion }),
        });
        const data = await response.json();
        if (data && data.explanation) {
          setExplanationData(data.explanation);
        } else {
          console.error("Failed to fetch explanation:", data.error);
        }
      } catch (error) {
        console.error("Error fetching explanation:", error);
      }
    };

    if (sidebar) {
      fetchExplanation();
    } else {
      setExplanationData(null);
    }
  }, [sidebar, currentQuestion]);

  const explanationObj = JSON.parse(explanationData)

  return (
    <div
    className={`fixed right-0 top-0 h-full w-1/2 bg-white shadow-xl border-l border-orange-900 p-6 flex flex-col justify-between overflow-scroll transform transition-transform duration-500 ${
      sidebar ? "translate-x-0" : "translate-x-full"
    }`}
  >
    <div className="text-center">
      <h3 className="text-2xl font-bold text-blue-900 mb-4">Here’s How You Do It</h3>
  
      {explanationData ? (
        Array.isArray(explanationObj.explanation) ? (
          <div className="overflow-x-auto">
            {/* Table Container */}
            <table className="w-full border-collapse border border-blue-900 shadow-md rounded-lg">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="py-3 px-4 border border-blue-800">Step</th>
                  <th className="py-3 px-4 border border-blue-800">Explanation</th>
                  <th className="py-3 px-4 border border-blue-800">Calculation</th>
                </tr>
              </thead>
              <tbody>
                {explanationObj.explanation.map((step:any, index:any) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                    } text-gray-800`}
                  >
                    <td className="py-3 px-4 font-semibold border border-blue-300 text-orange-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border border-blue-300">{step.step || "N/A"}</td>
                    <td className="py-3 px-4 border border-blue-300">{renderMath(step.calculation)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
  
            {/* Final Answer (if available) */}
            {explanationObj.finalAnswer && (
              <p className="mt-4 font-semibold text-lg bg-orange-100 border-l-4 border-orange-500 text-orange-900 p-3 rounded-md shadow-sm">
                Final Answer: {renderMath(explanationObj.finalAnswer)}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-800 text-lg bg-orange-50 p-3 rounded-md shadow-sm border-l-4 border-orange-500">
             {renderMath(explanationObj.explanation)}
          </p>
        )
      ) : (
        <p className="text-gray-500 italic">Loading explanation...</p>
      )}
    </div>
  
    {/* Close Button */}
    <button
      className="bg-orange-500 text-white text-lg py-3 px-5 rounded-lg font-bold shadow-md transition hover:bg-orange-600"
      onClick={() => handleSidebar(false)}
    >
      I Got It
    </button>
  </div>
  
  
  );
};

export default MistakeExplainerMain;