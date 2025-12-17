'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useGetWorkspaceMembersQuery } from '@/lib/api/apiSlice';

const taskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assignedTo: z.string().optional(),
});

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  workspaceId: string;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  initialData?: any;
  isEditMode?: boolean;
}

export default function CreateTaskModal({ 
  isOpen, 
  onClose, 
  projectId,
  workspaceId,
  onSubmit,
  isSubmitting,
  initialData,
  isEditMode = false
}: CreateTaskModalProps) {
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      status: 'todo' as const,
      priority: 'medium' as const,
      assignedTo: undefined as string | undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as any, initialData[key]);
      });
      if (initialData.dueDate) {
        setDate(new Date(initialData.dueDate));
      }
    }
  }, [initialData, setValue]);

  const { data, isLoading: isLoadingMembers } = useGetWorkspaceMembersQuery(workspaceId, {
    skip: !workspaceId,
  });

  const members = data?.data;

  const handleFormSubmit = async (data: any) => {
    try {
      const taskData = {
        ...data,
        dueDate: date ? format(date, 'yyyy-MM-dd') : undefined,
        projectId,
      };
      await onSubmit(taskData);
      if (!isEditMode) {
        reset();
        setDate(undefined);
      }
    } catch (error) {
      console.error('Failed to submit task:', error);
    }
  };

  const statusValue = watch('status');
  const priorityValue = watch('priority');
  const assignedToValue = watch('assignedTo');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-1/2 border-red-200 dark:border-red-900"
        aria-describedby="task-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription id="task-modal-description">
            {isEditMode ? 'Update the task details below' : 'Fill in the details below to create a new task'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter task title"
              className={cn(
                'border-red-200 focus:border-red-500 dark:border-red-900',
                errors.title && 'border-red-500'
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{`${errors?.title?.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter task description"
              className="border-red-200 focus:border-red-500 dark:border-red-900"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={statusValue} 
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger className="border-red-200 dark:border-red-900 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priorityValue} 
                onValueChange={(value) => setValue('priority', value as any)}
              >
                <SelectTrigger className="border-red-200 dark:border-red-900 w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-red-200 dark:border-red-900",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select 
                value={assignedToValue} 
                onValueChange={(value) => setValue('assignedTo', value)}
              >
                <SelectTrigger className="border-red-200 dark:border-red-900 w-full">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {isLoadingMembers ? (
                    <SelectItem value="loading" disabled>Loading members...</SelectItem>
                  ) : (
                   members && members?.map((member) => {
                      const memberId = member.userId || member.id;
                      const memberName = member.user?.name || 'Unknown Member';
                      return (
                        <SelectItem key={memberId} value={memberId}>
                          {memberName}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingMembers}
              className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Task' : 'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}