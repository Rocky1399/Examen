import { Button } from 'primereact/button';
import { NavLink, Outlet } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function AppLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <header className="flex align-items-center justify-content-between p-3 border-bottom-1 surface-border">
        <nav className="flex gap-3">
          <NavLink to="/posts">Publicaciones</NavLink>
        </nav>

        <div className="flex align-items-center gap-2">
          <span>
            {user?.firstName} {user?.lastName}
          </span>
          <Button label="Salir" icon="pi pi-sign-out" text onClick={() => dispatch(logout())} />
        </div>
      </header>

      <main className="p-3">
        <Outlet />
      </main>
    </div>
  );
}
