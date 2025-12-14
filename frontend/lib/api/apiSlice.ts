'use client';


// lib/redux/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  User, 
  Workspace, 
  WorkspaceMember, 
  Project, 
  Task, 
  ActivityLog,
  LoginRequest,
  RegisterRequest,
  CreateWorkspaceRequest,
  AddMemberRequest,
  CreateProjectRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksParams
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle 401 errors globally
    if (result.error?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return result;
  },
  tagTypes: ['Auth', 'Workspace', 'Project', 'Task', 'Activity'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<{ data:{user: User; token: string }}, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<{ data:{user: User; token: string} }, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    // Workspace endpoints
    getWorkspaces: builder.query<{data:Workspace[]}, void>({
      query: () => '/workspaces',
      providesTags: (result) =>
        result
          ? [
              ...result?.data?.map(({ id }) => ({ type: 'Workspace' as const, id })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }],
    }),
    getWorkspaceById: builder.query<{data:Workspace}, string>({
      query: (id) => `/workspaces/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workspace', id }],
    }),
    createWorkspace: builder.mutation<Workspace, CreateWorkspaceRequest>({
      query: (workspace) => ({
        url: '/workspaces',
        method: 'POST',
        body: workspace,
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),
    addMember: builder.mutation<WorkspaceMember, AddMemberRequest & { workspaceId: string }>({
      query: ({ workspaceId, ...memberData }) => ({
        url: `/workspaces/${workspaceId}/members`,
        method: 'POST',
        body: memberData,
      }),
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'Workspace', id: workspaceId },
      ],
    }),
    getWorkspaceMembers: builder.query<WorkspaceMember[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/members`,
      providesTags: (result, error, workspaceId) => [
        { type: 'Workspace', id: workspaceId },
      ],
    }),

    // Project endpoints
    getProjects: builder.query<{data:Project[]}, { workspaceId: string }>({
      query: ({ workspaceId }) => `/projects?workspace=${workspaceId}`,
      providesTags: (result) =>
        result
          ? [
              ...result?.data?.map(({ id }) => ({ type: 'Project' as const, id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    getProjectById: builder.query<{data:Project}, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    // Task endpoints
    getTasks: builder.query<{data:Task[]}, GetTasksParams>({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result?.data?.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation<Task, UpdateTaskRequest & { id: string }>({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: task,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),
    deleteTask: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    getTaskActivityLogs: builder.query<ActivityLog[], string>({
      query: (taskId) => `/tasks/${taskId}/logs`,
      providesTags: (result, error, taskId) => [
        { type: 'Activity', id: taskId },
      ],
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  
  // Workspace
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useAddMemberMutation,
  useGetWorkspaceMembersQuery,
  
  // Project
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetProjectByIdQuery,
  
  // Task
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskActivityLogsQuery,
} = api;