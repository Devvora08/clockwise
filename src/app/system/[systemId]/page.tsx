import { SidebarProvider } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { AdminNavbar } from "@/modules/admin/components/admin-navbar";
import { EmployeeSidebar } from "@/modules/employee/components/employee-sidebar";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ systemId: string }>;
}



const Page = async ({ params }: PageProps) => {
  // Await the resolved value of params
  const { systemId } = await params;

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const userSystem = await prisma.userSystem.findUnique({
    where: {
      userId_systemId: {
        userId,
        systemId,
      }
    },
    include: {
      user: true,
      system: true,
    }
  });

  if (!userSystem) return (
    <div>
      You are not part of this system, return back to dashboard !
    </div>
  )

  const role = userSystem.role;

  return (
    <>
      <div>
        {role === "Admin" ? (
          <>
            <AdminNavbar systemId={systemId} />

            <main className="min-h-[70vh] flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
              <div className="w-full max-w-4xl bg-gray-200 rounded-lg shadow-lg p-10">
                <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
                  System Overview
                </h2>

                <div className="flex items-center justify-center gap-10">
                  {/* System Details */}
                  <div className="bg-gray-800 text-gray-100 p-8 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">
                      System Details
                    </h3>
                    <p className="text-lg mb-3">
                      <strong>Name:</strong> {userSystem.system.name}
                    </p>
                    <p className="text-lg mb-3">
                      <strong>Passkey:</strong> {userSystem.system.passkey}
                    </p>
                    <p className="text-lg">
                      <strong>Location:</strong> {userSystem.system.address}
                    </p>
                  </div>
                </div>
              </div>
            </main>

            <footer className="w-full mt-[5.1rem] bg-gray-900 text-gray-300 text-center py-6">
              <p className="text-sm">&copy; {new Date().getFullYear()} Clockwork. All rights reserved.</p>
            </footer>
          </>
        ) : (
          <>
            <h2>Employee View</h2>
            <h1>Welcome back {userSystem.user.name}</h1>
            <SidebarProvider>
              <EmployeeSidebar systemId={systemId} />
            </SidebarProvider>

          </>
        )}
      </div>
    </>
  );
};

export default Page;
