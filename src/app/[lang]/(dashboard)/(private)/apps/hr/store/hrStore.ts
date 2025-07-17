import { create } from 'zustand';
import { 
  Employee, 
  Attendance, 
  LeaveRequest, 
  LeaveBalance,
  HRFilters,
  AttendanceFilters,
  LeaveFilters
} from '../types';
import { EmployeeService } from '../services/employeeService';
import { AttendanceService } from '../services/attendanceService';
import { LeaveService } from '../services/leaveService';

interface HRState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  attendance: Attendance[];
  leaveRequests: LeaveRequest[];
  leaveBalance: LeaveBalance | null;
  departments: string[];
  loading: boolean;
  error: string | null;
  filters: HRFilters;
  attendanceFilters: AttendanceFilters;
  leaveFilters: LeaveFilters;
  
  // Employee actions
  fetchEmployees: () => Promise<void>;
  fetchEmployeeById: (id: string) => Promise<void>;
  createEmployee: (employeeData: any) => Promise<void>;
  updateEmployee: (id: string, employeeData: any) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  
  // Attendance actions
  fetchAttendance: () => Promise<void>;
  createAttendance: (data: any, employeeName: string, userId: string, userName: string) => Promise<void>;
  updateAttendance: (id: string, data: any) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
  checkIn: (employeeId: string, employeeName: string) => Promise<void>;
  checkOut: (employeeId: string) => Promise<void>;
  
  // Leave actions
  fetchLeaveRequests: () => Promise<void>;
  createLeaveRequest: (data: any, employeeName: string) => Promise<void>;
  approveLeaveRequest: (id: string, approverId: string, approverName: string) => Promise<void>;
  rejectLeaveRequest: (id: string, rejecterId: string, rejectorName: string, reason: string) => Promise<void>;
  cancelLeaveRequest: (id: string) => Promise<void>;
  fetchLeaveBalance: (employeeId: string) => Promise<void>;
  updateLeaveBalance: (employeeId: string, balanceData: any) => Promise<void>;
  
  // Filter actions
  setFilters: (filters: Partial<HRFilters>) => void;
  setAttendanceFilters: (filters: Partial<AttendanceFilters>) => void;
  setLeaveFilters: (filters: Partial<LeaveFilters>) => void;
  clearError: () => void;
}

export const useHRStore = create<HRState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  attendance: [],
  leaveRequests: [],
  leaveBalance: null,
  departments: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    department: 'all',
    status: 'all',
    dateRange: {},
  },
  attendanceFilters: {
    search: '',
    employeeId: 'all',
    status: 'all',
    dateRange: {},
  },
  leaveFilters: {
    search: '',
    employeeId: 'all',
    status: 'all',
    leaveType: 'all',
    dateRange: {},
  },

  // Employee actions
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const employees = await EmployeeService.getEmployees(get().filters);
      set({ employees, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch employees', loading: false });
    }
  },

  fetchEmployeeById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const employee = await EmployeeService.getEmployeeById(id);
      set({ selectedEmployee: employee, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch employee', loading: false });
    }
  },

  createEmployee: async (employeeData: any) => {
    set({ loading: true, error: null });
    try {
      const newEmployee = await EmployeeService.createEmployee(employeeData);
      set(state => ({ 
        employees: [...state.employees, newEmployee], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create employee', loading: false });
      throw error;
    }
  },

  updateEmployee: async (id: string, employeeData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedEmployee = await EmployeeService.updateEmployee(id, employeeData);
      set(state => ({
        employees: state.employees.map(employee => 
          employee.id === id ? updatedEmployee : employee
        ),
        selectedEmployee: state.selectedEmployee?.id === id ? updatedEmployee : state.selectedEmployee,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update employee', loading: false });
      throw error;
    }
  },

  deleteEmployee: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await EmployeeService.deleteEmployee(id);
      set(state => ({
        employees: state.employees.filter(employee => employee.id !== id),
        selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete employee', loading: false });
      throw error;
    }
  },

  fetchDepartments: async () => {
    try {
      const departments = await EmployeeService.getDepartments();
      set({ departments });
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  },

  // Attendance actions
  fetchAttendance: async () => {
    set({ loading: true, error: null });
    try {
      const attendance = await AttendanceService.getAttendance(get().attendanceFilters);
      set({ attendance, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch attendance', loading: false });
    }
  },

  createAttendance: async (data: any, employeeName: string, userId: string, userName: string) => {
    set({ loading: true, error: null });
    try {
      const newAttendance = await AttendanceService.createAttendance(data, employeeName, userId, userName);
      set(state => ({ 
        attendance: [newAttendance, ...state.attendance], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create attendance record', loading: false });
      throw error;
    }
  },

  updateAttendance: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const updatedAttendance = await AttendanceService.updateAttendance(id, data);
      set(state => ({
        attendance: state.attendance.map(record => 
          record.id === id ? updatedAttendance : record
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update attendance record', loading: false });
      throw error;
    }
  },

  deleteAttendance: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await AttendanceService.deleteAttendance(id);
      set(state => ({
        attendance: state.attendance.filter(record => record.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete attendance record', loading: false });
      throw error;
    }
  },

  checkIn: async (employeeId: string, employeeName: string) => {
    set({ loading: true, error: null });
    try {
      const newAttendance = await AttendanceService.checkIn(employeeId, employeeName);
      set(state => ({ 
        attendance: [newAttendance, ...state.attendance], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to check in', loading: false });
      throw error;
    }
  },

  checkOut: async (employeeId: string) => {
    set({ loading: true, error: null });
    try {
      const updatedAttendance = await AttendanceService.checkOut(employeeId);
      set(state => ({
        attendance: state.attendance.map(record => 
          record.id === updatedAttendance.id ? updatedAttendance : record
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to check out', loading: false });
      throw error;
    }
  },

  // Leave actions
  fetchLeaveRequests: async () => {
    set({ loading: true, error: null });
    try {
      const leaveRequests = await LeaveService.getLeaveRequests(get().leaveFilters);
      set({ leaveRequests, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch leave requests', loading: false });
    }
  },

  createLeaveRequest: async (data: any, employeeName: string) => {
    set({ loading: true, error: null });
    try {
      const newLeaveRequest = await LeaveService.createLeaveRequest(data, employeeName);
      set(state => ({ 
        leaveRequests: [newLeaveRequest, ...state.leaveRequests], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create leave request', loading: false });
      throw error;
    }
  },

  approveLeaveRequest: async (id: string, approverId: string, approverName: string) => {
    set({ loading: true, error: null });
    try {
      const updatedLeaveRequest = await LeaveService.approveLeaveRequest(id, approverId, approverName);
      set(state => ({
        leaveRequests: state.leaveRequests.map(request => 
          request.id === id ? updatedLeaveRequest : request
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to approve leave request', loading: false });
      throw error;
    }
  },

  rejectLeaveRequest: async (id: string, rejecterId: string, rejectorName: string, reason: string) => {
    set({ loading: true, error: null });
    try {
      const updatedLeaveRequest = await LeaveService.rejectLeaveRequest(id, rejecterId, rejectorName, reason);
      set(state => ({
        leaveRequests: state.leaveRequests.map(request => 
          request.id === id ? updatedLeaveRequest : request
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to reject leave request', loading: false });
      throw error;
    }
  },

  cancelLeaveRequest: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedLeaveRequest = await LeaveService.cancelLeaveRequest(id);
      set(state => ({
        leaveRequests: state.leaveRequests.map(request => 
          request.id === id ? updatedLeaveRequest : request
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to cancel leave request', loading: false });
      throw error;
    }
  },

  fetchLeaveBalance: async (employeeId: string) => {
    set({ loading: true, error: null });
    try {
      const leaveBalance = await LeaveService.getLeaveBalance(employeeId);
      set({ leaveBalance, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch leave balance', loading: false });
    }
  },

  updateLeaveBalance: async (employeeId: string, balanceData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedLeaveBalance = await LeaveService.updateLeaveBalance(employeeId, balanceData);
      set({ leaveBalance: updatedLeaveBalance, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update leave balance', loading: false });
      throw error;
    }
  },

  // Filter actions
  setFilters: (filters: Partial<HRFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  setAttendanceFilters: (filters: Partial<AttendanceFilters>) => {
    set(state => ({
      attendanceFilters: { ...state.attendanceFilters, ...filters }
    }));
  },

  setLeaveFilters: (filters: Partial<LeaveFilters>) => {
    set(state => ({
      leaveFilters: { ...state.leaveFilters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));