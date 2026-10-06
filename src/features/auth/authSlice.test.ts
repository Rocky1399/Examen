import { describe, expect, it } from 'vitest';
import type { AuthUser } from '../../types';
import authReducer, { login, logout, type AuthState } from './authSlice';

const user: AuthUser = {
  id: 1,
  username: 'emilys',
  email: 'emily@x.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  image: '',
};
const credentials = { username: 'emilys', password: 'emilyspass' };
const loggedOut: AuthState = { token: null, user: null, status: 'idle', error: null };

describe('authSlice', () => {
  it('login.fulfilled guarda el token y el usuario', () => {
    const action = login.fulfilled({ token: 'abc', user }, 'req-1', credentials);
    const state = authReducer(loggedOut, action);

    expect(state.token).toBe('abc');
  });

  it('login.rejected no guarda token y guarda el error', () => {
    const action = login.rejected(null, 'req-1', credentials, 'Usuario o contraseña incorrectos.');
    const state = authReducer(loggedOut, action);
  });

  it('logout limpia la sesión', () => {
  });
});