'use client';


// lib/redux/slices/workspaceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workspace, WorkspaceMember } from '@/lib/types';

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  selectedWorkspaceId: string | null;
  workspaceFilters: {
    search?: string;
    sortBy?: 'name' | 'createdAt' | 'memberCount';
    sortOrder?: 'asc' | 'desc';
  };
  sidebarCollapsed: boolean;
  activeTab: 'overview' | 'projects' | 'members' | 'settings';
}

const initialState: WorkspaceState = {
  currentWorkspace: null,
  selectedWorkspaceId: null,
  workspaceFilters: {
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  sidebarCollapsed: false,
  activeTab: 'overview',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
      state.selectedWorkspaceId = action.payload.id;
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
      state.selectedWorkspaceId = null;
    },
    setSelectedWorkspaceId: (state, action: PayloadAction<string>) => {
      state.selectedWorkspaceId = action.payload;
    },
    
    // Filter actions
    setWorkspaceSearch: (state, action: PayloadAction<string>) => {
      state.workspaceFilters.search = action.payload;
    },
    setWorkspaceSort: (
      state, 
      action: PayloadAction<{ sortBy: 'name' | 'createdAt' | 'memberCount'; sortOrder?: 'asc' | 'desc' }>
    ) => {
      state.workspaceFilters.sortBy = action.payload.sortBy;
      if (action.payload.sortOrder) {
        state.workspaceFilters.sortOrder = action.payload.sortOrder;
      }
    },
    clearWorkspaceFilters: (state) => {
      state.workspaceFilters = {
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
    
    // UI state actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'overview' | 'projects' | 'members' | 'settings'>) => {
      state.activeTab = action.payload;
    },
    
    // Member actions (optimistic updates)
    addMemberOptimistic: (state, action: PayloadAction<WorkspaceMember>) => {
      if (state.currentWorkspace) {
        if (!state.currentWorkspace.members) {
          state.currentWorkspace.members = [];
        }
        state.currentWorkspace.members.push(action.payload);
        
        // Update member count
        if (state.currentWorkspace._count) {
          state.currentWorkspace._count.members = (state.currentWorkspace._count.members || 0) + 1;
        }
      }
    },
    removeMemberOptimistic: (state, action: PayloadAction<string>) => {
      if (state.currentWorkspace?.members) {
        state.currentWorkspace.members = state.currentWorkspace.members.filter(
          member => member.id !== action.payload
        );
        
        // Update member count
        if (state.currentWorkspace._count) {
          state.currentWorkspace._count.members = Math.max(
            0,
            (state.currentWorkspace._count.members || 0) - 1
          );
        }
      }
    },
    updateMemberRoleOptimistic: (
      state, 
      action: PayloadAction<{ memberId: string; role: 'owner' | 'admin' | 'member' }>
    ) => {
      if (state.currentWorkspace?.members) {
        const member = state.currentWorkspace.members.find(
          m => m.id === action.payload.memberId
        );
        if (member) {
          member.role = action.payload.role;
        }
      }
    },
    
    // Project actions (optimistic updates)
    addProjectOptimistic: (state, action: PayloadAction<any>) => {
      if (state.currentWorkspace) {
        if (!state.currentWorkspace.projects) {
          state.currentWorkspace.projects = [];
        }
        state.currentWorkspace.projects.unshift(action.payload);
        
        // Update project count
        if (state.currentWorkspace._count) {
          state.currentWorkspace._count.projects = (state.currentWorkspace._count.projects || 0) + 1;
        }
      }
    },
    removeProjectOptimistic: (state, action: PayloadAction<string>) => {
      if (state.currentWorkspace?.projects) {
        state.currentWorkspace.projects = state.currentWorkspace.projects.filter(
          project => project.id !== action.payload
        );
        
        // Update project count
        if (state.currentWorkspace._count) {
          state.currentWorkspace._count.projects = Math.max(
            0,
            (state.currentWorkspace._count.projects || 0) - 1
          );
        }
      }
    },
    
    // Reset state
    resetWorkspaceState: () => initialState,
  },
});

// Export actions
export const {
  setCurrentWorkspace,
  clearCurrentWorkspace,
  setSelectedWorkspaceId,
  
  setWorkspaceSearch,
  setWorkspaceSort,
  clearWorkspaceFilters,
  
  toggleSidebar,
  setSidebarCollapsed,
  setActiveTab,
  
  addMemberOptimistic,
  removeMemberOptimistic,
  updateMemberRoleOptimistic,
  
  addProjectOptimistic,
  removeProjectOptimistic,
  
  resetWorkspaceState,
} = workspaceSlice.actions;

// Export selectors
export const selectCurrentWorkspace = (state: { workspace: WorkspaceState }) => 
  state.workspace.currentWorkspace;

export const selectSelectedWorkspaceId = (state: { workspace: WorkspaceState }) => 
  state.workspace.selectedWorkspaceId;

export const selectWorkspaceFilters = (state: { workspace: WorkspaceState }) => 
  state.workspace.workspaceFilters;

export const selectSidebarCollapsed = (state: { workspace: WorkspaceState }) => 
  state.workspace.sidebarCollapsed;

export const selectActiveTab = (state: { workspace: WorkspaceState }) => 
  state.workspace.activeTab;

export const selectWorkspaceMembers = (state: { workspace: WorkspaceState }) => 
  state.workspace.currentWorkspace?.members || [];

export const selectWorkspaceProjects = (state: { workspace: WorkspaceState }) => 
  state.workspace.currentWorkspace?.projects || [];

export const selectWorkspaceStats = (state: { workspace: WorkspaceState }) => {
  const workspace = state.workspace.currentWorkspace;
  if (!workspace) return null;
  
  const totalTasks = workspace.projects?.reduce(
    (acc, project) => acc + (project._count?.tasks || 0),
    0
  ) || 0;
  
  return {
    memberCount: workspace._count?.members || 0,
    projectCount: workspace._count?.projects || 0,
    totalTasks,
    recentActivity: workspace.projects?.slice(0, 5).flatMap(project =>
      project.tasks?.slice(0, 3) || []
    ) || [],
  };
};

export default workspaceSlice.reducer;