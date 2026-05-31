import { create } from 'zustand';
import {
    getPosts,
    getMyPosts,
    createPost,
    updatePost,
    deletePost,
    reactivatePost,
} from '../../../shared/api/post.js';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const usePostStore = create((set, get) => ({
    posts: [],
    myPosts: [],
    loading: false,
    error: null,

    fetchPosts: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await getPosts();
            const postsData = Array.isArray(data)
                ? data
                : Array.isArray(data?.posts)
                ? data.posts
                : [];
            set({ posts: postsData });
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar anuncios';
            set({ error: msg });
            showError(msg);
        } finally {
            set({ loading: false });
        }
    },

    fetchMyPosts: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await getMyPosts();
            const postsData = Array.isArray(data)
                ? data
                : Array.isArray(data?.posts)
                ? data.posts
                : [];
            set({ myPosts: postsData });
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar tus anuncios';
            set({ error: msg });
            showError(msg);
        } finally {
            set({ loading: false });
        }
    },

    addPost: async (formData) => {
        try {
            set({ loading: true, error: null });
            const { data } = await createPost(formData);
            set((state) => ({
                posts: [data.post, ...state.posts],
                myPosts: [data.post, ...state.myPosts],
            }));
            showSuccess('Anuncio creado correctamente');
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al crear anuncio';
            set({ error: msg });
            showError(msg);
            return { success: false, error: msg };
        } finally {
            set({ loading: false });
        }
    },

    editPost: async (id, formData) => {
        try {
            set({ loading: true, error: null });
            const { data } = await updatePost(id, formData);
            set((state) => ({
                posts: state.posts.map((p) => (p._id === id ? data.post : p)),
                myPosts: state.myPosts.map((p) => (p._id === id ? data.post : p)),
            }));
            showSuccess('Anuncio actualizado');
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar anuncio';
            set({ error: msg });
            showError(msg);
            return { success: false, error: msg };
        } finally {
            set({ loading: false });
        }
    },

    removePost: async (id) => {
        const snapshot = get().posts;
        const mySnapshot = get().myPosts;
        set((state) => ({
            posts: state.posts.map((p) => (p._id === id ? { ...p, isDeleted: true } : p)),
            myPosts: state.myPosts.map((p) => (p._id === id ? { ...p, isDeleted: true } : p)),
        }));
        try {
            await deletePost(id);
            showSuccess('Anuncio eliminado');
        } catch (err) {
            set({ posts: snapshot, myPosts: mySnapshot });
            showError(err.response?.data?.message || 'Error al eliminar anuncio');
        }
    },

    restorePost: async (id) => {
        try {
            const { data } = await reactivatePost(id);
            set((state) => ({
                posts: state.posts.map((p) => (p._id === id ? data.post : p)),
                myPosts: state.myPosts.map((p) => (p._id === id ? data.post : p)),
            }));
            showSuccess('Anuncio reactivado');
        } catch (err) {
            showError(err.response?.data?.message || 'Error al reactivar anuncio');
        }
    },

    clearError: () => set({ error: null }),
}));