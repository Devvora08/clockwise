/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, MapPin, KeyRound, ShieldCheck } from 'lucide-react';
import PasskeyDialog from './passkey-dialog';
import JoinSystemButton from './join-system-button';

export default function SystemList({ systems }: { systems: any }) {
  const { user } = useUser();

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {systems.map((system: any) => {
          const currentUserEntry = system.users.find(
            (u: any) => u.userId === user?.id
          );
          const role = currentUserEntry?.role;

          const roleColor =
            role === 'Admin'
              ? 'text-blue-600'
              : role === 'Employee'
                ? 'text-green-600'
                : 'text-muted-foreground';

          return (
            <Card
              key={system.id}
              className="transition hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  {system.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {system.address}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <KeyRound className="w-4 h-4 text-gray-400" />
                  <span className="font-mono">Passkey: {system.passkey}</span>
                </div>

                <div className={`flex items-center gap-2 font-medium ${roleColor}`}>
                  <ShieldCheck className="w-4 h-4" />
                  Role: {role ?? 'Not Enrolled'}
                </div>

                <div className="pt-4">
                  {role ? (
                    <PasskeyDialog
                      systemId={system.id}
                      actualPasskey={system.passkey}
                      systemName={system.name}
                    />
                  ) : (
                    <JoinSystemButton systemId={system.id} />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
