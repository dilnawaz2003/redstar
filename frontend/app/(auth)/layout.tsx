// app/(auth)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   if (token) {
  //     router.push('/dashboard');
  //   }
  // }, [token, router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 bg-linear-to-r from-red-600 to-red-800 rounded-lg transform rotate-45"></div>
              <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-sm transform rotate-45"></div>
              <span className="absolute inset-0 flex items-center justify-center text-red-600 font-bold text-xl transform -rotate-45">
                W
              </span>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Workspace Task Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Streamline your team&apos;s workflow
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-red-500/5 sm:rounded-lg sm:px-10 border border-red-100 dark:border-red-900/30">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}