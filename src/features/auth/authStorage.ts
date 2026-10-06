import type { AuthUser } from '../../types';

export const AUTH_STORAGE_KEY = 'Examen/auth';

export interface PersistedAuth {
  token: string;
  user: AuthUser | null;
}

export const authStorage = {
  load(): PersistedAuth | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PersistedAuth) : null;
    } catch {
      return null; // JSON corrupto o localStorage bloqueado
    }
  },
  save(auth: PersistedAuth) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  },
  clear() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
