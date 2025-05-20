import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { UserCircleIcon } from 'lucide-react'

function AuthBtn() {
    return (
        <div>
            <SignedIn>
                <UserButton />
            </SignedIn>

            <SignedOut>
                <SignInButton mode="modal">
                    <div className="relative inline-block rounded-md p-[3px] animate-spin-slow" style={{ background: "conic-gradient(green, blue)" }}>
                        <button className="bg-white/100 rounded-md px-4 py-2 flex items-center space-x-2 font-semibold text-black">
                            <UserCircleIcon className="w-5 h-5" />
                            <span>Sign-in</span>
                        </button>
                    </div>
                </SignInButton>
            </SignedOut>
        </div>
    )
}

export default AuthBtn
