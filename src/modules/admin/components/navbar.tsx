'use client';

import AuthBtn from '@/components/auth-btn';
import {
  UsersIcon,
  ClipboardListIcon,
  MailQuestionIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  systemId: string;
}

const adminRoutes = [
  {
    title: 'Invites',
    path: 'invites',
    icon: MailQuestionIcon,
  },
  {
    title: 'Attendance',
    path: 'attendance',
    icon: ClipboardListIcon,
  },
  {
    title: 'Employees',
    path: 'employees',
    icon: UsersIcon,
  },
];

export const AdminSidebar = ({ systemId }: AdminSidebarProps) => {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b px-10 py-6 flex items-center justify-between shadow-sm">
      {/* Centered nav links */}
      <div className="flex-1 flex justify-center">
        <div className="flex gap-12 font-extrabold text-lg text-gray-800">
          {adminRoutes.map(({ title, path }) => {
            const active = pathname.includes(path);
            return (
              <Link
                key={path}
                href={`/system/${systemId}/${path}`}
                className={`inline-flex items-center gap-2 transition-colors ${active ? 'text-gray-900' : 'text-gray-900 hover:text-gray-900'
                  }`}
              >
             
                <span className='p-3'>{title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Auth Button on the right */}
      <div className="ml-auto pr-6 relative">
        <AuthBtn />
      </div>
    </nav>
  );


};
