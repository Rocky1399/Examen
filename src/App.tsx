import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastListener } from './components/ToastListener';
import LoginPage from './pages/LoginPage';
import PostsPage from './pages/PostsPage';
import { ConfirmDialog } from 'primereact/confirmdialog';
import PostFormPage from './pages/PostFormPage';
import DocsPage from './pages/DocsPage';

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
            <Route path="/posts/new" element={<PostFormPage />} />
            <Route path="/posts/:id/edit" element={<PostFormPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </>
  );
}
