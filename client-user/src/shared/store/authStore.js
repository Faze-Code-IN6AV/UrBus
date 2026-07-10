// src/shared/store/authStore.js
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const ALLOWED_ROLES = ['USER_ROLE', 'PASSENGER_ROLE'];

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: (token, refreshToken, expiresAt, userDetails) => {
        if (!userDetails || !ALLOWED_ROLES.includes(userDetails.role)) {
          throw new Error('No tienes permisos para usar esta app');
        }

        // El refresh token se guarda en SecureStore, no en AsyncStorage
        SecureStore.setItemAsync('refreshToken', refreshToken).catch(() => {});

        set({
          token,
          refreshToken,
          expiresAt,
          user: userDetails,
          isAuthenticated: true,
        });
      },

      logout: () => {
        SecureStore.deleteItemAsync('refreshToken').catch(() => {});
        set({
          token: null,
          refreshToken: null,
          expiresAt: null,
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (partial) => {
        set((state) => ({
          user: { ...state.user, ...partial },
        }));
      },
    }),
    {
      name: 'client-user-auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.();
      },
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Marca la hidratación como completa una vez que persist termina de leer AsyncStorage
useAuthStore.persist.onFinishHydration(() => {
  useAuthStore.setState({ _hasHydrated: true });
});
if (useAuthStore.persist.hasHydrated()) {
  useAuthStore.setState({ _hasHydrated: true });
}

export default useAuthStore;
