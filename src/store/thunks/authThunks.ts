import { createAsyncThunk } from '@reduxjs/toolkit';

import { setAuthToken, removeAuthToken } from '../../hooks/cookies';
import http from '../../services/http';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  logout
} from '../slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  token: string;
}
 
// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch }) => {
    try {
      dispatch(loginStart());

      const response: any = await http.post<LoginResponse>('/auth/login', credentials);
      const { user, token } = response.data;

      // Set token in cookie
      setAuthToken(token);

      dispatch(loginSuccess({ user, token }));
      return { user, token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { dispatch }) => {
    try {
      dispatch(registerStart());

      const response: any = await http.post<LoginResponse>('/auth/register', userData);
      const { user, token } = response.data;

      // Set token in cookie
      setAuthToken(token);

      dispatch(registerSuccess({ user, token }));
      return { user, token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(registerFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // Call logout endpoint if user is authenticated
      await http.post('/auth/logout');
    } catch (error) {
    } finally {
      // Remove token and clear state
      removeAuthToken();
      dispatch(logout());
    }
  }
);

// Update profile thunk
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<{ id: string; email: string; name: string; role?: string }>, { dispatch }) => {
    try {
      dispatch(updateProfileStart());

      const response = await http.put<{ user: { id: string; email: string; name: string; role?: string } }>('/auth/profile', userData);
      const { user }: any = response.data;

      dispatch(updateProfileSuccess(user));
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      dispatch(updateProfileFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
); 