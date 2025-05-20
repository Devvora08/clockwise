'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  UserIcon,
  ClipboardListIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface EmployeeSidebarProps {
  systemId: string;
}

const employeeRoutes = [
  {
    title: 'Profile',
    path: 'profile',
    icon: UserIcon,
  },
  {
    title: 'Attendance',
    path: 'attendance',
    icon: ClipboardListIcon,
  },
];

export const EmployeeSidebar = ({ systemId }: EmployeeSidebarProps) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {employeeRoutes.map((item) => {
            const fullPath = `/system/${systemId}/${item.path}`;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === fullPath} tooltip={item.title}>
                  <Link href={fullPath} className="flex items-center gap-4">
                    <item.icon />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
