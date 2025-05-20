"use server";

import prisma from "@/lib/prisma";
import { startOfToday } from "date-fns";
import { revalidatePath } from "next/cache";

export const resumeAttendance = async ({
  userId,
  systemId,
}: {
  userId: string;
  systemId: string;
}) => {
  const today = startOfToday();

  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_systemId_date: {
        userId,
        systemId,
        date: today,
      },
    },
  });

  if (!attendance) {
    throw new Error("Attendance record not found for today.");
  }

  const now = new Date();

  // Parse pauseTimes or init as empty array
  const pauseTimes = (attendance.pauseTimes || []) as Array<{
    pause: string;
    resume?: string;
  }>;

  if (
    pauseTimes.length === 0 ||
    pauseTimes[pauseTimes.length - 1].resume !== undefined
  ) {
    throw new Error("Cannot resume — no active pause found.");
  }

  // Set resume time for last pause entry
  pauseTimes[pauseTimes.length - 1].resume = now.toISOString();

  await prisma.attendance.update({
    where: {
      userId_systemId_date: {
        userId,
        systemId,
        date: today,
      },
    },
    data: {
      pauseTimes,
      status: "resumed",
    },
  });

  return { success: true, message: "Attendance resumed." };

  revalidatePath(`/system/${systemId}/attendance`)  // this action will change the status to pause. hence it will be triggered in attendance client
};
