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

export default api;

