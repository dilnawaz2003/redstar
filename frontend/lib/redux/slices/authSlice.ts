'use client';

// lib/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/lib/types';
import { api } from '@/lib/api/apiSlice';

interface AuthState {
  user: User | null;
  token: string | null;
}

const safeParse = <T>(value: string | null): T | null => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? safeParse<User>(localStorage.getItem("user"))
      : null,
  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
 extraReducers: (builder) => {
  builder
    .addMatcher(
      api.endpoints.getCurrentUser.matchFulfilled,
      (state, { payload }) => {

        if (payload?.success) {
          state.user = payload.data;
          localStorage.setItem('user', JSON.stringify(payload.data));
        } else {
          state.user = null;
        }
      }
    )
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;