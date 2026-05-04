import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path='/dashboard/*'
        element={
          <ProtecterRoute>
              <DashboardPage />
          </ProtecterRoute>
        }
      >
      </Route>
    </Routes>
  );
};
