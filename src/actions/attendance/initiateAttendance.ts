"use server";

import prisma from "@/lib/prisma";
import { subDays, startOfDay, isSunday } from "date-fns";
import { isAtLocation } from "../systems/isAtLocation";

interface InitiateAttendanceArgs {
    systemId: string;
    userId: string;
    userLatitude: number;
    userLongitude: number;
}

export const initiateAttendance = async ({ systemId, userId, userLatitude, userLongitude }: InitiateAttendanceArgs) => {
    const now = new Date();
    const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const today = startOfDay(localToday); // Optional but explicit
    const yesterday = startOfDay(subDays(now, 1));

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

    if (!userSystem || userSystem.workHours === 0 || userSystem.workHours === null) {
        throw new Error("Please set your work hours from your profile before proceeding.");
    }

    // Check if user is at system location
    const atLocation = await isAtLocation(systemId, userLatitude, userLongitude);
    if (!atLocation) {
        throw new Error("You are not at the system location. Cannot start attendance.");
    }

    // 1. Check if Sunday (holiday)
    if (isSunday(today)) {
        // Create attendance as holiday if not exists
        const existingHoliday = await prisma.attendance.findUnique({
            where: { userId_systemId_date: { userId, systemId, date: today } },
        });

        if (existingHoliday) {
            throw new Error("Attendance for today already exists.");
        }

        await prisma.attendance.create({
            data: {
                userId,
                systemId,
                date: today,
                status: "holiday",
            },
        });

        return { message: "Today is a holiday (Sunday)." };
    }

    // 2. Check yesterday's attendance finalization
    const yesterdayAttendance = await prisma.attendance.findUnique({
        where: { userId_systemId_date: { userId, systemId, date: yesterday } },
    });

    if (!yesterdayAttendance) {
        // Case 2: No entry exists — check if yesterday was a Sunday
        const wasSunday = isSunday(yesterday);
        await prisma.attendance.create({
            data: {
                userId,
                systemId,
                date: yesterday,
                status: wasSunday ? "holiday" : "absent",
            },
        });
    } else if (
        !["present", "absent", "holiday"].includes(yesterdayAttendance.status)
    ) {
        // Case 1: Entry exists but still pending — check if yesterday was a Sunday
        const wasSunday = isSunday(yesterday);
        await prisma.attendance.update({
            where: { id: yesterdayAttendance.id },
            data: { status: wasSunday ? "holiday" : "absent" },
        });
    }
    // 3. Check if today attendance already exists
    const todayAttendance = await prisma.attendance.findUnique({
        where: { userId_systemId_date: { userId, systemId, date: today } },
    });

    if (todayAttendance) {
        throw new Error("Attendance for today already started or exists.");
    }

    // 4. Create attendance for today - mark as started
    await prisma.attendance.create({
        data: {
            userId,
            systemId,
            date: today,
            startTime: now,
            status: "started",
            pauseTimes: JSON.stringify([]), // empty array to track pauses
        },
    });

    return { message: "Attendance started successfully." };
};
