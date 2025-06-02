import { getUserSessionInclusive } from "@/actions/user";
import UpdateParameters from "@/components/BKTParameters/UpdateParameters";
import prisma from "@/db/prisma";
import { redirect } from "next/navigation";
import React from "react";

export default async function UpdateBKTParameters() {
    const user = await getUserSessionInclusive();
    if(user && user.role !== "admin") {
        redirect('/topics');
    }
  const topics = await prisma.topic.findMany({
    include: {
      stages: {
        include: {
          BKTParameters: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">
        Update BKT Parameters
      </h1>
      {topics &&
        topics.length > 0 &&
        topics.map((t) => (
          <div
            key={t.id}
            className="flex flex-col my-4  border border-orange-400 rounded-md bg-white p-4  w-full"
          >
            <h1 className="text-lg text-orange-600"> {t.name}</h1>
            <div>
              {t.stages &&
                t.stages.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col my-2 border border-orange-300 rounded-md bg-gray-50 p-4"
                  >
                    <h1 className="text text-orange-600"> {s.title}</h1>
                    <UpdateParameters
                      BKTParameters={s.BKTParameters[0]} />
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
