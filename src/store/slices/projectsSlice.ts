import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProjectsState } from '../../types';
import { apiClient } from '../../services/api';

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
};

// Helper function to transform MongoDB _id to id
const transformProject = (project: any) => ({
  ...project,
  id: project._id || project.id,
});

const transformProjects = (projects: any[]) =>
  projects.map(transformProject);

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getProjects();
      return transformProjects(response.data.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch projects'
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.getProjectById(projectId);
      return transformProject(response.data.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch project'
      );
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (
    { name, description }: { name: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.createProject(name, description);
      return transformProject(response.data.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create project'
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (
    { projectId, data }: { projectId: string; data: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.updateProject(projectId, data);
      return transformProject(response.data.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update project'
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await apiClient.deleteProject(projectId);
      return projectId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete project'
      );
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Project By ID
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
