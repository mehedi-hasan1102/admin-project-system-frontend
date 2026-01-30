import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { InvitesState } from '../../types';
import { apiClient } from '../../services/api';

const initialState: InvitesState = {
  invites: [],
  isLoading: false,
  error: null,
};

export const createInvite = createAsyncThunk(
  'invites/createInvite',
  async (
    { email, role }: { email: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.createInvite(email, role);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create invite'
      );
    }
  }
);

export const fetchInvites = createAsyncThunk(
  'invites/fetchInvites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.listInvites();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch invites'
      );
    }
  }
);

export const revokeInvite = createAsyncThunk(
  'invites/revokeInvite',
  async (inviteId: string, { rejectWithValue }) => {
    try {
      await apiClient.revokeInvite(inviteId);
      return inviteId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to revoke invite'
      );
    }
  }
);

const invitesSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Invite
      .addCase(createInvite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invites.push(action.payload);
      })
      .addCase(createInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Invites
      .addCase(fetchInvites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invites = action.payload;
      })
      .addCase(fetchInvites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Revoke Invite
      .addCase(revokeInvite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(revokeInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invites = state.invites.filter((i) => i.id !== action.payload);
      })
      .addCase(revokeInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = invitesSlice.actions;
export default invitesSlice.reducer;
