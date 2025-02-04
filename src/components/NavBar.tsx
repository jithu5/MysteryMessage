"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'


function NavBar() {
    const { data: session } = useSession()

    const user: User = session?.user as User;

    return (
        <>
          
            <nav className="bg-gray-900 text-white p-4 shadow-md w-full flex">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="#" className="text-lg font-semibold">Mystery Message</a>

                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <span className="text-sm">Welcome, {user?.username || user?.email}</span>
                                <Button
                                    onClick={()=>signOut()}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in" className="text-blue-400 hover:text-blue-300">Sign In</Link>
                                <Link href="/sign-up" className="text-blue-400 hover:text-blue-300">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar
