// components/projects/CreateProjectModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProjectMutation } from '@/lib/api/apiSlice';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
});

interface CreateProjectModalProps {
  workspaceId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function CreateProjectModal({ 
  workspaceId, 
  trigger,
  onSuccess 
}: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createProject({
        ...data,
        workspaceId,
      }).unwrap();
      
      toast.success('Project created successfully');
      reset();
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Failed to create project:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
            Create Project
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-1/2 border-red-200 dark:border-red-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Project
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter project name"
              className="border-red-200 focus:border-red-500 dark:border-red-900"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your project"
              className="border-red-200 focus:border-red-500 dark:border-red-900"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}