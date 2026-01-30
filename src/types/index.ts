export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED' | 'ON_HOLD';
  createdBy: string;
  teamMembers?: Array<{
    userId: string;
    role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  }>;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserListItem extends User {
  invitedAt?: string;
}

export interface UsersState {
  users: UserListItem[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
}

export interface Invite {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REVOKED' | 'EXPIRED';
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface InvitesState {
  invites: Invite[];
  isLoading: boolean;
  error: string | null;
}
