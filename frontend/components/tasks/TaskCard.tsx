'use client';

import { useState } from 'react';
import { useUpdateTaskMutation, useDeleteTaskMutation } from '@/lib/api/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Calendar, User, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import { useParams } from 'next/navigation';

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
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const params = useParams()
  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      await updateTask({
        id: task.id,
        status: newStatus,
      }).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteTask = async () => {
      try {
        await deleteTask(task.id).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
  };

  const handleEditTask = async (data: any) => {
    try {
      await updateTask({
        id: task.id,
        ...data,
      }).unwrap();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  // Prepare initial data for the edit modal
  const getInitialEditData = () => ({
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    assignedTo: task.assignee?.id || task.assignedTo || undefined,
  });

  return (
    <>
      <Card 
        className={cn(
          'border hover:shadow-md transition-shadow',
          statusColors[task.status as keyof typeof statusColors],
          (isUpdatingTask || isUpdatingStatus || isDeleting) && 'opacity-50'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
              {task.title}
            </h3>
            <div className="flex items-center space-x-1">
              {/* Edit Button */}
              <button 
                onClick={() => setIsEditModalOpen(true)}
                disabled={isUpdatingTask || isDeleting}
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                aria-label="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              {/* Delete Button */}
              <button 
                onClick={handleDeleteTask}
                disabled={isUpdatingTask || isDeleting}
                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center ">
              {/* Status badges for quick status change */}
              {!['todo', 'in_progress', 'review', 'done'].includes(task.status) ? null : (
                <div className="flex items-center ">
                  {/* <Badge
                    onClick={() => handleStatusChange('todo')}
                    className={cn(
                      'text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity',
                      task.status === 'todo' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    )}
                    variant="outline"
                  >
                    To Do
                  </Badge>
                  <Badge
                    onClick={() => handleStatusChange('in_progress')}
                    className={cn(
                      'text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity',
                      task.status === 'in_progress' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    )}
                    variant="outline"
                  >
                    In Progress
                  </Badge>
                  <Badge
                    onClick={() => handleStatusChange('done')}
                    className={cn(
                      'text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity',
                      task.status === 'done' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    )}
                    variant="outline"
                  >
                    Done
                  </Badge> */}
                </div>
              )}
              
              {/* Priority Badge */}
              <Badge 
                className={cn(
                  'text-xs font-medium',
                  priorityColors[task.priority as keyof typeof priorityColors]
                )}
              >
                {task.priority}
              </Badge>
            </div>

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

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <CreateTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          projectId={task.projectId}
          workspaceId={params.id as string}
          onSubmit={handleEditTask}
          isSubmitting={isUpdatingTask}
          initialData={getInitialEditData()}
          isEditMode={true}
        />
      )}
    </>
  );
}