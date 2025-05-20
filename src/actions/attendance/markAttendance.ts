/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { differenceInMinutes, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { isAtLocation } from "../systems/isAtLocation";

export const markAttendance = async ({
  userId,
  systemId,
  userLatitude,
  userLongitude,
}: {
  userId: string;
  systemId: string;
  userLatitude: number;
  userLongitude: number;

}) => {

  // ✅ Location check
  const atLocation = await isAtLocation(systemId, userLatitude, userLongitude);
  if (!atLocation) {
    throw new Error("You are not at the system location. Cannot mark attendance.");
  }

  // 1. Fetch the user's workHours for this system from UserSystem
  const userSystem = await prisma.userSystem.findUnique({
    where: {
      userId_systemId: {
        userId,
        systemId,
      },
    },
  });

  if (!userSystem) {
    throw new Error("UserSystem not found.");
  }

  const workHours = userSystem.workHours || 0; // fallback to 0 if null

  if (workHours === 0) {
    throw new Error("Work hours not set. Cannot mark attendance.");
  }

  // 2. Fetch today's attendance entry for user+system
  const today = new Date();
  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_systemId_date: {
        userId,
        systemId,
        date: startOfDay(today),
      },
    },
  });

  if (!attendance) {
    throw new Error("Attendance record not found for today.");
  }

  if (!attendance.startTime) {
    throw new Error("Attendance has not been started.");
  }

  const now = new Date();

  let pausedMinutes = 0;
  if (attendance.pauseTimes && Array.isArray(attendance.pauseTimes)) {
    attendance.pauseTimes.forEach((pauseEntry: any) => {
      if (pauseEntry.pause && pauseEntry.resume) {
        const pauseTime = new Date(pauseEntry.pause);
        const resumeTime = new Date(pauseEntry.resume);
        pausedMinutes += differenceInMinutes(resumeTime, pauseTime);
      }
      // If pause without resume (currently paused), consider pause time until now
      else if (pauseEntry.pause && !pauseEntry.resume) {
        const pauseTime = new Date(pauseEntry.pause);
        pausedMinutes += differenceInMinutes(now, pauseTime);
      }
    });
  }

  const workedMinutes = differenceInMinutes(now, attendance.startTime) - pausedMinutes;

  // 4. Compare workedMinutes to workHours (converted to minutes)
  const requiredMinutes = workHours * 60;

  // 5. Update attendance status and endTime accordingly
  const newStatus = workedMinutes >= requiredMinutes ? "present" : "absent";

  await prisma.attendance.update({
    where: {
      userId_systemId_date: {
        userId,
        systemId,
        date: startOfDay(today),
      },
    },
    data: {
      status: newStatus,
      endTime: now,
    },
  });

  void revalidatePath(`/system/${systemId}/attendance`);

  return {
    message: `Attendance marked as ${newStatus}.`,
  };
};
