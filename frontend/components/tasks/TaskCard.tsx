// components/tasks/TaskCard.tsx
'use client';

import { useState } from 'react';
import { useUpdateTaskMutation } from '@/lib/api/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: any;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColors = {
  todo: 'border-gray-300 dark:border-gray-700',
  in_progress: 'border-blue-300 dark:border-blue-700',
  review: 'border-yellow-300 dark:border-yellow-700',
  done: 'border-green-300 dark:border-green-700',
};

export default function TaskCard({ task }: TaskCardProps) {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await updateTask({
        id: task.id,
        status: newStatus,
      }).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card 
      className={cn(
        'border hover:shadow-md transition-shadow cursor-pointer',
        statusColors[task.status as keyof typeof statusColors],
        (isLoading || isUpdating) && 'opacity-50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
                Move to To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('review')}>
                Move to Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('done')}>
                Mark as Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge 
            className={cn(
              'text-xs font-medium',
              priorityColors[task.priority as keyof typeof priorityColors]
            )}
          >
            {task.priority}
          </Badge>

          <div className="flex items-center space-x-2">
            {task.dueDate && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}

            {task.assignee ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src="" alt={task.assignee.name} />
                <AvatarFallback className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <User className="h-3 w-3 mr-1" />
                Unassigned
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}