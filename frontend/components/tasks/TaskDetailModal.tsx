// components/tasks/TaskDetailModal.tsx
'use client';

import { useState } from 'react';
import { 
  useGetTaskByIdQuery, 
  useUpdateTaskMutation,
  useDeleteTaskMutation 
} from '@/lib/api/apiSlice';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar, 
  User, 
  FileText, 
  Tag,
  Clock,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import ActivityLog from './ActivityLog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TaskDetailModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: () => void;
}

export default function TaskDetailModal({ 
  taskId, 
  isOpen, 
  onClose,
  onTaskUpdated 
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  const { data: task, isLoading } = useGetTaskByIdQuery(taskId, {
    skip: !taskId,
  });
  
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assignedTo: '',
  });

  const handleEdit = () => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateTask({
        id: taskId,
        ...formData,
      }).unwrap();
      
      toast.success('Task updated successfully');
      setIsEditing(false);
      
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success('Task deleted successfully');
      onClose();
      
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Failed to delete task:', error);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  if (isLoading || !task) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-red-200 dark:border-red-900">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Task' : 'Task Details'}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(true)}
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Saving...' : 'Save'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {deleteConfirm && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Are you sure you want to delete this task?</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirm(false)}
                  className="border-white text-white hover:bg-red-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-red-200 focus:border-red-500 dark:border-red-900"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-red-200 focus:border-red-500 dark:border-red-900 min-h-30"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="border-red-200 dark:border-red-900">
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
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger className="border-red-200 dark:border-red-900">
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {task.title}
                  </h2>
                  {task.description && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {task.description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center text-gray-600 dark:text-gray-400">
                      <Tag className="h-4 w-4 mr-2" />
                      Status
                    </Label>
                    <Badge variant="outline" className="capitalize">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center text-gray-600 dark:text-gray-400">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Priority
                    </Label>
                    <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due Date
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      Created
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(task.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Activity Log */}
            <ActivityLog taskId={taskId} />
          </div>
          
          {/* Right Column - Assignee & Project */}
          <div className="space-y-6">
            {/* Assignee */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <Label className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                <User className="h-4 w-4 mr-2" />
                Assignee
              </Label>
              
              {isEditing ? (
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                >
                  <SelectTrigger className="border-red-200 dark:border-red-900">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {/* Add workspace members here */}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center space-x-3">
                  {task.assignee ? (
                    <>
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                          {task.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {task.assignee.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {task.assignee.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <User className="h-8 w-8 mx-auto mb-2" />
                      <p>Unassigned</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Project Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <Label className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                <FileText className="h-4 w-4 mr-2" />
                Project
              </Label>
              
              {task.project && (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {task.project.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.project.workspace?.name || 'Workspace'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Task ID */}
            <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
              <Label className="text-gray-600 dark:text-gray-400 mb-2 block">
                Task ID
              </Label>
              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {task.id}
              </code>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}