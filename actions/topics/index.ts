import prisma from "@/db/prisma";


export const getTopics = async () =>{
    try {
        const topics = await prisma.topic.findMany({
            include: {
                stages: true
            }
        })
        return topics
    } catch (error) {
        return null;
    }
}