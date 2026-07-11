// src/shared/api/postApi.js
// Endpoints de anuncios, portados de client-admin (shared/api/post.js).
import postClient from './postClient';

export const getPosts = () => postClient.get('/posts');
export const getMyPosts = () => postClient.get('/posts/my-posts');
export const getPostById = (id) => postClient.get(`/posts/${id}`);
export const createPost = (formData) => postClient.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updatePost = (id, formData) => postClient.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePost = (id) => postClient.delete(`/posts/${id}`);
export const reactivatePost = (id) => postClient.patch(`/posts/${id}/reactivate`);