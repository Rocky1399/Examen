import axios from 'axios';

export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});
