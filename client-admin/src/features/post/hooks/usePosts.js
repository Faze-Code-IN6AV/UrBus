import { useEffect, useCallback } from 'react';
import { usePostStore } from '../store/postStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';

export const usePosts = () => {
    const user = useAuthStore((s) => s.user);
    const isAdmin = user?.role === 'ADMIN_ROLE';
    const isDriver = user?.role === 'DRIVER_ROLE';

    const posts      = usePostStore((s) => s.posts);
    const myPosts    = usePostStore((s) => s.myPosts);
    const loading    = usePostStore((s) => s.loading);
    const error      = usePostStore((s) => s.error);

    const fetchPosts   = usePostStore((s) => s.fetchPosts);
    const fetchMyPosts = usePostStore((s) => s.fetchMyPosts);
    const addPost      = usePostStore((s) => s.addPost);
    const editPost     = usePostStore((s) => s.editPost);
    const removePost   = usePostStore((s) => s.removePost);
    const restorePost  = usePostStore((s) => s.restorePost);
    const clearError   = usePostStore((s) => s.clearError);

    const refetch = useCallback(() => {
        fetchPosts();
        if (isDriver) {
            fetchMyPosts();
        }
    }, [isDriver, fetchPosts, fetchMyPosts]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    // Conductores y admins ven los anuncios existentes; los conductores solo pueden editar/eliminar los suyos.
    const activePosts = Array.isArray(posts)
        ? posts.filter((p) => !p.isDeleted)
        : [];

    return {
        posts: activePosts,
        allPosts: Array.isArray(posts) ? posts : [],
        myPosts,
        loading,
        error,
        isAdmin,
        isDriver,
        refetch,
        addPost,
        editPost,
        removePost,
        restorePost,
        clearError,
    };
};