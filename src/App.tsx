import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastListener } from './components/ToastListener';
import LoginPage from './pages/LoginPage';
import PostsPage from './pages/PostsPage';
import { ConfirmDialog } from 'primereact/confirmdialog';

export default function App() {
  return (
    <>
      <ToastListener /> 
      <ConfirmDialog />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/posts" element={<PostsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </>
  );
}