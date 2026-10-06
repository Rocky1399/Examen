import axios from 'axios';
import { http } from '../api/client';
import { logout } from '../features/auth/authSlice';
import type { AppStore } from './index';

export function setupInterceptors(store: AppStore) {
  http.interceptors.request.use((config) => {
    const { token } = store.getState().auth;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  http.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    },
  );
}