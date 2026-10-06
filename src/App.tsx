import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastListener } from './components/ToastListener';
import LoginPage from './pages/LoginPage';
import PostsPage from './pages/PostsPage';

export default function App() {
  return (
    <>
      <ToastListener /> {/* fuera de <Routes>: se ve en todas las páginas */}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas privadas: primero pasa por el guardián, luego por el layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/posts" element={<PostsPage />} />
          </Route>
        </Route>

        {/* Cualquier otra URL (incluida "/") → /posts */}
        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </>
  );
}