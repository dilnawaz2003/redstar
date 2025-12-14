// app/(dashboard)/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, FolderKanban, CheckCircle, AlertCircle } from 'lucide-react';
import CreateWorkspaceModal from '@/components/workspace/CreateWorkspaceModal';
import WorkspaceCard from '@/components/workspace/WorkspaceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetWorkspacesQuery } from '@/lib/api/apiSlice';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useGetWorkspacesQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  const workspaces = data?.data;
  const stats = [
    {
      title: 'Total Workspaces',
      value: workspaces?.length?.toString() || '0',
      icon: FolderKanban,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Team Members',
      value: workspaces?.reduce((acc, ws) => acc + (ws._count?.members || 0), 0).toString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Active Projects',
      value: workspaces?.reduce((acc, ws) => acc + (ws._count?.projects || 0), 0).toString() || '0',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  console.log("IS Loading : ",isLoading)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-900">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>Error loading workspaces</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your workspaces and collaborate with your team
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-red-100 dark:border-red-900/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-red-50 dark:bg-red-950/50">
            <TabsTrigger value="all">All Workspaces</TabsTrigger>
            <TabsTrigger value="owned">Owned</TabsTrigger>
            <TabsTrigger value="member">Member</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          {!workspaces?.length ? (
            <Card className="border-dashed border-2 border-red-200 dark:border-red-900">
              <CardContent className="pt-6 text-center">
                <FolderKanban className="h-12 w-12 text-red-300 dark:text-red-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No workspaces yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first workspace to start collaborating
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workspace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateWorkspaceModal
        onSuccess={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}