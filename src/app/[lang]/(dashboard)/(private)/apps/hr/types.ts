export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employeeId: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  salary: number;
  salaryType: 'hourly' | 'monthly' | 'yearly';
  bankAccount?: string;
  bankName?: string;
  taxId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  avatar?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  workHours: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: number;
  sick: number;
  personal: number;
  maternity: number;
  paternity: number;
  unpaid: number;
  other: number;
  updatedAt: string;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employeeId: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  salary: number;
  salaryType: 'hourly' | 'monthly' | 'yearly';
  bankAccount?: string;
  bankName?: string;
  taxId?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  notes?: string;
}

export interface AttendanceFormData {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes?: string;
}

export interface LeaveRequestFormData {
  employeeId: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
}

export interface HRFilters {
  search: string;
  department: string;
  status: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface AttendanceFilters {
  search: string;
  employeeId: string;
  status: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface LeaveFilters {
  search: string;
  employeeId: string;
  status: string;
  leaveType: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}