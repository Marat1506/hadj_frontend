import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {PURGE} from 'redux-persist/es/constants';
import {getCookie} from "@/hooks/cookies";

interface User {
    id: number;
    phone: string;
    password?: string;
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string;
    gender: string;
    foreignLastName: string;
    foreignFirstName: string;
    citizenship: string;
    issueCountry: string;
    issueDate: string;
    passportNumber: string;
    expiryDate: string;
    fms: string;
    russianPassportNumber: string;
    passportTerm: string;
    russianExpiryDate: string;
    issuedBy: string;
    issuedDate: string;
    departmentCode: string;
    residence: string;
    snils: string;
    inn: string;
    postalCode: string;
    region: string;
    district: string;
    street: string;
    house: string;
    building: string;
    structure: string;
    apartment: string;
    foreignPassportFile: string;
    russianPassportFile: string;
    visaPhotoFile: string;
    selfieWithPassportFile: string;
    foreignPassportFileUrl: string;
    russianPassportFileUrl: string;
    visaPhotoFileUrl: string;
    selfieWithPassportFileUrl: string;
    roles: string[];
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    success: false,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


// Async Thunks
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: FormData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/registration`, userData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { phone: string; password: string }, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, {dispatch}) => {
        // Clear token cookie (replace 'token' with your actual cookie name)
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Clear Redux state
        dispatch({type: PURGE});

        return true;
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/refresh`);
            return response.data.accessToken;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (passwords: { oldPassword: string; newPassword: string }, {rejectWithValue, getState}) => {
        const token = getCookie('token');
        try {
            await axios.post(`${API_BASE_URL}/users/resetPassword`, passwords, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, {rejectWithValue, getState}) => {
        try {
            const token = getCookie('token');
            const response = await axios.get(`${API_BASE_URL}/users/findMe`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData: Partial<User>, {rejectWithValue, getState}) => {
        try {
            const token = getCookie('token');
            const response = await axios.put(`${API_BASE_URL}/users/update`, userData, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login actions
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;
        },

        // Logout action
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
            state.isLoading = false;
        },

        // Clear success
        clearSuccess: (state) => {
            state.success = false;
        },

        // Register actions
        registerStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        registerSuccess: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.error = null;
        },
        registerFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;
        },

        // Update profile actions
        updateProfileStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        updateProfileSuccess: (state, action: PayloadAction<User>) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
        },
        updateProfileFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set loading
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Initialize auth from persisted state
        initializeAuth: (state: any, action: PayloadAction<{ accessToken: string }>) => {
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
                state.success = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.error = null;
                state.success = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = null;
                state.isLoading = false;
                state.success = false;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.success = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
                state.success = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(PURGE, (state) => {
                // Clear all state on PURGE action (e.g., logout)
                return {...initialState};
            });
    },
});
export const {
    clearError,
    initializeAuth,
    loginFailure,
    loginStart,
    loginSuccess,
    logout,
    registerFailure,
    registerStart,
    registerSuccess,
    setLoading,
    updateProfileFailure,
    updateProfileStart,
    updateProfileSuccess,
    clearSuccess,
} = authSlice.actions;

export default authSlice.reducer;
