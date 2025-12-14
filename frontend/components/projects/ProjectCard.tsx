// components/projects/ProjectCard.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Calendar, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: any;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const totalTasks = project._count?.tasks || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status === 'done').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card 
      className="border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors">
              <FolderKanban className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {project.description || 'No description'}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
            {totalTasks} tasks
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              {format(new Date(project.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                {completedTasks}
              </div>
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <Clock className="h-4 w-4 mr-1" />
                {totalTasks - completedTasks}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}