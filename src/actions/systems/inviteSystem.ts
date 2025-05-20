"use server"

import prisma from "@/lib/prisma"

export const inviteSystem = async (systemId: string, userId: string) => {
    try {
        const existing = await prisma.invite.findUnique({
            where: {
                userId_systemId: {
                    userId,
                    systemId,
                }
            }
        });

        if(existing) throw new Error("Invitation is already been sent once");

        // else create the invite

        const invite = await prisma.invite.create({
            data: {
                userId,
                systemId,
            }
        });

        return invite;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    throw new Error('Invite already sent once !');
  }
} 