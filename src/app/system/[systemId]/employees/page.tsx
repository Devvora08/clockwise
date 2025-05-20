/* eslint-disable @next/next/no-img-element */
import { getAllUsersOfSystem } from '@/actions/systems/getUserSystem';
import { AdminNavbar } from '@/modules/admin/components/admin-navbar';
import { format } from 'date-fns';
import React from 'react'

interface PageProps {
  params: Promise<{ systemId: string }>;
}

async function Page({params}: PageProps) {

  const {systemId} = await params;
  const userSystems = await getAllUsersOfSystem(systemId);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <AdminNavbar systemId={systemId} />
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Employees</h1>

      {userSystems.length === 0 ? (
        <p className="text-gray-600">No users found in this system.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userSystems.map(({ user, role }) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={user.imageUrl || '/default-avatar.png'}
                      alt="name"
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        role === 'Admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {format(new Date(user.createdAt), 'PPP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Page
