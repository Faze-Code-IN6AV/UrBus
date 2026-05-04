import { AppRouter } from './router/AppRouter';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export const App = () => {

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
