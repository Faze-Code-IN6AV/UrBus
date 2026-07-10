// src/features/posts/hooks/usePosts.js
import { useState, useCallback } from 'react';
import postClient from '../../../shared/api/postClient';

function mapPost(raw) {
  return {
    id: raw._id,
    title: raw.title,
    content: raw.content,
    image: raw.imageUrl ?? null,
    createdAt: raw.createdAt,
  };
}

/**
 * Feed de anuncios visibles para el pasajero.
 * El backend ya filtra isDeleted:false para roles no-admin.
 */
export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postClient.get('/posts');
      const data = response.data.data ?? response.data;
      setPosts(Array.isArray(data) ? data.map(mapPost) : []);
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudieron cargar los anuncios');
    } finally {
      setLoading(false);
    }
  }, []);

  return { posts, loading, error, fetchPosts };
}

export function usePostDetail(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await postClient.get(`/posts/${id}`);
      const data = response.data.data ?? response.data;
      setPost(mapPost(data));
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo cargar el anuncio');
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { post, loading, error, fetchPost };
}
