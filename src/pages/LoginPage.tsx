import { useState, type FormEvent } from 'react';
import {
  login,
  logout,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const user = useAppSelector((state) => state.auth.user);

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
        await dispatch(login({ username, password })).unwrap(); 
    } catch {

    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Sesión iniciada como {user?.firstName} {user?.lastName}</p>
        <button onClick={() => dispatch(logout())}>Salir</button>
      </div>
    );
  }

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