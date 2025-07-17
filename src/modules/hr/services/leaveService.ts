import { LeaveRequest, LeaveRequestFormData, LeaveFilters, LeaveBalance } from '../types';

// Mock leave requests data
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'Jane Staff',
    leaveType: 'annual',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    totalDays: 5,
    reason: 'Family vacation',
    status: 'approved',
    approvedBy: '1',
    approvedByName: 'John Admin',
    approvedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Mike Technician',
    leaveType: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    totalDays: 2,
    reason: 'Not feeling well',
    status: 'approved',
    approvedBy: '1',
    approvedByName: 'John Admin',
    approvedAt: '2024-01-19T14:00:00Z',
    createdAt: '2024-01-19T11:00:00Z',
    updatedAt: '2024-01-19T14:00:00Z',
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'Sarah Manager',
    leaveType: 'personal',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    totalDays: 5,
    reason: 'Personal matters',
    status: 'approved',
    approvedBy: '1',
    approvedByName: 'John Admin',
    approvedAt: '2024-01-10T16:45:00Z',
    createdAt: '2024-01-08T13:30:00Z',
    updatedAt: '2024-01-10T16:45:00Z',
  },
  {
    id: '4',
    employeeId: '5',
    employeeName: 'Robert Developer',
    leaveType: 'annual',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    totalDays: 6,
    reason: 'Planned vacation',
    status: 'pending',
    createdAt: '2024-01-20T10:15:00Z',
    updatedAt: '2024-01-20T10:15:00Z',
  },
];

// Mock leave balances
const mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: '1',
    annual: 20,
    sick: 10,
    personal: 5,
    maternity: 0,
    paternity: 0,
    unpaid: 0,
    other: 0,
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    employeeId: '2',
    annual: 15,
    sick: 10,
    personal: 5,
    maternity: 0,
    paternity: 0,
    unpaid: 0,
    other: 0,
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    employeeId: '3',
    annual: 18,
    sick: 8,
    personal: 5,
    maternity: 0,
    paternity: 0,
    unpaid: 0,
    other: 0,
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    employeeId: '4',
    annual: 15,
    sick: 10,
    personal: 0,
    maternity: 0,
    paternity: 0,
    unpaid: 0,
    other: 0,
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    employeeId: '5',
    annual: 14,
    sick: 10,
    personal: 5,
    maternity: 0,
    paternity: 0,
    unpaid: 0,
    other: 0,
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

let leaveRequests = [...mockLeaveRequests];
let leaveBalances = [...mockLeaveBalances];
let nextId = 5;

export class LeaveService {
  static async getLeaveRequests(filters?: LeaveFilters): Promise<LeaveRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredRequests = [...leaveRequests];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredRequests = filteredRequests.filter(request =>
          request.employeeName.toLowerCase().includes(search) ||
          request.reason.toLowerCase().includes(search)
        );
      }
      
      if (filters.employeeId && filters.employeeId !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.employeeId === filters.employeeId);
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.status === filters.status);
      }
      
      if (filters.leaveType && filters.leaveType !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.leaveType === filters.leaveType);
      }
      
      if (filters.dateRange.start) {
        filteredRequests = filteredRequests.filter(request => 
          request.startDate >= filters.dateRange.start! || 
          request.endDate >= filters.dateRange.start!
        );
      }
      
      if (filters.dateRange.end) {
        filteredRequests = filteredRequests.filter(request => 
          request.startDate <= filters.dateRange.end! || 
          request.endDate <= filters.dateRange.end!
        );
      }
    }
    
    return filteredRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return leaveRequests.find(request => request.id === id) || null;
  }

  static async createLeaveRequest(data: LeaveRequestFormData, employeeName: string): Promise<LeaveRequest> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculate total days
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    
    // Check leave balance
    const balance = leaveBalances.find(balance => balance.employeeId === data.employeeId);
    if (!balance) {
      throw new Error('Leave balance not found for this employee');
    }
    
    if (data.leaveType !== 'unpaid' && balance[data.leaveType] < totalDays) {
      throw new Error(`Insufficient ${data.leaveType} leave balance`);
    }
    
    const newRequest: LeaveRequest = {
      id: nextId.toString(),
      employeeId: data.employeeId,
      employeeName,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays,
      reason: data.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    leaveRequests.push(newRequest);
    nextId++;
    
    return newRequest;
  }

  static async approveLeaveRequest(id: string, approverId: string, approverName: string): Promise<LeaveRequest> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = leaveRequests.findIndex(request => request.id === id);
    if (index === -1) {
      throw new Error('Leave request not found');
    }
    
    if (leaveRequests[index].status !== 'pending') {
      throw new Error('Leave request is not in pending status');
    }
    
    // Update leave balance
    const balanceIndex = leaveBalances.findIndex(balance => balance.employeeId === leaveRequests[index].employeeId);
    if (balanceIndex !== -1 && leaveRequests[index].leaveType !== 'unpaid') {
      const leaveType = leaveRequests[index].leaveType;
      leaveBalances[balanceIndex][leaveType] -= leaveRequests[index].totalDays;
      leaveBalances[balanceIndex].updatedAt = new Date().toISOString();
    }
    
    leaveRequests[index] = {
      ...leaveRequests[index],
      status: 'approved',
      approvedBy: approverId,
      approvedByName: approverName,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return leaveRequests[index];
  }

  static async rejectLeaveRequest(id: string, rejecterId: string, rejectorName: string, reason: string): Promise<LeaveRequest> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = leaveRequests.findIndex(request => request.id === id);
    if (index === -1) {
      throw new Error('Leave request not found');
    }
    
    if (leaveRequests[index].status !== 'pending') {
      throw new Error('Leave request is not in pending status');
    }
    
    leaveRequests[index] = {
      ...leaveRequests[index],
      status: 'rejected',
      rejectedBy: rejecterId,
      rejectedByName: rejectorName,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };
    
    return leaveRequests[index];
  }

  static async cancelLeaveRequest(id: string): Promise<LeaveRequest> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = leaveRequests.findIndex(request => request.id === id);
    if (index === -1) {
      throw new Error('Leave request not found');
    }
    
    if (leaveRequests[index].status === 'approved') {
      // Restore leave balance
      const balanceIndex = leaveBalances.findIndex(balance => balance.employeeId === leaveRequests[index].employeeId);
      if (balanceIndex !== -1 && leaveRequests[index].leaveType !== 'unpaid') {
        const leaveType = leaveRequests[index].leaveType;
        leaveBalances[balanceIndex][leaveType] += leaveRequests[index].totalDays;
        leaveBalances[balanceIndex].updatedAt = new Date().toISOString();
      }
    }
    
    leaveRequests[index] = {
      ...leaveRequests[index],
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    };
    
    return leaveRequests[index];
  }

  static async getLeaveBalance(employeeId: string): Promise<LeaveBalance | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return leaveBalances.find(balance => balance.employeeId === employeeId) || null;
  }

  static async updateLeaveBalance(employeeId: string, balanceData: Partial<LeaveBalance>): Promise<LeaveBalance> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = leaveBalances.findIndex(balance => balance.employeeId === employeeId);
    if (index === -1) {
      // Create new balance if not exists
      const newBalance: LeaveBalance = {
        employeeId,
        annual: balanceData.annual || 0,
        sick: balanceData.sick || 0,
        personal: balanceData.personal || 0,
        maternity: balanceData.maternity || 0,
        paternity: balanceData.paternity || 0,
        unpaid: balanceData.unpaid || 0,
        other: balanceData.other || 0,
        updatedAt: new Date().toISOString(),
      };
      
      leaveBalances.push(newBalance);
      return newBalance;
    }
    
    leaveBalances[index] = {
      ...leaveBalances[index],
      ...balanceData,
      updatedAt: new Date().toISOString(),
    };
    
    return leaveBalances[index];
  }
}