import { useState, type FormEvent } from 'react';
import {
  login,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
        await dispatch(login({ username, password })).unwrap(); 
    } catch {

    }
  };

  if (isAuthenticated) return <Navigate to="/posts" replace />;

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="username">Usuario</label>
      <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label htmlFor="password">Contraseña</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}