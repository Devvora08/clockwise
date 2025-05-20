"use server"

import prisma from "@/lib/prisma";

export const fetchInvites = async (systemId: string, userId: string) => {
    // confirm admin is of this system
    const system = await prisma.system.findUnique({
        where: { id: systemId },
        include: {
            admin: {
                include: { user: true },
            },
        },
    });

    if (!system || system.admin?.userId !== userId) {
        throw new Error('Unauthorized access to system invites.');
    }

    const invites = await prisma.invite.findMany({
        where: { systemId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    imageUrl: true,
                },
            },
        },
        orderBy: {
            status: 'asc', // PENDING (0), ACCEPTED (1), REJECTED (2)
        },
    });

    return invites;
}