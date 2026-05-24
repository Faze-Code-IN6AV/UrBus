import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoute } from './ProtecterRoute.jsx';
// Auth
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
// Location
import { LocationPage } from '../../features/location/pages/LocationPage.jsx';
// Passengers
import { PassengerListPage } from '../../features/passangers/pages/PassengerListPage.jsx';
//import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
//import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage.jsx';
import { PostListPage } from '../../features/posts/pages/PostListPage.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthPage/>}/>
      {/*<Route path='/verify-email' element={<VerifyEmailPage/>}/>
      <Route path='/reset-password' element={<ResetPasswordPage/>}/>*/}

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        {/* Mapa como pÃ¡gina de inicio por defecto */}
        <Route index element={<LocationPage />} />
        <Route path='location' element={<LocationPage />} />
        <Route path='passengers' element={<PassengerListPage />} />
        <Route path='posts' element={<PostListPage />} />
      </Route>

      <Route path='*' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
};