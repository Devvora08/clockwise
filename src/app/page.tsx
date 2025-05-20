"use client"

import HomeNavbar from "@/modules/home/components/navbar";
import { BarChartIcon, ClockIcon, UserCircle2Icon } from "lucide-react";


export default function Home() {
   return (
    <>
      <HomeNavbar />

      <main className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-cyan-100 flex flex-col justify-center px-6 py-16">
        <section className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-gray-900">
          <h1 className="text-5xl font-extrabold text-center mb-8 tracking-tight">
            Welcome to Clockwise
          </h1>

          <p className="text-lg leading-relaxed max-w-3xl mx-auto text-center mb-12">
            Clockwise is an innovative attendance management system built to streamline employee tracking, automate attendance marking, and provide insightful real-time reports to both admins and employees.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto">
            <FeatureCard
              Icon={ClockIcon}
              title="Automated Attendance"
              description="No manual logs needed — attendance is automatically tracked and updated daily."
            />
            <FeatureCard
              Icon={UserCircle2Icon}
              title="Team Management"
              description="Admins can effortlessly manage employees, work hours, and attendance statuses."
            />
            <FeatureCard
              Icon={BarChartIcon}
              title="Insights & Reports"
              description="Get detailed analytics and attendance stats for better workforce decisions."
            />
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 bg-white/70 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} Clockwise. All rights reserved.
      </footer>
    </>
  );
}

function FeatureCard({
  Icon,
  title,
  description,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <Icon className="w-14 h-14 text-fuchsia-900 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
