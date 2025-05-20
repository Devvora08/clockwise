"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateWorkHour = async (systemId: string,  newWorkHours: number) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Fetch current UserSystem record
    const userSystem = await prisma.userSystem.findUnique({
        where: {
            userId_systemId: {
                userId,
                systemId,
            },
        },
    });

    if (!userSystem) throw new Error("UserSystem record not found");
    if (userSystem.workHours !== 0) {
        throw new Error("Work hours already set");
    }

    // Update workHours and workHoursStartedAt
    await prisma.userSystem.update({
        where: {
            userId_systemId: {
                userId,
                systemId,
            },
        },
        data: {
            workHours: newWorkHours,
            workHoursStartedAt: new Date(),
        },
    });

    return { success: true };
    revalidatePath(`/system/${systemId}/profile`)
}