import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoute } from './ProtecterRoute.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path='/dashboard/*'
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
};