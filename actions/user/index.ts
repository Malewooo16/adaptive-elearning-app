import { auth } from "@/auth/authOptions";
import prisma from "@/db/prisma";

export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {id: userId},
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserSessionInclusive = async() =>{
  try {
    const session = await auth()
    if(!session?.user) return;
    const user = await getUser(session.user.id as string);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
