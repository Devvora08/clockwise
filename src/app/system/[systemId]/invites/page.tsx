"use client";

import React, { useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { fetchInvitesClient } from "@/lib/fetchers/fetchInvites";
import { toast } from "sonner";
import { handleInviteClient } from "@/lib/actions/handleInviteClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminInvitesPage() {
  const { user } = useUser();
  const params = useParams();
  const systemId = useMemo(() => params?.systemId as string, [params]);

  const {
    data: invites,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invites", systemId],
    queryFn: () => fetchInvitesClient(systemId, user?.id as string),
    enabled: !!user?.id && !!systemId,
  });

  const { mutate: handleInviteMutation, isPending } = useMutation({
    mutationFn: handleInviteClient,
    onSuccess: () => {
      toast.success("Invite updated successfully!");
      refetch();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update invite.");
    },
  });

  if (isLoading) return <div className="p-4">Loading invites...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading invites</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
         <h2 className="text-4xl font-semibold mb-4">Invites</h2>
      <Button variant={'default'} size={'lg'}>
        <Link href={`/system/${systemId}`}>
            Dashboard
        </Link>
      </Button>
      </div>
     
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b text-left">Sr No.</th>
            <th className="px-4 py-2 border-b text-left">Name</th>
            <th className="px-4 py-2 border-b text-left">Invite Sent On</th>
            <th className="px-4 py-2 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {invites?.map((invite, index) => (
            <tr key={invite.id}>
              <td className="px-4 py-2 border-b text-left">{index + 1}</td>
              <td className="px-4 py-2 border-b text-left">
                {invite.user.name || invite.user.email}
              </td>
              <td className="px-4 py-2 border-b text-left">
                {new Date(invite.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b text-center">
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                  defaultValue=""
                  onChange={(e) => {
                    const action = e.target.value as "accept" | "reject";
                    handleInviteMutation({
                      inviteId: invite.id,
                      systemId,
                      userId: invite.userId, // Make sure this is returned in your fetcher
                      action,
                    });
                  }}
                  disabled={isPending}
                >
                  <option value="" disabled>
                    Select Action
                  </option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
