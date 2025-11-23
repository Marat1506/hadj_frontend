import {useCallback, useEffect, useState} from 'react';

import http from '@/services/http';
import {useAppDispatch} from '@/store/hooks';
import {logoutUser} from '@/store/slices/authSlice';

import {getAuthToken, setAuthToken} from './cookies';

interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface LoginResponse {
    user: User;
    token: string;
    message?: string;
}

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    // Initialize auth state on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = getAuthToken();

                if (token) {
                    setAuthState({
                        user: null, // User data will be fetched on demand or from token payload if available
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    setAuthState(prev => ({
                        ...prev,
                        isLoading: false,
                    }));
                }
            } catch (error) {
                setAuthState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: 'Failed to initialize authentication',
                });
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
        setAuthState(prev => ({...prev, isLoading: true, error: null}));

        try {
            const response = await http.post<LoginResponse>('/auth/login', credentials);
            const {user, token} = response.data;

            // Set token in cookie
            setAuthToken(token);

            // Update auth state
            setAuthState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            return false;
        }
    }, []);

    // Logout function
    const logout = useCallback(async (): Promise<void> => {
        try {
            // Dispatch the Redux logoutUser thunk
            dispatch(logoutUser());
        } catch (error) {
        }
    }, [dispatch]);

    // Register function
    const register = useCallback(async (userData: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<boolean> => {
        setAuthState(prev => ({...prev, isLoading: true, error: null}));

        try {
            const response = await http.post<LoginResponse>('/auth/register', userData);
            const {user, token} = response.data;

            // Set token in cookie
            setAuthToken(token);

            // Update auth state
            setAuthState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            return false;
        }
    }, []);

    // Refresh token function
    const refreshToken = useCallback(async (): Promise<boolean> => {
        console.log('jjjj')
        try {
            const response = await http.post<{ token: string }>('/users/refresh');
            const {token} = response.data;

            // Update token in cookie
            setAuthToken(token);

            // Update auth state
            setAuthState(prev => ({
                ...prev,
                token,
            }));

            return true;
        } catch (error) {
            // Refresh failed, logout user
            await logout();
            return false;
        }
    }, [logout]);

    // Update user profile
    const updateProfile = useCallback(async (userData: Partial<User>): Promise<boolean> => {
        try {
            const response = await http.put<{ user: User }>('/auth/profile', userData);
            const {user} = response.data;

            setAuthState(prev => ({
                ...prev,
                user,
            }));

            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            setAuthState(prev => ({
                ...prev,
                error: errorMessage,
            }));
            return false;
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setAuthState(prev => ({...prev, error: null}));
    }, []);

    return {
        // State
        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        error: authState.error,

        // Actions
        login,
        logout,
        register,
        refreshToken,
        updateProfile,
        clearError,
    };
};
