// components/projects/ProjectSidebar.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProjectSidebarProps {
  project: any;
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
  };
}

export default function ProjectSidebar({ project, taskStats }: ProjectSidebarProps) {
  const progress = taskStats.total > 0 
    ? Math.round((taskStats.done / taskStats.total) * 100) 
    : 0;

  const members = [
    { id: 1, name: 'You', role: 'Admin', avatar: 'Y' },
    { id: 2, name: 'Alex Johnson', role: 'Member', avatar: 'AJ' },
    { id: 3, name: 'Sarah Miller', role: 'Member', avatar: 'SM' },
  ];

  const recentActivities = [
    { id: 1, user: 'You', action: 'created task', task: 'Design review', time: '2 hours ago' },
    { id: 2, user: 'Alex Johnson', action: 'updated task', task: 'API integration', time: '4 hours ago' },
    { id: 3, user: 'Sarah Miller', action: 'completed task', task: 'User testing', time: '1 day ago' },
  ];

  return (
    <div className="space-y-4">
      {/* Project Stats */}
      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Created</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {format(new Date(project.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
              </div>
              <div className="h-2 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    progress >= 75 ? 'bg-green-500' :
                    progress >= 50 ? 'bg-yellow-500' :
                    progress >= 25 ? 'bg-orange-500' : 'bg-red-500'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Stats */}
      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Task Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">To Do</span>
            </div>
            <Badge variant="outline" className="border-gray-200 text-gray-700 dark:border-gray-800">
              {taskStats.todo}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
            </div>
            <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800">
              {taskStats.inProgress}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Review</span>
            </div>
            <Badge variant="outline" className="border-yellow-200 text-yellow-700 dark:border-yellow-800">
              {taskStats.review}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Done</span>
            </div>
            <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800">
              {taskStats.done}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members
            </CardTitle>
            <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              {members.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}