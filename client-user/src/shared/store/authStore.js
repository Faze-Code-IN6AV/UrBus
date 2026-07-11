// src/shared/store/authStore.js
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { ROLES } from '../constants/theme';

// client-user ahora admite los 4 roles del sistema: el pasajero/usuario usa la app
// para ver su estado, la ruta y los anuncios; el conductor (DRIVER_ROLE) y el
// administrador (ADMIN_ROLE) obtienen además las funciones de gestión que antes
// solo existían en client-admin (lista de pasajeros, anuncios y control de ruta).
const ALLOWED_ROLES = [ROLES.USER, ROLES.PASSENGER, ROLES.DRIVER, ROLES.ADMIN];

const useAuthStore = create(
  persist(
    (set, get) => ({
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

      // Helpers de rol, equivalentes a los usados en client-admin
      isManager: () => {
        const role = get().user?.role;
        return role === ROLES.DRIVER || role === ROLES.ADMIN;
      },
      isAdmin: () => get().user?.role === ROLES.ADMIN,
      isDriver: () => get().user?.role === ROLES.DRIVER,
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

useAuthStore.persist.onFinishHydration(() => {
  useAuthStore.setState({ _hasHydrated: true });
});
if (useAuthStore.persist.hasHydrated()) {
  useAuthStore.setState({ _hasHydrated: true });
}

export default useAuthStore;