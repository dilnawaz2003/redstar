// // app/(dashboard)/layout.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
// import Header from '@/components/layout/Header';
// import Sidebar from '@/components/layout/Sidebar';
// import { Toaster } from 'sonner';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { token } = useAppSelector((state) => state.auth);
//   const { workspaces } = useAppSelector((state) => state.workspace);

//   useEffect(() => {
//     if (!token) {
//       router.push('/login');
//     } else {
//       dispatch(fetchWorkspaces());
//     }
//   }, [token, router, dispatch]);

//   if (!token) {
//     return null;
//   }

//   return (
//     <div className="flex min-h-screen bg-linear-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       <Sidebar workspaces={workspaces} />
      
//       <div className="flex-1 flex flex-col">
//         <Header />
        
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
      
//       <Toaster position="top-right" />
//     </div>
//   );
// }


import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>{children}</div>
  )
}

export default layout