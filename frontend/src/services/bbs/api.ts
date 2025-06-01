import axios from 'axios';
import type { AuthResponse, Post, Comment, Category } from '../../types/bbs/index';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; username: string; password: string }): Promise<{ data: AuthResponse }> =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }): Promise<{ data: AuthResponse }> =>
    api.post('/auth/login', data),
};

export const postsApi = {
  getPosts: (page = 1, pageSize = 10): Promise<{ data: { posts: Post[]; total: number } }> =>
    api.get('/posts', { params: { page, pageSize } }),
  
  getPost: (id: string): Promise<{ data: Post }> =>
    api.get(`/posts/${id}`),
  
  createPost: (data: { title: string; content: string; categoryId: string }): Promise<{ data: Post }> =>
    api.post('/posts', data),
  
  deletePost: (id: string): Promise<void> =>
    api.delete(`/posts/${id}`),
  
  addComment: (postId: string, data: { content: string }): Promise<{ data: Comment }> =>
    api.post(`/posts/${postId}/comments`, data),
};

export const categoriesApi = {
  getCategories: (): Promise<{ data: Category[] }> =>
    api.get('/categories'),
};