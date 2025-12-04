import axios from 'axios';
import { Project, Judge } from '../types';

// Use relative URL for development (Vite proxy) or full URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (project: Partial<Project>): Promise<Project> => {
    const response = await api.post('/projects', project);
    return response.data;
  },

  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  assignJudge: async (projectId: string, judgeId: string): Promise<Project> => {
    const response = await api.post(`/projects/${projectId}/judges/${judgeId}`);
    return response.data;
  },

  removeJudge: async (projectId: string, judgeId: string): Promise<Project> => {
    const response = await api.delete(`/projects/${projectId}/judges/${judgeId}`);
    return response.data;
  },
};

// Judges API
export const judgesAPI = {
  getAll: async (): Promise<Judge[]> => {
    const response = await api.get('/judges');
    return response.data;
  },

  getUnassigned: async (): Promise<Judge[]> => {
    const response = await api.get('/judges/unassigned');
    return response.data;
  },

  getById: async (id: string): Promise<Judge> => {
    const response = await api.get(`/judges/${id}`);
    return response.data;
  },

  create: async (judge: Partial<Judge>): Promise<Judge> => {
    const response = await api.post('/judges', judge);
    return response.data;
  },

  update: async (id: string, judge: Partial<Judge>): Promise<Judge> => {
    const response = await api.put(`/judges/${id}`, judge);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/judges/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async (role?: string): Promise<any[]> => {
    const params = role ? { role } : {};
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createAdmin: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<any> => {
    const response = await api.post('/admin/admins', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: any): Promise<any> => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: string,
    specialty?: string
  ): Promise<{ token: string; user: any }> => {
    // Split name into firstName and lastName
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const response = await api.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      role,
      specialty,
    });
    return response.data;
  },

  getMe: async (token: string): Promise<{ user: any }> => {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default api;

