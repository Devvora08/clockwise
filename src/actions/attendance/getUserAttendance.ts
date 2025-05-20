"use server";

import prisma from "@/lib/prisma";

export const getUserAttendance = async (userId: string, systemId: string) => {
  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      userId,
      systemId,
    },
    select: {
      date: true,
      status: true,
      userSystem: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  if (attendanceRecords.length === 0) {
    return {
      user: null,
      records: [],
    };
  }

  const user = attendanceRecords[0].userSystem.user;

  return {
    user,
    records: attendanceRecords.map(({ date, status }) => ({
      status,
      date: date.toISOString(),
    })),
  };
};

type AttendanceGroupedByUser = {
  userId: string;
  user: {
    name: string | null;
    email: string;
  };
  attendances: {
    id: string;
    date: Date;
    startTime: Date | null;
    endTime: Date | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pauseTimes: any;
    status: string;
  }[];
};

export async function getAllEmployeeAttendance(systemId: string): Promise<AttendanceGroupedByUser[]> {
  try {
    const attendances = await prisma.attendance.findMany({
      where: { systemId },
      include: {
        userSystem: {
          include: {
            user: true, // Include user details (name, email, etc.)
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const grouped = attendances.reduce<Record<string, AttendanceGroupedByUser>>((acc, attendance) => {
      const { userId } = attendance;
      const user = attendance.userSystem.user;

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          user: {
            name: user.name,
            email: user.email,
          },
          attendances: [],
        };
      }

      acc[userId].attendances.push({
        id: attendance.id,
        date: attendance.date,
        startTime: attendance.startTime,
        endTime: attendance.endTime,
        pauseTimes: attendance.pauseTimes,
        status: attendance.status,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  } catch (error) {
    console.error('[getAllEmployeeAttendance]', error);
    throw new Error('Failed to fetch attendances');
  }
}
