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

// Add request interceptor to attach auth token
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

// Hackathons API
export const hackathonsAPI = {
  getAll: async () => {
    const response = await api.get('/hackathons');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/hackathons/${id}`);
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/hackathons');
    const hackathons = response.data || [];
    // Find active hackathon, prioritize "InnovateHer" default hackathon
    if (hackathons.length === 0) {
      return null;
    }
    // First try to find the default "InnovateHer" hackathon
    const innovateHer = hackathons.find((h: any) => h.name === 'InnovateHer');
    if (innovateHer) {
      return innovateHer;
    }
    // Otherwise find active hackathon or get the most recent one
    const active = hackathons.find((h: any) => h.status === 'active');
    return active || hackathons[0] || null;
  },
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, role: string, specialty?: string) => {
    // Split name into firstName and lastName
    const nameParts = name.trim().split(/\s+/).filter(part => part.length > 0);
    const firstName = nameParts[0] || '';
    // If only one name part, use it as both firstName and lastName
    // Otherwise, join all remaining parts as lastName
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (firstName || '');
    
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

  getMe: async (token: string) => {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

// Scores API
export const scoresAPI = {
  submitScore: async (projectId: string, rubricScores: any, feedback?: string) => {
    const response = await api.post('/scores', {
      projectId,
      rubricScores,
      feedback: feedback || '',
    });
    return response.data;
  },

  getProjectScores: async (projectId: string) => {
    const response = await api.get(`/scores/project/${projectId}`);
    return response.data;
  },

  getMyScores: async () => {
    const response = await api.get('/scores/my-scores');
    return response.data;
  },

  getJudgeScores: async (judgeId: string) => {
    const response = await api.get(`/scores/judge/${judgeId}`);
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get('/scores/leaderboard');
    return response.data;
  },
};

// Rubric API
export const rubricAPI = {
  getRubric: async () => {
    const response = await api.get('/rubric');
    return response.data;
  },

  getTrackRubric: async (trackId: string) => {
    const response = await api.get(`/rubric/track/${trackId}`);
    return response.data;
  },

  updateGlobalRubric: async (globalRubric: any, maxJudgesPerProject?: number, minJudgesPerProject?: number) => {
    const response = await api.put('/rubric/global', {
      globalRubric,
      maxJudgesPerProject,
      minJudgesPerProject,
    });
    return response.data;
  },
};

export default api;

