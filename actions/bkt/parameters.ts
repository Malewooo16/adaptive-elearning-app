"use server"

import prisma from "@/db/prisma";
import { re } from "mathjs";

interface BKTParameters {
  prior: number;
  learnRate: number;
  guessRate: number;
  slipRate: number;
  forgetRate: number;
}

export const updateBKTParameters = async (id:string, data:BKTParameters)=>{
 try{
    await prisma.bKTParameters.update({
      where: { id},
      data: {
        prior: data.prior,
        learnRate: data.learnRate,
        guessRate: data.guessRate,
        slipRate: data.slipRate,
        forgetRate: data.forgetRate,
      },
    });
    return {
      success: true,
      message: "BKT parameters updated successfully",
    };
 } catch (error) {
    console.error("Error updating BKT parameters:", error);
    return {
      success: false,
      message: "Failed to update BKT parameters",
    };
  }
}