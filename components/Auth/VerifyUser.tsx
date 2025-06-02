"use client"
import React, { use, useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation';
import { verifyUserToken } from '@/actions/auth/verification';


const EmailVerificationStatus = () => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  
    if (!token) {
        return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <XCircle className="text-red-500 w-10 h-10" />
            <p className="text-red-700 font-semibold text-lg">Invalid Request</p>
            <p className="text-sm text-gray-500">No verification token provided.</p>
            </div>
        </div>
        );
    }

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const result = await verifyUserToken(token as string); // Should return true or false
        setStatus(result.success ? 'success' : 'error');
      } catch {
        setStatus('error');
      }
    };

    checkVerification();
  }, [token]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        redirect('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const baseCard = "bg-white p-6 rounded-2xl shadow-md flex flex-col items-center gap-3";

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      {status === 'loading' && (
        <div className={baseCard}>
          <Loader2 className="animate-spin w-10 h-10 text-orange-600" />
          <p className="text-orange-700 font-medium text-lg">Verifying your email...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={baseCard}>
          <CheckCircle className="text-green-500 w-10 h-10" />
          <p className="text-green-700 font-semibold text-lg">Email verified successfully!</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      )}

      {status === 'error' && (
        <div className={baseCard}>
          <XCircle className="text-red-500 w-10 h-10" />
          <p className="text-red-700 font-semibold text-lg">Verification failed</p>
          <p className="text-sm text-gray-500">This link may be invalid or expired.</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationStatus;
