import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux-store';
import { 
  LeaveFilterParams, 
  CreateLeaveRequestData, 
  UpdateLeaveRequestData 
} from '@/types/leave';
import {
  // Selectors
  selectLeaveRequests,
  selectLeaveBalances,
  selectLeaveStats,
  selectLeaveLoading,
  selectLeaveError,
  selectLeaveFilters,
  selectLeaveRequestById,
  selectLeaveBalancesByType,
  
  // Actions
  fetchLeaveRequests,
  fetchLeaveBalances,
  fetchLeaveStats,
  createLeaveRequest as createLeaveRequestAction,
  updateLeaveRequest as updateLeaveRequestAction,
  deleteLeaveRequest as deleteLeaveRequestAction,
  setFilters,
  resetFilters,
  clearError,
} from '@/redux-store/slices/leave';

export const useLeave = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const leaveRequests = useAppSelector(selectLeaveRequests);
  const leaveBalances = useAppSelector(selectLeaveBalances);
  const stats = useAppSelector(selectLeaveStats);
  const loading = useAppSelector(selectLeaveLoading);
  const error = useAppSelector(selectLeaveError);
  const filters = useAppSelector(selectLeaveFilters);

  // Selector functions
  const getLeaveRequestById = (id: string) => 
    useAppSelector((state) => selectLeaveRequestById(state, id));

  const getLeaveBalanceByType = (type: string) => 
    useAppSelector((state) => selectLeaveBalancesByType(state, type));

  // Actions
  const getLeaveRequests = useCallback(
    (filters: Partial<LeaveFilterParams> = {}) => dispatch(fetchLeaveRequests(filters)),
    [dispatch]
  );

  const getBalances = useCallback(
    () => dispatch(fetchLeaveBalances()),
    [dispatch]
  );

  const getStats = useCallback(
    () => dispatch(fetchLeaveStats()),
    [dispatch]
  );

  const createLeaveRequest = useCallback(
    (data: CreateLeaveRequestData) => dispatch(createLeaveRequestAction(data)),
    [dispatch]
  );

  const updateLeaveRequest = useCallback(
    (id: string, data: UpdateLeaveRequestData) => dispatch(updateLeaveRequestAction({ id, data })),
    [dispatch]
  );

  const deleteLeaveRequest = useCallback(
    (id: string) => dispatch(deleteLeaveRequestAction(id)),
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<LeaveFilterParams>) => dispatch(setFilters(newFilters)),
    [dispatch]
  );

  const resetAllFilters = useCallback(
    () => dispatch(resetFilters()),
    [dispatch]
  );

  const clearErrorState = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  return {
    // State
    leaveRequests,
    leaveBalances,
    stats,
    loading,
    error,
    filters,
    
    // Selectors
    getLeaveRequestById,
    getLeaveBalanceByType,
    
    // Actions
    getLeaveRequests,
    getBalances,
    getStats,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    updateFilters,
    resetAllFilters,
    clearError: clearErrorState,
  };
};

export default useLeave;
