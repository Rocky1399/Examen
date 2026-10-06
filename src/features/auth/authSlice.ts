import { createSlice } from '@reduxjs/toolkit';
import { loginRequest, type LoginResult } from '../../api/authApi';
import { createAppAsyncThunk } from '../../store/createAppAsyncThunk';
import type { RootState } from '../../store';
import type { AuthUser, Credentials, RequestStatus } from '../../types';
import { authStorage } from './authStorage';

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: RequestStatus;
  error: string | null;
}

function loadInitialState(): AuthState {
  const persisted = authStorage.load();
  return {
    token: persisted?.token ?? null,
    user: persisted?.user ?? null,
    status: 'idle',
    error: null,
  };
}

export const login = createAppAsyncThunk<LoginResult, Credentials>(
  'auth/login', //                       ↑ lo que devuelve  ↑ lo que recibe
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginRequest(credentials); // → login.fulfilled (payload = esto)
    } catch {
      return rejectWithValue('Usuario o contraseña incorrectos.'); // → login.rejected
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.token = null;
        state.error = action.payload ?? 'No se pudo iniciar sesión.';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.token !== null;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
