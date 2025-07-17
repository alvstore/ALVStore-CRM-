export interface Payroll {
  id: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  employeeCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  processedAt?: string;
  processedBy?: string;
  processedByName?: string;
}

export interface PayrollItem {
  id: string;
  payrollId: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  baseSalary: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  tax: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  paymentReference?: string;
  paymentDate?: string;
  notes?: string;
}

export interface Payslip {
  id: string;
  payrollItemId: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  month: number;
  year: number;
  payPeriod: string;
  baseSalary: number;
  earnings: {
    type: string;
    amount: number;
  }[];
  deductions: {
    type: string;
    amount: number;
  }[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  bankAccount?: string;
  bankName?: string;
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  paymentReference?: string;
  paymentDate?: string;
  notes?: string;
  createdAt: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  calculationType: 'fixed' | 'percentage';
  value: number;
  taxable: boolean;
  description?: string;
  isDefault: boolean;
}

export interface PayrollFormData {
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface PayrollItemFormData {
  employeeId: string;
  baseSalary: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  tax: number;
  notes?: string;
}

export interface PayslipFormData {
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  earnings: {
    type: string;
    amount: number;
  }[];
  deductions: {
    type: string;
    amount: number;
  }[];
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  paymentReference?: string;
  paymentDate?: string;
  notes?: string;
}

export interface PayrollFilters {
  search: string;
  status: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}