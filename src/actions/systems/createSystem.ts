"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createSystemSchema, createSystemSchemaType } from "@/modules/system/form-schema"



export async function createSystem(form: createSystemSchemaType) {
    const { success, data } = createSystemSchema.safeParse(form)
    if (!success) {
        throw new Error("Invalid form data")
    }
    const authUser = await auth();

    if (!authUser || !authUser.userId) {
        throw new Error("Unauthenticated")
    }

    const userId = authUser.userId;

    const existingAdmin = await prisma.userSystem.findFirst({
        where: {
            userId,
            role: "Admin",
        },
    })

    if (existingAdmin) {
        throw new Error("You are already an admin of a system and cannot create another one.")
    }

    if (!data.address || !data.name || !data.passkey) throw new Error("Invalid form details");

    const newSystem = await prisma.system.create({
        data: {
            name: data.name,
            passkey: data.passkey,
            latitude: data.latitude ?? 0, // fallback if not provided
            longitude: data.longitude ?? 0,
            bannerUrl: "", // Optional, can be filled later
            admin: {
                create: { userId },
            },
            address: data.address,
        },
    })

    await prisma.userSystem.create({
        data: {
            userId,
            systemId: newSystem.id,
            role: "Admin",
        },
    })

    revalidatePath("/dashboard")
    return newSystem
}

export async function getSystems() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const systems = await prisma.system.findMany({
  include: {
    users: {
      where: {
        userId: userId, // Find systems where user is involved
      },
    },
  },
});

//console.log("systems:", systems.map(s => ({ id: s.id, name: s.name, adminId: s.adminId, users: s.users })));


// Split into role-based categories

//const adminSystems = systems.filter(system => system.adminId === userId); // Admin of the system
const enrolledSystems = systems.filter(
  system => system.adminId !== userId && system.users.length > 0
).reverse(); // Employee
const availableSystems = systems.filter(system => system.users.length === 0); // Not enrolled

const sortedSystems = [ ...enrolledSystems, ...availableSystems];
// console.log(sortedSystems)

return sortedSystems;
}

