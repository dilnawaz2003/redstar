'use client';

// lib/redux/slices/projectSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Project } from '@/lib/types';

interface ProjectState {
  currentProject: Project | null;
}

const initialState: ProjectState = {
  currentProject: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
});

export const { setCurrentProject, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;