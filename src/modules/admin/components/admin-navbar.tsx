import { auth } from "@clerk/nextjs/server";
import { AdminSidebar } from "./navbar";

interface AdminNavbarProps {
  systemId: string;
}

export const AdminNavbar = async ({ systemId }: AdminNavbarProps) => {

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return (
    
      <AdminSidebar systemId={systemId} /> 
    
  )
}