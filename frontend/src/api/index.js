import axios from 'axios';

const api = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    register: (email, password) => api.post('/auth/register', { email, password }),
    login: (email, password) => api.post('/auth/login', { email, password }),
};

export const postApi = {
    getPosts: () => api.get('/posts'),
    createPost: (title, content) => api.post('/posts', { title, content }),
    updatePost: (id, title, content) => api.put(`/posts/${id}`, { title, content }),
    deletePost: (id) => api.delete(`/posts/${id}`),
    likePost: (id) => api.post(`/posts/${id}/like`),
    unlikePost: (id) => api.post(`/posts/${id}/unlike`),
};