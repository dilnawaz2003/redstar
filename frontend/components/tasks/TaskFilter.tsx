// components/tasks/TaskFilters.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TaskFiltersProps {
  filters: {
    status?: string;
    assigned_to?: string;
    priority?: string;
    search?: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export default function TaskFilters({ 
  filters, 
  onFilterChange,
  onClearFilters,
  hasActiveFilters = false 
}: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (value: string) => {
    setSearch(value);
    onFilterChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({ ...filters, priority: value });
  };

  const handleAssignedToChange = (value: string) => {
    onFilterChange({ ...filters, assigned_to: value });
  };

  const clearFilters = () => {
    setSearch('');
    onFilterChange({
      status: '',
      assigned_to: '',
      priority: '',
      search: '',
    });
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 border-red-200 focus:border-red-500 dark:border-red-900"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400',
            showFilters && 'bg-red-50 dark:bg-red-900/50'
          )}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 h-2 w-2 bg-red-600 rounded-full"></span>
          )}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-red-100 dark:border-red-900/30 rounded-lg bg-red-50/50 dark:bg-red-950/20">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">
              Status
            </Label>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="border-red-200 dark:border-red-900">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">
              Priority
            </Label>
            <Select value={filters.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="border-red-200 dark:border-red-900">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_to" className="text-gray-700 dark:text-gray-300">
              Assigned To
            </Label>
            <Select value={filters.assigned_to} onValueChange={handleAssignedToChange}>
              <SelectTrigger className="border-red-200 dark:border-red-900">
                <SelectValue placeholder="All assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Assignees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="me">Assigned to me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              Status: {filters.status}
              <button
                onClick={() => handleStatusChange('')}
                className="ml-1 hover:text-red-900 dark:hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.priority && (
            <Badge variant="secondary" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              Priority: {filters.priority}
              <button
                onClick={() => handlePriorityChange('')}
                className="ml-1 hover:text-red-900 dark:hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.assigned_to && (
            <Badge variant="secondary" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              Assigned: {filters.assigned_to === 'me' ? 'Me' : 'Unassigned'}
              <button
                onClick={() => handleAssignedToChange('')}
                className="ml-1 hover:text-red-900 dark:hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.search && (
            <Badge variant="secondary" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              Search: "{filters.search}"
              <button
                onClick={() => handleSearch('')}
                className="ml-1 hover:text-red-900 dark:hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}