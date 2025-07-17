import { Payroll, PayrollItem, Payslip, SalaryComponent, PayrollFormData, PayrollFilters } from '../types';
import { Employee } from '../../hr/types';
import { EmployeeService } from '../../hr/services/employeeService';
import { AttendanceService } from '../../hr/services/attendanceService';

// Mock salary components
const mockSalaryComponents: SalaryComponent[] = [
  {
    id: '1',
    name: 'Basic Salary',
    type: 'earning',
    calculationType: 'fixed',
    value: 100,
    taxable: true,
    isDefault: true,
  },
  {
    id: '2',
    name: 'House Rent Allowance',
    type: 'earning',
    calculationType: 'percentage',
    value: 40,
    taxable: false,
    description: '40% of basic salary',
    isDefault: true,
  },
  {
    id: '3',
    name: 'Transport Allowance',
    type: 'earning',
    calculationType: 'fixed',
    value: 200,
    taxable: false,
    isDefault: true,
  },
  {
    id: '4',
    name: 'Medical Allowance',
    type: 'earning',
    calculationType: 'fixed',
    value: 100,
    taxable: false,
    isDefault: true,
  },
  {
    id: '5',
    name: 'Income Tax',
    type: 'deduction',
    calculationType: 'percentage',
    value: 10,
    taxable: false,
    description: '10% of taxable income',
    isDefault: true,
  },
  {
    id: '6',
    name: 'Provident Fund',
    type: 'deduction',
    calculationType: 'percentage',
    value: 12,
    taxable: false,
    description: '12% of basic salary',
    isDefault: true,
  },
  {
    id: '7',
    name: 'Professional Tax',
    type: 'deduction',
    calculationType: 'fixed',
    value: 200,
    taxable: false,
    isDefault: true,
  },
];

// Mock payroll data
const mockPayrolls: Payroll[] = [
  {
    id: '1',
    month: 1,
    year: 2024,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'completed',
    totalAmount: 36500,
    employeeCount: 5,
    notes: 'January 2024 Payroll',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-28T14:30:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    processedAt: '2024-01-28T14:30:00Z',
    processedBy: '1',
    processedByName: 'John Admin',
  },
];

// Mock payroll items
const mockPayrollItems: PayrollItem[] = [
  {
    id: '1',
    payrollId: '1',
    employeeId: '1',
    employeeName: 'John Admin',
    position: 'CEO',
    department: 'Management',
    baseSalary: 10000,
    allowances: 4200,
    overtime: 0,
    bonus: 0,
    deductions: 1420,
    tax: 1000,
    netSalary: 11780,
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRF-2024-001',
    paymentDate: '2024-01-30',
    notes: 'Salary for January 2024',
  },
  {
    id: '2',
    payrollId: '1',
    employeeId: '2',
    employeeName: 'Jane Staff',
    position: 'Sales Manager',
    department: 'Sales',
    baseSalary: 7000,
    allowances: 2980,
    overtime: 0,
    bonus: 500,
    deductions: 1040,
    tax: 700,
    netSalary: 8740,
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRF-2024-002',
    paymentDate: '2024-01-30',
    notes: 'Salary for January 2024',
  },
  {
    id: '3',
    payrollId: '1',
    employeeId: '3',
    employeeName: 'Mike Technician',
    position: 'Senior Technician',
    department: 'Technical',
    baseSalary: 6000,
    allowances: 2580,
    overtime: 300,
    bonus: 0,
    deductions: 920,
    tax: 600,
    netSalary: 7360,
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRF-2024-003',
    paymentDate: '2024-01-30',
    notes: 'Salary for January 2024',
  },
  {
    id: '4',
    payrollId: '1',
    employeeId: '4',
    employeeName: 'Sarah Manager',
    position: 'HR Manager',
    department: 'Human Resources',
    baseSalary: 7500,
    allowances: 3180,
    overtime: 0,
    bonus: 0,
    deductions: 1100,
    tax: 750,
    netSalary: 8830,
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRF-2024-004',
    paymentDate: '2024-01-30',
    notes: 'Salary for January 2024',
  },
  {
    id: '5',
    payrollId: '1',
    employeeId: '5',
    employeeName: 'Robert Developer',
    position: 'Senior Developer',
    department: 'IT',
    baseSalary: 8000,
    allowances: 3380,
    overtime: 0,
    bonus: 0,
    deductions: 1160,
    tax: 800,
    netSalary: 9420,
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRF-2024-005',
    paymentDate: '2024-01-30',
    notes: 'Salary for January 2024',
  },
];

// Mock payslips
const mockPayslips: Payslip[] = mockPayrollItems.map(item => ({
  id: item.id,
  payrollItemId: item.id,
  employeeId: item.employeeId,
  employeeName: item.employeeName,
  position: item.position,
  department: item.department,
  month: 1,
  year: 2024,
  payPeriod: 'January 1 - January 31, 2024',
  baseSalary: item.baseSalary,
  earnings: [
    { type: 'Basic Salary', amount: item.baseSalary },
    { type: 'House Rent Allowance', amount: item.baseSalary * 0.4 },
    { type: 'Transport Allowance', amount: 200 },
    { type: 'Medical Allowance', amount: 100 },
    ...(item.overtime ? [{ type: 'Overtime', amount: item.overtime }] : []),
    ...(item.bonus ? [{ type: 'Bonus', amount: item.bonus }] : []),
  ],
  deductions: [
    { type: 'Income Tax', amount: item.tax },
    { type: 'Provident Fund', amount: item.baseSalary * 0.12 },
    { type: 'Professional Tax', amount: 200 },
  ],
  grossSalary: item.baseSalary + item.allowances + item.overtime + item.bonus,
  totalDeductions: item.deductions + item.tax,
  netSalary: item.netSalary,
  bankAccount: '****' + Math.floor(1000 + Math.random() * 9000).toString(),
  bankName: ['First National Bank', 'City Bank', 'Global Bank'][Math.floor(Math.random() * 3)],
  paymentMethod: item.paymentMethod,
  paymentReference: item.paymentReference,
  paymentDate: item.paymentDate,
  notes: item.notes,
  createdAt: '2024-01-28T14:30:00Z',
}));

let payrolls = [...mockPayrolls];
let payrollItems = [...mockPayrollItems];
let payslips = [...mockPayslips];
let salaryComponents = [...mockSalaryComponents];
let nextPayrollId = 2;
let nextItemId = 6;
let nextComponentId = 8;

export class PayrollService {
  static async getPayrolls(filters?: PayrollFilters): Promise<Payroll[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredPayrolls = [...payrolls];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredPayrolls = filteredPayrolls.filter(payroll =>
          payroll.notes?.toLowerCase().includes(search) ||
          `${payroll.month}/${payroll.year}`.includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredPayrolls = filteredPayrolls.filter(payroll => payroll.status === filters.status);
      }
      
      if (filters.dateRange.start) {
        filteredPayrolls = filteredPayrolls.filter(payroll => 
          payroll.startDate >= filters.dateRange.start! || 
          payroll.endDate >= filters.dateRange.start!
        );
      }
      
      if (filters.dateRange.end) {
        filteredPayrolls = filteredPayrolls.filter(payroll => 
          payroll.startDate <= filters.dateRange.end! || 
          payroll.endDate <= filters.dateRange.end!
        );
      }
    }
    
    return filteredPayrolls.sort((a, b) => {
      // Sort by year (descending) and then by month (descending)
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }

  static async getPayrollById(id: string): Promise<Payroll | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return payrolls.find(payroll => payroll.id === id) || null;
  }

  static async createPayroll(data: PayrollFormData, userId: string, userName: string): Promise<Payroll> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if payroll already exists for this month and year
    const existingPayroll = payrolls.find(
      payroll => payroll.month === data.month && payroll.year === data.year
    );
    
    if (existingPayroll) {
      throw new Error('Payroll already exists for this month and year');
    }
    
    // Get all active employees
    const employees = await EmployeeService.getEmployees({
      search: '',
      department: 'all',
      status: 'active',
      dateRange: {},
    });
    
    const newPayroll: Payroll = {
      id: nextPayrollId.toString(),
      month: data.month,
      year: data.year,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'draft',
      totalAmount: 0, // Will be calculated after adding items
      employeeCount: employees.length,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      createdByName: userName,
    };
    
    payrolls.push(newPayroll);
    nextPayrollId++;
    
    // Create payroll items for each employee
    const newItems: PayrollItem[] = [];
    let totalAmount = 0;
    
    for (const employee of employees) {
      // Get attendance summary for the month
      const attendanceSummary = await AttendanceService.getAttendanceSummary(data.month, data.year);
      
      // Calculate base salary
      let baseSalary = employee.salary;
      if (employee.salaryType === 'yearly') {
        baseSalary = employee.salary / 12;
      } else if (employee.salaryType === 'hourly') {
        const workHours = attendanceSummary.totalWorkHours[employee.id] || 0;
        baseSalary = employee.salary * workHours;
      }
      
      // Calculate allowances (40% HRA + fixed allowances)
      const allowances = (baseSalary * 0.4) + 300; // 300 = transport + medical
      
      // Calculate deductions (12% PF + fixed deductions)
      const deductions = (baseSalary * 0.12) + 200; // 200 = professional tax
      
      // Calculate tax (10% of base salary)
      const tax = baseSalary * 0.1;
      
      // Calculate net salary
      const netSalary = baseSalary + allowances - deductions - tax;
      
      const newItem: PayrollItem = {
        id: nextItemId.toString(),
        payrollId: newPayroll.id,
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        position: employee.position,
        department: employee.department,
        baseSalary,
        allowances,
        overtime: 0,
        bonus: 0,
        deductions,
        tax,
        netSalary,
        status: 'pending',
        notes: `Salary for ${new Date(data.year, data.month - 1).toLocaleString('default', { month: 'long' })} ${data.year}`,
      };
      
      newItems.push(newItem);
      nextItemId++;
      
      totalAmount += netSalary;
    }
    
    // Update payroll total amount
    const payrollIndex = payrolls.findIndex(p => p.id === newPayroll.id);
    if (payrollIndex !== -1) {
      payrolls[payrollIndex].totalAmount = totalAmount;
    }
    
    // Add items to payrollItems array
    payrollItems.push(...newItems);
    
    return newPayroll;
  }

  static async processPayroll(id: string, userId: string, userName: string): Promise<Payroll> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const payrollIndex = payrolls.findIndex(payroll => payroll.id === id);
    if (payrollIndex === -1) {
      throw new Error('Payroll not found');
    }
    
    if (payrolls[payrollIndex].status !== 'draft') {
      throw new Error('Payroll is not in draft status');
    }
    
    // Update payroll status
    payrolls[payrollIndex] = {
      ...payrolls[payrollIndex],
      status: 'processing',
      updatedAt: new Date().toISOString(),
    };
    
    // Generate payslips for each payroll item
    const items = payrollItems.filter(item => item.payrollId === id);
    const newPayslips: Payslip[] = [];
    
    for (const item of items) {
      const payslip: Payslip = {
        id: item.id,
        payrollItemId: item.id,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        position: item.position,
        department: item.department,
        month: payrolls[payrollIndex].month,
        year: payrolls[payrollIndex].year,
        payPeriod: `${payrolls[payrollIndex].startDate} - ${payrolls[payrollIndex].endDate}`,
        baseSalary: item.baseSalary,
        earnings: [
          { type: 'Basic Salary', amount: item.baseSalary },
          { type: 'House Rent Allowance', amount: item.baseSalary * 0.4 },
          { type: 'Transport Allowance', amount: 200 },
          { type: 'Medical Allowance', amount: 100 },
          ...(item.overtime ? [{ type: 'Overtime', amount: item.overtime }] : []),
          ...(item.bonus ? [{ type: 'Bonus', amount: item.bonus }] : []),
        ],
        deductions: [
          { type: 'Income Tax', amount: item.tax },
          { type: 'Provident Fund', amount: item.baseSalary * 0.12 },
          { type: 'Professional Tax', amount: 200 },
        ],
        grossSalary: item.baseSalary + item.allowances + item.overtime + item.bonus,
        totalDeductions: item.deductions + item.tax,
        netSalary: item.netSalary,
        createdAt: new Date().toISOString(),
      };
      
      newPayslips.push(payslip);
    }
    
    // Add payslips to payslips array
    payslips.push(...newPayslips);
    
    // Update payroll status to completed
    payrolls[payrollIndex] = {
      ...payrolls[payrollIndex],
      status: 'completed',
      processedAt: new Date().toISOString(),
      processedBy: userId,
      processedByName: userName,
      updatedAt: new Date().toISOString(),
    };
    
    return payrolls[payrollIndex];
  }

  static async updatePayrollItem(id: string, data: Partial<PayrollItem>): Promise<PayrollItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const itemIndex = payrollItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Payroll item not found');
    }
    
    // Calculate net salary if any of the components changed
    let netSalary = payrollItems[itemIndex].netSalary;
    if (data.baseSalary !== undefined || data.allowances !== undefined || 
        data.overtime !== undefined || data.bonus !== undefined || 
        data.deductions !== undefined || data.tax !== undefined) {
      
      const baseSalary = data.baseSalary !== undefined ? data.baseSalary : payrollItems[itemIndex].baseSalary;
      const allowances = data.allowances !== undefined ? data.allowances : payrollItems[itemIndex].allowances;
      const overtime = data.overtime !== undefined ? data.overtime : payrollItems[itemIndex].overtime;
      const bonus = data.bonus !== undefined ? data.bonus : payrollItems[itemIndex].bonus;
      const deductions = data.deductions !== undefined ? data.deductions : payrollItems[itemIndex].deductions;
      const tax = data.tax !== undefined ? data.tax : payrollItems[itemIndex].tax;
      
      netSalary = baseSalary + allowances + overtime + bonus - deductions - tax;
    }
    
    payrollItems[itemIndex] = {
      ...payrollItems[itemIndex],
      ...data,
      netSalary,
    };
    
    // Update payroll total amount
    const payrollId = payrollItems[itemIndex].payrollId;
    const payrollItems2 = payrollItems.filter(item => item.payrollId === payrollId);
    const totalAmount = payrollItems2.reduce((sum, item) => sum + item.netSalary, 0);
    
    const payrollIndex = payrolls.findIndex(payroll => payroll.id === payrollId);
    if (payrollIndex !== -1) {
      payrolls[payrollIndex].totalAmount = totalAmount;
      payrolls[payrollIndex].updatedAt = new Date().toISOString();
    }
    
    // Update payslip if exists
    const payslipIndex = payslips.findIndex(payslip => payslip.payrollItemId === id);
    if (payslipIndex !== -1) {
      payslips[payslipIndex] = {
        ...payslips[payslipIndex],
        baseSalary: payrollItems[itemIndex].baseSalary,
        earnings: [
          { type: 'Basic Salary', amount: payrollItems[itemIndex].baseSalary },
          { type: 'House Rent Allowance', amount: payrollItems[itemIndex].baseSalary * 0.4 },
          { type: 'Transport Allowance', amount: 200 },
          { type: 'Medical Allowance', amount: 100 },
          ...(payrollItems[itemIndex].overtime ? [{ type: 'Overtime', amount: payrollItems[itemIndex].overtime }] : []),
          ...(payrollItems[itemIndex].bonus ? [{ type: 'Bonus', amount: payrollItems[itemIndex].bonus }] : []),
        ],
        deductions: [
          { type: 'Income Tax', amount: payrollItems[itemIndex].tax },
          { type: 'Provident Fund', amount: payrollItems[itemIndex].baseSalary * 0.12 },
          { type: 'Professional Tax', amount: 200 },
        ],
        grossSalary: payrollItems[itemIndex].baseSalary + payrollItems[itemIndex].allowances + 
                     payrollItems[itemIndex].overtime + payrollItems[itemIndex].bonus,
        totalDeductions: payrollItems[itemIndex].deductions + payrollItems[itemIndex].tax,
        netSalary: payrollItems[itemIndex].netSalary,
        paymentMethod: payrollItems[itemIndex].paymentMethod,
        paymentReference: payrollItems[itemIndex].paymentReference,
        paymentDate: payrollItems[itemIndex].paymentDate,
        notes: payrollItems[itemIndex].notes,
      };
    }
    
    return payrollItems[itemIndex];
  }

  static async markPayrollItemAsPaid(id: string, paymentMethod: string, paymentReference: string, paymentDate: string): Promise<PayrollItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const itemIndex = payrollItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Payroll item not found');
    }
    
    payrollItems[itemIndex] = {
      ...payrollItems[itemIndex],
      status: 'paid',
      paymentMethod,
      paymentReference,
      paymentDate,
    };
    
    // Update payslip if exists
    const payslipIndex = payslips.findIndex(payslip => payslip.payrollItemId === id);
    if (payslipIndex !== -1) {
      payslips[payslipIndex] = {
        ...payslips[payslipIndex],
        paymentMethod,
        paymentReference,
        paymentDate,
      };
    }
    
    return payrollItems[itemIndex];
  }

  static async getPayrollItems(payrollId: string): Promise<PayrollItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return payrollItems.filter(item => item.payrollId === payrollId);
  }

  static async getPayrollItemById(id: string): Promise<PayrollItem | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return payrollItems.find(item => item.id === id) || null;
  }

  static async getPayslip(id: string): Promise<Payslip | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return payslips.find(payslip => payslip.id === id) || null;
  }

  static async getEmployeePayslips(employeeId: string): Promise<Payslip[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return payslips.filter(payslip => payslip.employeeId === employeeId)
      .sort((a, b) => {
        // Sort by year (descending) and then by month (descending)
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }

  static async getSalaryComponents(): Promise<SalaryComponent[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return salaryComponents;
  }

  static async createSalaryComponent(data: Omit<SalaryComponent, 'id'>): Promise<SalaryComponent> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComponent: SalaryComponent = {
      ...data,
      id: nextComponentId.toString(),
    };
    
    salaryComponents.push(newComponent);
    nextComponentId++;
    
    return newComponent;
  }

  static async updateSalaryComponent(id: string, data: Partial<SalaryComponent>): Promise<SalaryComponent> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = salaryComponents.findIndex(component => component.id === id);
    if (index === -1) {
      throw new Error('Salary component not found');
    }
    
    salaryComponents[index] = {
      ...salaryComponents[index],
      ...data,
    };
    
    return salaryComponents[index];
  }

  static async deleteSalaryComponent(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = salaryComponents.findIndex(component => component.id === id);
    if (index === -1) {
      throw new Error('Salary component not found');
    }
    
    if (salaryComponents[index].isDefault) {
      throw new Error('Cannot delete default salary component');
    }
    
    salaryComponents.splice(index, 1);
  }
}