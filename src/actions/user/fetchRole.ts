"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

export const fetchRole = async (systemId: string) => {
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
      role: true,
    },
  });

  if (!userSystem) throw new Error("User not part of the system");

  return userSystem.role;
}