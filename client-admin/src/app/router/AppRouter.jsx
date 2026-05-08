import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoute } from './ProtecterRoute.jsx';
// Auth
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthPage/>}/>
      <Route path='/verify-email' element={<VerifyEmailPage/>}/>
      <Route path='/reset-password' element={<ResetPasswordPage/>}/>

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