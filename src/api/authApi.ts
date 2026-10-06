import type { AuthUser, Credentials } from '../types';
import { http } from './client';

interface LoginResponse extends AuthUser {
  accessToken: string;
  token?: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export async function loginRequest(credentials: Credentials): Promise<LoginResult> {
  const { data } = await http.post<LoginResponse>('/auth/login', {
    ...credentials,
    expiresInMin: 60,
  });

  const token = data.accessToken ?? data.token;
  if (!token) throw new Error('La API no devolvio un token');
  const { id, username, email, firstName, lastName, image } = data;
  return { token, user: { id, username, email, firstName, lastName, image } };
}

export async function getMeRequest(): Promise<AuthUser> {
  const { data } = await http.get<AuthUser>('/auth/me');
  return data;
}
