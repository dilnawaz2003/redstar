// components/tasks/TaskManager.tsx
'use client';

import { useState, useMemo } from 'react';
import TaskBoard from './TaskBoard';
import CreateTaskModal from './CreateTaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateTaskMutation, useGetTasksQuery } from '@/lib/api/apiSlice';
import TaskFilters from './TaskFilter';

interface TaskManagerProps {
  projectId: string;
  workspaceId: string;
  initialFilters?: any;
  onFilterChange?: (filters: any) => void;
}

export default function TaskManager({ 
  projectId, 
  workspaceId,
  initialFilters = {},
  onFilterChange 
}: TaskManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  
  const { 
    data: tasksData, 
    isLoading, 
    refetch
  } = useGetTasksQuery({ 
    project: projectId,
    ...filters 
  });

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  const tasks = useMemo(() => {
    if (!tasksData?.data) return [];
    return tasksData.data;
  }, [tasksData]);

  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter(task => task.status === 'todo'),
      in_progress: tasks.filter(task => task.status === 'in_progress'),
      review: tasks.filter(task => task.status === 'review'),
      done: tasks.filter(task => task.status === 'done'),
    };
  }, [tasks]);

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask({
        ...taskData,
        projectId,
      }).unwrap();
      toast.success('Task created successfully');
      setIsCreateModalOpen(false);
      refetch(); 
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to create task');
      console.error('Failed to create task:', error);
    }
  };

  const clearFilters = () => {
    setFilters({ project: projectId });
    if (onFilterChange) {
      onFilterChange({ project: projectId });
    }
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => key !== 'project' && filters[key]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <TaskFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          disabled={isLoading || isCreating}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TaskBoard 
          columns={tasksByStatus} 
        />
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        workspaceId={workspaceId}
        onSubmit={handleCreateTask}
        isSubmitting={isCreating}
      />
    </div>
  );
}