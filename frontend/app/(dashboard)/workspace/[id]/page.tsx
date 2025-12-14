// app/(dashboard)/workspace/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Settings, FolderKanban } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useGetProjectsQuery, useGetWorkspaceByIdQuery } from '@/lib/api/apiSlice';
import CreateProjectModal from '@/components/projects/CreateprojectModal';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  
  const { user } = useAppSelector((state) => state.auth);
  const { 
    data:workspaceData, 
    isLoading: workspaceLoading 
  } = useGetWorkspaceByIdQuery(workspaceId, {
    skip: !workspaceId,
  });

  const workspace = workspaceData?.data;
  
  const { 
    data, 
    isLoading: projectsLoading 
  } = useGetProjectsQuery({ workspaceId }, {
    skip: !workspaceId,
  });

  const projects = data?.data || [];

  const isLoading = workspaceLoading || projectsLoading;

  console.log('is laoding : ',isLoading)

  if (isLoading || !workspace) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const memberRole = workspace.members?.find(
    (m) => m.userId === user?.id
  )?.role;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {workspace.name}
            </h1>
            <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              {memberRole}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Created on {format(new Date(workspace.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <CreateProjectModal
            workspaceId={workspaceId}
            trigger={
              <Button className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            }
          />
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage and track all projects in this workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderKanban className="h-12 w-12 text-red-300 dark:text-red-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first project to start organizing tasks
                </p>
                <CreateProjectModal
                  workspaceId={workspaceId}
                  trigger={
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => router.push(`/workspace/${workspaceId}/projects/${project.id}`)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <WorkspaceSidebar workspace={workspace} />
      </div>
    </div>
  );
}