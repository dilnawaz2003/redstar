'use client';

// lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice'; // Updated slice
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import { api } from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer, // Updated
    project: projectReducer,
    task: taskReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['api/executeQuery/fulfilled', 'api/executeQuery/rejected'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['api.queries', 'api.mutations'],
      },
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);