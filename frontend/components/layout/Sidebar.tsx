// components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { useGetWorkspacesQuery } from '@/lib/redux/api/apiSlice';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Home,
  FolderKanban,
  Users,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Briefcase, label: 'My Workspaces', href: '/workspaces' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: FileText, label: 'Documents', href: '/documents' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-red-100 dark:border-red-900/30 bg-white dark:bg-gray-900 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-red-100 dark:border-red-900/30">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Workspace
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-red-50 dark:hover:bg-red-950/50"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          <p className={cn(
            'px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2',
            collapsed && 'hidden'
          )}>
            Main
          </p>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start mb-1',
                  isActive && 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400',
                  collapsed && 'justify-center px-2'
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
                {!collapsed && item.label}
              </Button>
            );
          })}
        </div>

        <div className="px-3 mt-6">
          <div className={cn(
            'flex items-center justify-between px-3 mb-2',
            collapsed && 'hidden'
          )}>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Workspaces
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-red-50 dark:hover:bg-red-950/50"
              onClick={() => router.push('/workspace/new')}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-1 px-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-8 rounded animate-pulse bg-gray-200 dark:bg-gray-800',
                    collapsed ? 'w-8 mx-auto' : 'w-full'
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {workspaces.slice(0, 5).map((workspace) => {
                const isActive = pathname.includes(`/workspace/${workspace.id}`);
                const Icon = FolderKanban;
                
                return (
                  <Button
                    key={workspace.id}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start mb-1',
                      isActive && 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400',
                      collapsed && 'justify-center px-2'
                    )}
                    onClick={() => router.push(`/workspace/${workspace.id}`)}
                  >
                    <Icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
                    {!collapsed && (
                      <div className="flex-1 text-left truncate">
                        {workspace.name}
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({workspace._count?.projects || 0})
                        </span>
                      </div>
                    )}
                  </Button>
                );
              })}
              
              {workspaces.length > 5 && !collapsed && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => router.push('/workspaces')}
                >
                  <span className="ml-9 text-sm">View all ({workspaces.length})</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-red-100 dark:border-red-900/30 p-4">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            collapsed && 'justify-center'
          )}
          onClick={() => router.push('/settings')}
        >
          <Settings className={cn('h-4 w-4', !collapsed && 'mr-3')} />
          {!collapsed && 'Settings'}
        </Button>
      </div>
    </aside>
  );
}