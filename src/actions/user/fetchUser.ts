"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

export const fetchUser = async (systemId: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const userSystem = await prisma.userSystem.findUnique({
    where: {
      userId_systemId: {
        userId,
        systemId,
      },
    },
    select: {
      user: true,
      system: true,
      workHours: true,
    },
  });

  if (!userSystem) throw new Error("User not part of the system");

  return {
  user: userSystem.user,
  system: userSystem.system,
  workHours: userSystem.workHours,
};
}