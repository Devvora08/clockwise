"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import WorkHoursInput from "./employee-workhours-input";
import { Button } from "@/components/ui/button";

// Import your server action directly
import { toast } from "sonner";
import { updateWorkHour } from "@/actions/user/updateWorkHour";

interface EmployeeWorkHoursProps {
  user: {
    workHours: number | null;
    user: {
      name: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      imageUrl: string;
    };
    system: {
      name: string;
      address: string;
      id: string;
      adminId: string;
      bannerUrl: string | null;
      passkey: number;
      latitude: number;
      longitude: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

const EmployeeWorkHours: React.FC<EmployeeWorkHoursProps> = ({ user }) => {
  const [workHours, setWorkHours] = useState<number | null>(user.workHours ?? 0);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ systemId, workHours }: { systemId: string; workHours: number }) =>
      updateWorkHour(systemId, workHours),
    onSuccess: () => {
      toast.success("Work hours updated successfully!");
      // You can add any state reset or refetch here if needed
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update work hours");
    },
  });

  const handleSubmit = () => {
    if (workHours === null || workHours === 0) {
      toast.error("Please enter valid work hours");
      return;
    }
    mutate({ systemId: user.system.id, workHours });
  };

  return (
    <div className="w-full flex justify-center mt-8">
      <div className="max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold mb-4">
          Set Work Hours for {user.user.name ?? "Employee"}
        </h3>
        <WorkHoursInput
          initialValue={workHours ?? 0}
          onChange={setWorkHours}
        />
        <div className="mt-4 mb-4">
          <Button
            disabled={user.workHours !== 0 || isPending}
            variant={"default"}
            size={"lg"}
            onClick={handleSubmit}
          >
            {isPending ? "Saving..." : "Set Hours"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWorkHours;
