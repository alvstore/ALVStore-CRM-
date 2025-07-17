export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface LeaveStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  remainingLeaveDays: number;
  usedLeaveDays: number;
  totalLeaveDays: number;
}

export interface LeaveFilterParams {
  status?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLeaveRequestData {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveRequestData {
  status?: LeaveStatus;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}
