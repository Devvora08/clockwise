'use client';

import React, { useState, useEffect } from 'react';
import { InitiateAttendanceBtn } from './initiate-attendance-btn';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { getAttendanceState } from '@/actions/attendance/fetchAttendanceState';
import { EndAttendanceBtn } from './end-attendance';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import AuthBtn from '@/components/auth-btn';
import Link from 'next/link';

interface AttendanceRecord {
  date: string;
  status: string;
}

interface AttendanceClientProps {
  systemId: string;
  attendanceData: {
    user: { name: string | null; email: string } | null;
    records: AttendanceRecord[];
  };
}

const AttendanceClient: React.FC<AttendanceClientProps> = ({ systemId, attendanceData }) => {
  const [attendanceState, setAttendanceState] = useState({
    status: 'none',
    canStart: true,
    canPause: false,
    canResume: false,
    canEnd: false,
    totalWorkedMinutes: 0,
    systemId: systemId,
  });


  const statusToValue: Record<'present' | 'absent' | 'holiday' | 'pending', number> = {
    present: 1,
    absent: -1,
    holiday: 0,
    pending: 0,
  };

  function isValidStatus(status: string): status is keyof typeof statusToValue {
    return status in statusToValue;
  }

  const chartData = attendanceData.records.map(({ date, status }) => ({
    date: new Date(date).toLocaleDateString(),
    value: isValidStatus(status) ? statusToValue[status] : 0,
  }));

  const { data } = useQuery({
    queryKey: ['attendanceState', systemId],
    queryFn: async () => await getAttendanceState(systemId),
    refetchInterval: 600000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data) {
      setAttendanceState({ ...data, systemId });
    }
  }, [data, systemId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center px-6 py-10 font-sans">
      <div className="flex justify-between items-center w-full px-8 py-2">
        <div>
          <Link
            href={`/system/${systemId}/profile`}
            className="inline-block px-4 py-2 rounded-lg bg-grey-600 text-black font-semibold shadow-md hover:bg-blue-300 transition-colors duration-200"
          >
            Profile
          </Link>
        </div>

        <div>
          <AuthBtn />
        </div>
      </div>
      <h1 className="text-4xl font-extrabold text-green-900 mb-6 tracking-tight drop-shadow-md">
        Employee Attendance Page
      </h1>

      <p className="mb-2 text-lg text-green-700 font-medium">
        Welcome, <span className="font-semibold">{attendanceData.user?.name ?? attendanceData.user?.email ?? 'User'}</span>
      </p>
      <Separator className="w-full max-w-4xl mb-8 border-green-300" />

      <div className="w-full max-w-4xl bg-white shadow-lg flex justify-between py-5 mb-12">
        <div>
          <InitiateAttendanceBtn attendanceState={attendanceState} />
        </div>
        <div>
          <EndAttendanceBtn attendanceState={attendanceState} />
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 border border-green-200">
        <h2 className="text-2xl font-bold text-green-900 mb-6 text-center tracking-wide">
          Attendance Status Overview
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis dataKey="date" stroke="#065f46" tick={{ fontSize: 12, fill: "#065f46" }} />
            <YAxis
              domain={[-1, 1]}
              ticks={[-1, 0, 1]}
              stroke="#065f46"
              tickFormatter={(value) =>
                value === 1 ? 'Present' : value === -1 ? 'Absent' : 'Holiday'
              }
              tick={{ fontSize: 12, fill: "#065f46" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#ecfdf5", borderRadius: '6px', borderColor: "#10b981" }}
              labelStyle={{ color: "#065f46", fontWeight: "bold" }}
              formatter={(value: number) =>
                value === 1 ? 'Present' : value === -1 ? 'Absent' : 'Holiday'
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#111827"             // very dark black-blue
              strokeWidth={3}
              activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 3, fill: '#2563eb' }}  // dark stroke, bright blue fill
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: 14, fontWeight: '600', color: '#065f46' }}
              payload={[
                { value: 'Present', type: 'circle', color: '#16a34a' },
                { value: 'Absent', type: 'circle', color: '#ef4444' },
                { value: 'Holiday', type: 'circle', color: '#fde68a' },
                { value: 'Pending', type: 'circle', color: '#9ca3af' },
              ]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceClient;
