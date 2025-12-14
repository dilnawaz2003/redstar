// lib/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  members: WorkspaceMember[];
  projects: Project[];
  _count: {
    members: number;
    projects: number;
  };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  user: User;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
  _count: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  createdAt: string;
  assignee?: User;
  project?: Project;
  activityLogs?: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  details: any;
  createdAt: string;
  user: User;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateWorkspaceRequest {
  name: string;
}

export interface AddMemberRequest {
  userId: string;
  role: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignedTo?: string;
  projectId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assignedTo?: string;
}

export interface GetTasksParams {
  project?: string;
  status?: string;
  assigned_to?: string;
  priority?: string;
}