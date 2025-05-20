'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { fetchRole } from '@/actions/user/fetchRole';

interface PasskeyDialogProps {
  systemId: string;
  actualPasskey: number;
  systemName: string;
}

export default function PasskeyDialog({ systemId, actualPasskey, systemName }: PasskeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputPasskey, setInputPasskey] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

   const [role, setRole] = useState<string | null>(null);

  const { mutate: getRole } = useMutation({
    mutationFn: fetchRole,
    onSuccess: (data) => {
      setRole(data); // store the fetched role
    },
    onError: (err) => {
      console.error("Failed to fetch role:", err);
      setRole(null);
    },
  });

  

  const handleAccess = async () => {
    setLoading(true); // Set loading to true when the user clicks the button
    getRole(systemId);
    
    if (parseInt(inputPasskey) === actualPasskey) {
      toast.message("Welcome back !");
      if(role === "Admin") {
         router.push(`/system/${systemId}`);
      }
      else if(role === "Employee") {
        router.push(`/system/${systemId}/attendance`);
      }
     
    } else {
      toast.error('Incorrect passkey');
    }
    
    setLoading(false); // Set loading to false after the verification is done
  };

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Request Access
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Passkey for {systemName}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter passkey"
            value={inputPasskey}
            onChange={(e) => setInputPasskey(e.target.value)}
            type="number"
          />
          <Button onClick={handleAccess} disabled={loading} className="mt-4">
            {loading ? 'Verifying...' : 'Access System'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
