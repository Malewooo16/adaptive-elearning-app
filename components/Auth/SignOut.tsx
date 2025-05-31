"use client"
import { signOut } from 'next-auth/react';
import React from 'react'

export default function SignOut() {
     
  return (
     <button
                onClick={() => signOut()}
                className="mt-6 w-full btn bg-orange-500 text-white hover:bg-orange-600 border-none"
              >
                🔓 Sign Out
              </button>
  )
}
