/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markAttendance } from "@/actions/attendance/markAttendance";
import { getUserSystemData } from "@/actions/systems/getUserSystem";

interface AttendanceState {
  status: string;
  canStart: boolean;
  canPause: boolean;
  canResume: boolean;
  canEnd: boolean;
  totalWorkedMinutes: number;
  systemId: string;
}

interface AttendanceBtnProps {
  attendanceState: AttendanceState;
}

export const EndAttendanceBtn = ({ attendanceState }: AttendanceBtnProps) => {
  const { user } = useUser();

  const { data: userSystemData, isLoading: isWorkHoursLoading } = useQuery({
    queryKey: ["userSystem", user?.id, attendanceState.systemId],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      return await getUserSystemData(user.id, attendanceState.systemId);
    },
    enabled: !!user?.id,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      return await markAttendance({
        userId: user.id,
        systemId: attendanceState.systemId,
        userLatitude: latitude,
        userLongitude: longitude,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["attendanceState", attendanceState.systemId, user?.id],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to mark attendance.");
    },
  });

  const handleClick = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        mutation.mutate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        toast.error("Failed to get your location. Please allow location access.");
      }
    );
  };

  const isLoading = mutation.isPending || isWorkHoursLoading;
 const workedHours = Math.floor(attendanceState.totalWorkedMinutes / 60);
const requiredHours = Math.floor((userSystemData?.workHours || 0));

// Optional: still keep the eligibility check if needed
const isEligible = workedHours >= requiredHours;

  return (
    <div>
      <Button variant={'default'} size={'lg'} onClick={handleClick} disabled={isLoading || !attendanceState.canEnd}>
        {isLoading
          ? "Processing..."
          : isEligible ? "Mark Attendance" : "Mark Attendance"}
            
      </Button>
    </div>
  );
};
