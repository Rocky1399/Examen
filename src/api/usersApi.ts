import type { User } from '../types';
import { http } from './client';

interface UsersResponse {
  users: User[];
  total: number;
}

export async function getUsers(): Promise<User[]> {
  const { data } = await http.get<UsersResponse>('/users', {
    params: { limit: 0, select: 'firstName,lastName,username' },
  });
  return data.users;
}
