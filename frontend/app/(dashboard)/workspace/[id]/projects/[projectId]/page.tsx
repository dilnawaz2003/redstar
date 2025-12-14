// app/(dashboard)/workspace/[id]/projects/[projectId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Users, FileText, BarChart, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import TaskManager from '@/components/tasks/TaskManager';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { useGetProjectByIdQuery, useGetTasksQuery } from '@/lib/api/apiSlice';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const projectId = params.projectId as string;

  // Use RTK Query hooks
  const { 
    data,
    isLoading: projectLoading, 
    error: projectError 
  } = useGetProjectByIdQuery(projectId);

  const { 
    data:tasksData,
    isLoading: tasksLoading, 
    error: tasksError,
  } = useGetTasksQuery({ project: projectId });


  const project = data?.data;
  const tasks = tasksData?.data;

  const isLoading = projectLoading || tasksLoading;
  const error = projectError || tasksError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load project. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Project not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Button
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workspace
        </Button>
      </div>
    );
  }

  const taskStats = {
    total: tasks?.length,
    todo: tasks?.filter(task => task.status === "todo").length,
    inProgress: tasks?.filter(task => task.status === "in_progress").length,
    review:tasks?.filter(task => task.status === "review").length,
    done: tasks?.filter(task => task.status === "done").length,
    // progress:  projectStats?.progress || 0,
    progress:  0,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/workspace/${workspaceId}`)}
            className="hover:bg-red-50 dark:hover:bg-red-950/50"
          >
            <ArrowLeft className="h-5 w-5 text-red-600 dark:text-red-400" />
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
                {project.workspace?.name || 'Workspace'}
              </Badge>
            </div>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {project.description}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {taskStats.total} tasks
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {taskStats.progress}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
          </div>
          <div className="relative h-12 w-12">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${taskStats.progress}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Task Board</CardTitle>
                <CardDescription>
                  Manage and track all tasks in this project
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
                  {taskStats.total} Tasks
                </Badge>
                <Badge 
                  variant="secondary" 
                  // className={taskStats.total > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                >
                  {taskStats.done} Completed
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             <TaskManager 
              projectId={projectId} 
              workspaceId={workspaceId}
              initialFilters={{ project: projectId }}
            />
          </CardContent>
        </Card>

        {/* Sidebar */}
        <ProjectSidebar 
          project={project} 
          taskStats={taskStats as any} 
          // workspaceId={workspaceId as any}
        />
      </div>

      {/* Mobile Progress Indicator */}
      <div className="md:hidden">
        <Card className="border-red-100 dark:border-red-900/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {taskStats.progress}%
                </div>
              </div>
              <div className="h-12 w-12">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient-mobile)"
                    strokeWidth="3"
                    strokeDasharray={`${taskStats.progress}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {taskStats.total}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {taskStats.done}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}