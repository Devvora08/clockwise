import { fetchRole } from "@/actions/user/fetchRole";
import { fetchUser } from "@/actions/user/fetchUser";
import AuthBtn from "@/components/auth-btn";
import EmployeeInfo from "@/modules/employee/components/employee-info";
import EmployeeWorkHours from "@/modules/employee/components/employee-work-hours";
import Link from "next/link";

interface PageProps {
  params: { systemId: string };
}

export default async function Page({ params }: PageProps) {
  const { systemId } = params;

  const user = await fetchUser(systemId);
  const role = await fetchRole(systemId);

  if (role === "Employee") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-10 font-sans">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-10">
          <Link
            href={`/system/${systemId}/attendance`}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition"
          >
            Attendance
          </Link>

          <AuthBtn />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <EmployeeInfo user={user} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <EmployeeWorkHours user={user} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
