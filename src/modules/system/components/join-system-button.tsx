'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { inviteSystem } from '@/actions/systems/inviteSystem'; // new function
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

interface JoinSystemButtonProps {
  systemId: string;
}

export default function JoinSystemButton({ systemId }: JoinSystemButtonProps) {
  const { user } = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ systemId, userId }: { systemId: string; userId: string }) =>
      inviteSystem(systemId, userId),
    onSuccess: () => {
      toast.success('Invite sent successfully!');
      console.log("invite created for user - ",user?.id);
    },
    onError: (error) => {
      toast.error(error.message || 'Invite already sent once !');
    },
  });

  const handleJoinClick = () => {
    if (!user?.id) {
      toast.error('You must be logged in to join a system.');
      return;
    }

    mutate({ systemId, userId: user.id });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleJoinClick}
      disabled={isPending}
    >
      {isPending ? 'Sending...' : 'Send Invite'}
    </Button>
  );
}
