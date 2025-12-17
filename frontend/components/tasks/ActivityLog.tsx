// components/tasks/ActivityLog.tsx
'use client';

import { useGetTaskActivityLogsQuery } from '@/lib/api/apiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { 
  PlusCircle, 
  Edit, 
  CheckCircle, 
  UserPlus, 
  Archive,
  ArrowRight,
  Clock
} from 'lucide-react';

interface ActivityLogProps {
  taskId: string;
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'created':
      return PlusCircle;
    case 'updated':
      return Edit;
    case 'status_changed':
      return ArrowRight;
    case 'assigned':
      return UserPlus;
    case 'completed':
      return CheckCircle;
    case 'deleted':
      return Archive;
    default:
      return Clock;
  }
};

const getActivityColor = (action: string) => {
  switch (action) {
    case 'created':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
    case 'updated':
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
    case 'status_changed':
      return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
    case 'assigned':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    case 'completed':
      return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
  }
};

export default function ActivityLog({ taskId }: ActivityLogProps) {
  const { data: logs = [], isLoading } = useGetTaskActivityLogsQuery(taskId);

  if (isLoading) {
    return (
      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
            <p>No activity yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-100 dark:border-red-900/30">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => {
            const Icon = getActivityIcon(log.action);
            const colorClass = getActivityColor(log.action);
            
            return (
              <div key={log.id} className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-linear-to-r from-red-600 to-red-700 text-white">
                      {log.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.user.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {log.action.replace('_', ' ')}
                        {log.details?.changes?.status && (
                          <span className="ml-1">
                            from <span className="font-medium">{log.details.changes.status.from}</span> to{' '}
                            <span className="font-medium">{log.details.changes.status.to}</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {log.details?.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      "{log.details.title}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}