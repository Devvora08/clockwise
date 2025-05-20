
import { getSystems } from '@/actions/systems/createSystem'
import AuthBtn from '@/components/auth-btn'
import CreateSystemDialog from '@/modules/system/components/create-system'
import SystemList from '@/modules/system/components/system-list'


import React from 'react'

async function Page() {
  const systems = await getSystems();

 return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Your Systems</h1>
          <div className="flex items-center gap-4">
            <CreateSystemDialog />
            <AuthBtn />
          </div>
        </header>

        {/* System List */}
        <section>
          <SystemList systems={systems} />
        </section>
      </div>
    </div>
  );
}

export default Page;
