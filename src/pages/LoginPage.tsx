import { useState, type FormEvent } from 'react';
import {
  login,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/posts';

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(login({ username, password })).unwrap();
    } catch {
      // El mensaje de error ya quedó en state.auth.error y se muestra en el formulario
    }
  };

  if (isAuthenticated) return <Navigate to={from} replace />;

  return (
    <main className="min-h-screen flex align-items-center justify-content-center p-3">
      <Card className="w-full" style={{ maxWidth: '24rem' }}>
        <div className="text-center mb-4">
          <i className="pi pi-book text-primary text-4xl" />
          <h1 className="text-2xl font-semibold mt-2 mb-1">Iniciar sesión</h1>
          <p className="text-color-secondary m-0">Gestor de publicaciones</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-column gap-3">
          <div className="flex flex-column gap-2">
            <label htmlFor="username">Usuario</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="password">Contraseña</label>
            <Password
              inputId="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              autoComplete="current-password"
              className="w-full"
              inputClassName="w-full"
            />
          </div>

          {error && <Message severity="error" text={error} />}

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            loading={status === 'loading'}
          />
        </form>

        <p className="text-sm text-color-secondary mt-4 mb-0">
          Usuario de prueba: <strong>emilys</strong> / <strong>emilyspass</strong>
        </p>
      </Card>
    </main>
  );
}
