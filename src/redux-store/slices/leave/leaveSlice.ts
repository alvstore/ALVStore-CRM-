import { createSlice, PayloadAction, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { RootState } from '@/redux-store';
import { 
  LeaveRequest, 
  LeaveBalance, 
  LeaveFilterParams, 
  LeaveStats, 
  CreateLeaveRequestData, 
  UpdateLeaveRequestData,
  LeaveStatus
} from '@/types/leave';

interface LeaveState {
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  stats: LeaveStats | null;
  loading: boolean;
  error: string | null;
  filters: LeaveFilterParams;
}

const initialState: LeaveState = {
  leaveRequests: [],
  leaveBalances: [],
  stats: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    page: 1,
    limit: 10,
  },
};

// Async thunks
export const fetchLeaveRequests = createAsyncThunk<
  LeaveRequest[],
  LeaveFilterParams | undefined,
  { state: RootState }
>('leave/fetchLeaveRequests', async (filters = {}, { getState, rejectWithValue }) => {
  try {
    const { filters: currentFilters } = getState().leave;
    const params = { ...currentFilters, ...filters };
    
    // In a real app, this would be an API call
    // const response = await api.get('/leave/requests', { params });
    // return response.data;
    
    // Mock implementation
    return [];
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch leave requests');
  }
});

export const fetchLeaveBalances = createAsyncThunk<
  LeaveBalance[],
  void,
  { state: RootState }
>('leave/fetchLeaveBalances', async (_, { rejectWithValue }) => {
  try {
    // const response = await api.get('/leave/balances');
    // return response.data;
    return [];
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch leave balances');
  }
});

export const fetchLeaveStats = createAsyncThunk<
  LeaveStats,
  void,
  { state: RootState }
>('leave/fetchLeaveStats', async (_, { rejectWithValue }) => {
  try {
    // const response = await api.get('/leave/stats');
    // return response.data;
    return {
      totalRequests: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      remainingLeaveDays: 0,
      usedLeaveDays: 0,
      totalLeaveDays: 0,
    };
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch leave stats');
  }
});

export const createLeaveRequest = createAsyncThunk<
  LeaveRequest,
  CreateLeaveRequestData,
  { state: RootState }
>('leave/createLeaveRequest', async (data, { rejectWithValue }) => {
  try {
    // const response = await api.post('/leave/requests', data);
    // return response.data;
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      employeeId: data.employeeId || 'current-user-id',
      status: 'pending' as const,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      days: 1, // This would be calculated
      leaveType: data.leaveType || 'annual',
      employeeName: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to create leave request');
  }
});

export const updateLeaveRequest = createAsyncThunk<
  LeaveRequest,
  { id: string; data: UpdateLeaveRequestData },
  { state: RootState }
>('leave/updateLeaveRequest', async ({ id, data }, { rejectWithValue, getState }) => {
  try {
    // const response = await api.patch(`/leave/requests/${id}`, data);
    // return response.data;
    const existingRequest = getState().leave.leaveRequests.find((req: LeaveRequest) => req.id === id);
    if (!existingRequest) {
      throw new Error('Leave request not found');
    }
    return {
      ...existingRequest,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to update leave request');
  }
});

export const deleteLeaveRequest = createAsyncThunk<
  string,
  string,
  { state: RootState }
>('leave/deleteLeaveRequest', async (id, { rejectWithValue }) => {
  try {
    // await api.delete(`/leave/requests/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to delete leave request');
  }
});

export const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<LeaveFilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Leave Requests
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Leave Balances
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
        state.leaveBalances = action.payload;
      })
      .addCase(fetchLeaveBalances.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Fetch Leave Stats
      .addCase(fetchLeaveStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchLeaveStats.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Create Leave Request
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.leaveRequests.unshift(action.payload);
        if (state.stats) {
          state.stats.totalRequests += 1;
          state.stats.pending += 1;
        }
      })
      
      // Update Leave Request
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        const index = state.leaveRequests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          const oldStatus = state.leaveRequests[index].status;
          state.leaveRequests[index] = action.payload;
          
          // Update stats if status changed
          if (state.stats && oldStatus !== action.payload.status) {
            if (oldStatus === 'pending') state.stats.pending -= 1;
            if (oldStatus === 'approved') state.stats.approved -= 1;
            if (oldStatus === 'rejected') state.stats.rejected -= 1;
            
            if (action.payload.status === 'pending') state.stats.pending += 1;
            if (action.payload.status === 'approved') state.stats.approved += 1;
            if (action.payload.status === 'rejected') state.stats.rejected += 1;
            
            // Update leave days if status changed to/from approved
            if (action.payload.status === 'approved' || oldStatus === 'approved') {
              const days = state.leaveRequests[index].days;
              state.stats.usedLeaveDays += action.payload.status === 'approved' ? days : -days;
              state.stats.remainingLeaveDays -= action.payload.status === 'approved' ? days : -days;
            }
          }
        }
      })
      
      // Delete Leave Request
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        const deletedRequest = state.leaveRequests.find(req => req.id === action.payload);
        if (deletedRequest && state.stats) {
          state.leaveRequests = state.leaveRequests.filter(req => req.id !== action.payload);
          state.stats.totalRequests -= 1;
          
          if (deletedRequest.status === 'pending') state.stats.pending -= 1;
          if (deletedRequest.status === 'approved') {
            state.stats.approved -= 1;
            state.stats.usedLeaveDays -= deletedRequest.days;
            state.stats.remainingLeaveDays += deletedRequest.days;
          }
          if (deletedRequest.status === 'rejected') state.stats.rejected -= 1;
        }
      });
  },
});

export const { setFilters, resetFilters, clearError } = leaveSlice.actions;

// Selectors
export const selectLeaveRequests = (state: RootState) => state.leave.leaveRequests;
export const selectLeaveBalances = (state: RootState) => state.leave.leaveBalances;
export const selectLeaveStats = (state: RootState) => state.leave.stats;
export const selectLeaveLoading = (state: RootState) => state.leave.loading;
export const selectLeaveError = (state: RootState) => state.leave.error;
export const selectLeaveFilters = (state: RootState) => state.leave.filters;

export const selectLeaveRequestById = (state: RootState, id: string) => 
  state.leave.leaveRequests.find(req => req.id === id);

export const selectLeaveBalancesByType = (state: RootState, type: string) => 
  state.leave.leaveBalances.find(balance => balance.leaveType === type);

export default leaveSlice.reducer;
