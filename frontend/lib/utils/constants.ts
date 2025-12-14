// lib/utils/constants.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const TASK_STATUSES = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'review', label: 'Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
] as const;

export const USER_ROLES = [
  { value: 'owner', label: 'Owner', icon: '👑' },
  { value: 'admin', label: 'Admin', icon: '🛡️' },
  { value: 'member', label: 'Member', icon: '👤' },
] as const;

export const ACTIVITY_TYPES = [
  { value: 'created', label: 'Created', icon: '➕' },
  { value: 'updated', label: 'Updated', icon: '✏️' },
  { value: 'status_changed', label: 'Status Changed', icon: '🔄' },
  { value: 'assigned', label: 'Assigned', icon: '👥' },
  { value: 'completed', label: 'Completed', icon: '✅' },
  { value: 'deleted', label: 'Deleted', icon: '🗑️' },
] as const;

export const NAVIGATION_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/workspaces', label: 'Workspaces', icon: '🏢' },
  { href: '/projects', label: 'Projects', icon: '📁' },
  { href: '/tasks', label: 'My Tasks', icon: '✅' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
] as const;