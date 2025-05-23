import React from "react";

interface RoadmapProps {
  stages: { id: string; title: string; mastery: number | null }[];
}

export default function Roadmap({ stages }: RoadmapProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto p-4">
      {stages.map((stage, index) => {
        const mastery = stage.mastery ?? 0;
        const color =
          mastery === 100
            ? "bg-green-500 border-green-600"
            : mastery > 50
            ? "bg-yellow-400 border-yellow-500"
            : "bg-red-400 border-red-500";

        return (
          <div key={stage.id} className="flex items-center">
            {/* Connecting Line (Hidden on First Item) */}
            {index > 0 && (
              <div className="w-8 h-1 bg-gray-300 relative">
                {/* Progress Fill */}
                <div
                  className={`absolute top-0 left-0 h-full ${
                    mastery === 100
                      ? "bg-green-500"
                      : mastery > 50
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: "100%" }} // Make it dynamic if needed
                />
              </div>
            )}

            {/* Stage Node */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full border-4 text-white font-bold transition-all duration-300 ${color}`}
            >
              {index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
