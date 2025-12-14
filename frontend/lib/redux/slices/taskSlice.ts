'use client';


// lib/redux/slices/taskSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Task } from '@/lib/types';

interface TaskState {
  selectedTask: Task | null;
  taskFilters: {
    status?: string;
    assigned_to?: string;
    priority?: string;
    search?: string;
  };
}

const initialState: TaskState = {
  selectedTask: null,
  taskFilters: {},
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    setTaskFilters: (state, action) => {
      state.taskFilters = { ...state.taskFilters, ...action.payload };
    },
    clearTaskFilters: (state) => {
      state.taskFilters = {};
    },
  },
});

export const { 
  setSelectedTask, 
  clearSelectedTask, 
  setTaskFilters, 
  clearTaskFilters 
} = taskSlice.actions;
export default taskSlice.reducer;