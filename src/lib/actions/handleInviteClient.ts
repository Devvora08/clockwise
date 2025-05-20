"use client";

import { handleInvite } from "@/actions/systems/handleInvite";

export const handleInviteClient = async ({
  inviteId,
  systemId,
  userId,
  action,
}: {
  inviteId: string;
  systemId: string;
  userId: string;
  action: "accept" | "reject";
}) => {
  return await handleInvite({ inviteId, systemId, userId, action });
};
