import { AppRouter } from './router/AppRouter';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../features/auth/store/authStore.js';

export const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: '8px',
          },
        }}
      />
      <AppRouter />
    </>
  );
};