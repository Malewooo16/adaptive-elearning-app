"use client"
import { signOut } from '@/auth/authOptions';
import React from 'react'

export default function SignOut() {
      const handleSignOut = async () => {
    await signOut();
  }
  return (
     <button
                onClick={handleSignOut}
                className="mt-6 w-full btn bg-orange-500 text-white hover:bg-orange-600 border-none"
              >
                🔓 Sign Out
              </button>
  )
}
