"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function handleInvite({
  inviteId,
  systemId,
  userId,
  action, // "accept" or "reject"
}: {
  inviteId: string;
  systemId: string;
  userId: string;
  action: "accept" | "reject";
}) {
  if (action === "accept") {
    // Add to UserSystem as Employee
    await prisma.userSystem.create({
      data: {
        userId,
        systemId,
        role: "Employee",
      },
    });

    // Update the invite status to ACCEPTED
    await prisma.invite.update({
      where: { id: inviteId },
      data: { status: "ACCEPTED" },
    });

  } else if (action === "reject") {
    // Just update status to REJECTED
    await prisma.invite.update({
      where: { id: inviteId },
      data: { status: "REJECTED" },
    });
  }

  revalidatePath("/dashboard");

}
