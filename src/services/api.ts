import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              // You could implement token refresh here
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          } catch (err) {
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  register(name: string, email: string, password: string, inviteToken?: string) {
    return this.client.post('/auth/register', {
      name,
      email,
      password,
      inviteToken,
    });
  }

  getProfile() {
    return this.client.get('/auth/profile');
  }

  updateProfile(data: { name: string }) {
    return this.client.put('/auth/profile', data);
  }

  // User endpoints
  getAllUsers(page?: number, limit?: number) {
    return this.client.get('/users', {
      params: { page, limit },
    });
  }

  getUserById(userId: string) {
    return this.client.get(`/users/${userId}`);
  }

  createInvite(email: string, role: string) {
    return this.client.post('/users/invites/create', { email, role });
  }

  getInviteStatus(token: string) {
    return this.client.get('/users/invites/status', {
      params: { inviteToken: token },
    });
  }

  listInvites() {
    return this.client.get('/users/invites');
  }

  revokeInvite(inviteId: string) {
    return this.client.delete(`/users/invites/${inviteId}`);
  }

  deactivateUser(userId: string, status: string) {
    return this.client.patch(`/users/${userId}/status`, { status });
  }

  changeUserRole(userId: string, role: string) {
    return this.client.patch(`/users/${userId}/role`, { role });
  }

  // Project endpoints
  createProject(name: string, description?: string) {
    return this.client.post('/projects', { name, description });
  }

  getProjects() {
    return this.client.get('/projects');
  }

  getProjectById(projectId: string) {
    return this.client.get(`/projects/${projectId}`);
  }

  updateProject(projectId: string, data: Record<string, any>) {
    return this.client.patch(`/projects/${projectId}`, data);
  }

  deleteProject(projectId: string) {
    return this.client.delete(`/projects/${projectId}`);
  }

  addTeamMember(projectId: string, memberId: string, role?: string) {
    return this.client.post(`/projects/${projectId}/team-members`, {
      memberId,
      role,
    });
  }

  removeTeamMember(projectId: string, memberId: string) {
    return this.client.delete(`/projects/${projectId}/team-members/${memberId}`);
  }
}

export const apiClient = new APIClient();
