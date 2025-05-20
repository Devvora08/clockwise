// app/actions/attendance/getAttendanceState.ts
"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getAttendanceState = async (systemId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const userId = user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
    return {
      status: "none",
      canStart: true,
      canPause: false,
      canResume: false,
      canEnd: false,
      totalWorkedMinutes: 0,
    };
  }

  const { status } = attendance;

  const canPause = status === "started";
  const canResume = status === "paused";
  const canEnd = status === "started" || status === "resumed";

  // Work time calculation placeholder
  const totalWorkedMinutes = 0;

  return {
    status,
    canStart: false,
    canPause,
    canResume,
    canEnd,
    totalWorkedMinutes,
  };
};
