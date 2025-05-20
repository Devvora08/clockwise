import { getAllEmployeeAttendance, getUserAttendance } from '@/actions/attendance/getUserAttendance';
import { fetchRole } from '@/actions/user/fetchRole';
import { AdminNavbar } from '@/modules/admin/components/admin-navbar';
import AttendanceClient from '@/modules/attendance/components/attendance-client';
import { auth } from '@clerk/nextjs/server';
import { Check, X, Clock } from 'lucide-react';

interface AttendancePageProps {
   params: Promise<{ systemId: string }>;
}

export default async function AttendancePage({ params }: AttendancePageProps) {
  const {systemId} = await params;
  const role = await fetchRole(systemId);

  const { userId } = await auth();

  if (!userId) {
    return <div>Please login to access attendance.</div>;
  }

  const data = await getAllEmployeeAttendance(systemId)

  if (role === "Admin") {
    return (
      <div className="p-6">
        <AdminNavbar systemId={systemId} />
        <h2 className="text-2xl font-bold mb-6">Employee Attendance Overview</h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((employee) => (
            <div
              key={employee.userId}
              className="rounded-2xl shadow-md p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700"
            >
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
                {employee.user.name ?? employee.user.email}
              </h3>

              <div className="h-64 overflow-y-auto pr-1 space-y-2">
                {employee.attendances.map((a) => {
                  let statusIcon;
                  let statusColor;

                  switch (a.status) {
                    case 'present':
                      statusIcon = <Check className="w-4 h-4 text-green-500" />;
                      statusColor = 'text-green-600';
                      break;
                    case 'absent':
                      statusIcon = <X className="w-4 h-4 text-red-500" />;
                      statusColor = 'text-red-600';
                      break;
                    default:
                      statusIcon = <Clock className="w-4 h-4 text-yellow-500" />;
                      statusColor = 'text-yellow-600';
                      break;
                  }

                  return (
                    <div
                      key={a.id}
                      className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {new Date(a.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className={`flex items-center gap-1 text-sm font-medium ${statusColor}`}>
                        {statusIcon}
                        {a.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  const attendanceData = await getUserAttendance(userId, systemId);

  return <AttendanceClient systemId={systemId} attendanceData={attendanceData} />;
}
