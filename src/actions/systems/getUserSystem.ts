"use server";

import prisma from "@/lib/prisma";

export const getUserSystemData = async (userId: string, systemId: string) => {
  const userSystem = await prisma.userSystem.findUnique({
    where: {
      userId_systemId: {
        userId,
        systemId,
      },
    },
    select: {
      workHours: true,
    },
  });

  if (!userSystem) {
    throw new Error("UserSystem not found");
  }

  return userSystem;
};

export const getAllUsersOfSystem = async (systemId: string) => {
  const users = await prisma.userSystem.findMany({
    where: { systemId },
    include: {
      user: true,   // include user details like name, email, etc.
    },
    orderBy: {
      role: 'asc', // optional: admins first if your roles sort that way
    }
  });

  return users;
};
