import { getDistanceInMeters } from "@/lib/helper";
import prisma from "@/lib/prisma";

export const isAtLocation = async (
  systemId: string,
  userLatitude: number,
  userLongitude: number,
  maxDistanceMeters = 5000
): Promise<boolean> => {
  const system = await prisma.system.findUnique({
    where: { id: systemId },
    select: { latitude: true, longitude: true },
  });

  if (!system) throw new Error("System not found");

  const distance = getDistanceInMeters(
    system.latitude,
    system.longitude,
    userLatitude,
    userLongitude
  );
console.log(`System coords: ${system.latitude}, ${system.longitude}`);
console.log(`User coords: ${userLatitude}, ${userLongitude}`);
console.log(`Distance: ${distance} meters`);
  return distance <= maxDistanceMeters;
};
