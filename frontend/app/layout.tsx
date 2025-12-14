// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from 'sonner';
import ReduxProvider from '@/lib/redux/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workspace Task Manager',
  description: 'A modern task management system for teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                classNames: {
                  error: 'bg-red-100 border-red-200 text-red-900',
                  success: 'bg-green-100 border-green-200 text-green-900',
                  warning: 'bg-yellow-100 border-yellow-200 text-yellow-900',
                  info: 'bg-blue-100 border-blue-200 text-blue-900',
                },
              }}
            />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}