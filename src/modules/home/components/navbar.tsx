import AuthBtn from '@/components/auth-btn';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function HomeNavbar() {
    return (
        <header className="w-full px-4 py-3 shadow-md bg-white font-poppins">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <Clock className="w-8 h-8 text-black group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-2xl font-extrabold text-black group-hover:rotate-2 transition-transform duration-300">
                        Clockwise
                    </span>
                </Link>

                {/* Nav actions */}
                <div className="flex items-center space-x-6">
                    <Link
                        href="/dashboard"
                        className="text-base p-4 font-extrabold text-black hover:text-blue-600 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <div className="shrink-0">
                        <AuthBtn />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HomeNavbar
