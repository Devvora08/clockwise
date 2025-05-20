/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { initiateAttendance } from "@/actions/attendance/initiateAttendance";
import { toast } from "sonner";
import { pauseAttendance } from "@/actions/attendance/pauseAttendance";
import { resumeAttendance } from "@/actions/attendance/resumeAttendance";

interface AttendanceState {
  status: string; // 'none' | 'started' | 'paused' | 'resumed' etc.
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

export const InitiateAttendanceBtn = ({ attendanceState }: AttendanceBtnProps) => {
  const { user } = useUser();

  // Mutation for start
  const startMutation = useMutation({
  mutationFn: async ({ userLatitude, userLongitude }: { userLatitude: number; userLongitude: number }) => {
    if (!user) throw new Error("User not authenticated");
    return await initiateAttendance({
      userId: user.id,
      systemId: attendanceState.systemId,
      userLatitude,
      userLongitude,
    });
  },
  onSuccess: (data) => {
    toast.success(data.message || "Attendance started.");
  },
  onError: (error: any) => {
    toast.error(error?.message || "Something went wrong.");
  },
});


  // Mutation for pause
  const pauseMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      return await pauseAttendance({
        userId: user.id,
        systemId: attendanceState.systemId,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Attendance paused.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong.");
    },
  });

  // Mutation for resume
  const resumeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      return await resumeAttendance({
        userId: user.id,
        systemId: attendanceState.systemId,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Attendance resumed.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong.");
    },
  });

  // Handle button click based on status
  const handleClick = () => {
  if (!user) {
    toast.error("User not authenticated");
    return;
  }

  switch (attendanceState.status) {
    case "none":
      if (attendanceState.canStart && !startMutation.isPending) {
        if (!navigator.geolocation) {
          toast.error("Geolocation is not supported by your browser");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            startMutation.mutate({
              userLatitude: latitude,
              userLongitude: longitude,
            });
          },
          (error) => {
            toast.error("Unable to retrieve your location");
            console.log(error)
          }
        );
      }
      break;

    case "started":
      if (attendanceState.canPause && !pauseMutation.isPending) {
        pauseMutation.mutate();
      }
      break;

    case "paused":
    case "resumed":
      if (attendanceState.canResume && !resumeMutation.isPending) {
        resumeMutation.mutate();
      }
      break;

    default:
      break;
  }
};


  // Show loading if any mutation is running
  const isLoading =
    startMutation.isPending || pauseMutation.isPending || resumeMutation.isPending

  // Label based on status
  const getButtonLabel = () => {
    if (isLoading) return "Processing...";

    switch (attendanceState.status) {
      case "none":
        return "Start";
      case "started":
        return "Pause";
      case "paused":
      case "resumed":
        return "Resume";
      default:
        return "Start";
    }
  };

  // Disabled logic can consider all relevant flags + loading
  const isDisabled =
    isLoading ||
    (!attendanceState.canStart &&
      !attendanceState.canPause &&
      !attendanceState.canResume);

  return (
   <Button
  onClick={handleClick}
  disabled={isDisabled}
  variant="default"
  size={'lg'}>
  {getButtonLabel()}
</Button>
  );
};
