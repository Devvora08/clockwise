"use server";

import prisma from "@/lib/prisma";
import { startOfToday } from "date-fns";
import { revalidatePath } from "next/cache";

export const pauseAttendance = async ({
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
    throw new Error("No attendance record found for today.");
  }

  if (!["started", "resumed"].includes(attendance.status)) {
    throw new Error(`Cannot pause when status is "${attendance.status}".`);
  }

  const currentPauseTimes = Array.isArray(attendance.pauseTimes)
    ? attendance.pauseTimes
    : [];

  const updatedPauseTimes = [
    ...currentPauseTimes,
    { pause: new Date().toISOString() }, // Store timestamps in ISO format
  ];

  await prisma.attendance.update({
    where: {
      userId_systemId_date: {
        userId,
        systemId,
        date: today,
      },
    },
    data: {
      pauseTimes: updatedPauseTimes,
      status: "paused",
    },
  });

  return {
    success: true,
    message: "Attendance paused successfully.",
  };

  revalidatePath(`/system/${systemId}/attendance`)  // this action will change the status to pause. hence it will be triggered in attendance client
};
