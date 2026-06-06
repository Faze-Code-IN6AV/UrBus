import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, register as registerRequest } from '../../../shared/api';
import { showError } from '../../../shared/utils/toast.js';

const ALLOWED_ROLES = ['ADMIN_ROLE', 'USER_ROLE'];


export const useAuthStore = create(
    persist(
        (set, get) => ({
        user: null,
        token: null,
        refreshToken: null,
        expiresAt: null,
        loading: false,
        error: null,
        isLoadingAuth: true,
        isAuthenticated: false,

        checkAuth: () => {
            const token = get().token;
            const role = get().user?.role;
            const hasValidRole = ALLOWED_ROLES.includes(role);

            if (token && !hasValidRole) {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    expiresAt: null,
                    isAuthenticated: false,
                    isLoadingAuth: false,
                    loading: false,
                    error: 'No tienes permisos para acceder a esta aplicación',
                });
                return;
            }

            set({
                isLoadingAuth: false,
                loading: false,
                isAuthenticated: Boolean(token) && hasValidRole,
            });
        },

        logout: () => {
            set({
                user: null,
                token: null,
                refreshToken: null,
                expiresAt: null,
                isAuthenticated: false,
                isLoadingAuth: false,
                loading: false,
            });
        },

        login: async ({ emailOrUsername, password }) => {
            try {
                set({ loading: true, error: null });
                const { data } = await loginRequest({ emailOrUsername, password });
                const role = data?.userDetails?.role;

                if (!ALLOWED_ROLES.includes(role)) {
                    const message = 'No tienes permisos para acceder a esta aplicación';
                    set({ user: null, token: null, refreshToken: null, expiresAt: null,
                        isAuthenticated: false, isLoadingAuth: false, error: message, loading: false });
                    showError(message);
                    return { success: false, error: message };
                }

                set({ user: data.userDetails, token: data.token, refreshToken: data.refreshToken,
                    expiresAt: data.expiresAt, isAuthenticated: true, isLoadingAuth: false,
                    loading: false, error: null });
                return { success: true, role };
            } catch (err) {
                const status = err.response?.status;
                const serverMsg = err.response?.data?.message;

                const message =
                    status === 401 ? 'Correo/usuario o contraseña incorrectos.' :
                    status === 403 ? 'Tu cuenta no tiene permiso para ingresar.' :
                    status === 404 ? 'El usuario no existe.' :
                    status === 423 ? 'Tu cuenta está bloqueada. Contacta al administrador.' :
                    status === 429 ? 'Demasiados intentos. Espera unos minutos.' :
                    serverMsg || 'Error al iniciar sesión. Intenta de nuevo.';

                set({ error: message, loading: false });
                showError(message);
                return { success: false, error: message };
            }
        },

        register: async (formData) => {
            try {
                set({ loading: true, error: null });
                const { data } = await registerRequest(formData);
                set({ loading: false });
                return {
                    success: true,
                    emailVerificationRequired: data?.emailVerificationRequired ?? true,
                    data,
                };
            } catch (err) {
                const message = err.response?.data?.message || 'Error al registrar usuario';
                set({ error: message, loading: false });
                return { success: false, error: message };
            }
        },
        }),
        { name: 'auth-UB-store' }
    )
);