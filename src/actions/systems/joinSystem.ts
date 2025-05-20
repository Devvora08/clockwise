"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function joinSystem(systemId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Create UserSystem entry with role Employee
  const newEmployee = await prisma.userSystem.create({
    data: {
      userId,
      systemId,
      role: 'Employee',
    },
  });

  return newEmployee;

  revalidatePath('/dashboard');
}