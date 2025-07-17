import { create } from 'zustand';
import { 
  Payroll, 
  PayrollItem, 
  Payslip, 
  SalaryComponent,
  PayrollFilters
} from '../types';
import { PayrollService } from '../services/payrollService';

interface PayrollState {
  payrolls: Payroll[];
  selectedPayroll: Payroll | null;
  payrollItems: PayrollItem[];
  selectedPayrollItem: PayrollItem | null;
  payslips: Payslip[];
  selectedPayslip: Payslip | null;
  salaryComponents: SalaryComponent[];
  loading: boolean;
  error: string | null;
  filters: PayrollFilters;
  
  // Payroll actions
  fetchPayrolls: () => Promise<void>;
  fetchPayrollById: (id: string) => Promise<void>;
  createPayroll: (data: any, userId: string, userName: string) => Promise<void>;
  processPayroll: (id: string, userId: string, userName: string) => Promise<void>;
  
  // Payroll item actions
  fetchPayrollItems: (payrollId: string) => Promise<void>;
  fetchPayrollItemById: (id: string) => Promise<void>;
  updatePayrollItem: (id: string, data: any) => Promise<void>;
  markPayrollItemAsPaid: (id: string, paymentMethod: string, paymentReference: string, paymentDate: string) => Promise<void>;
  
  // Payslip actions
  fetchPayslip: (id: string) => Promise<void>;
  fetchEmployeePayslips: (employeeId: string) => Promise<void>;
  
  // Salary component actions
  fetchSalaryComponents: () => Promise<void>;
  createSalaryComponent: (data: any) => Promise<void>;
  updateSalaryComponent: (id: string, data: any) => Promise<void>;
  deleteSalaryComponent: (id: string) => Promise<void>;
  
  // Filter actions
  setFilters: (filters: Partial<PayrollFilters>) => void;
  clearError: () => void;
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  payrolls: [],
  selectedPayroll: null,
  payrollItems: [],
  selectedPayrollItem: null,
  payslips: [],
  selectedPayslip: null,
  salaryComponents: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    dateRange: {},
  },

  // Payroll actions
  fetchPayrolls: async () => {
    set({ loading: true, error: null });
    try {
      const payrolls = await PayrollService.getPayrolls(get().filters);
      set({ payrolls, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payrolls', loading: false });
    }
  },

  fetchPayrollById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const payroll = await PayrollService.getPayrollById(id);
      set({ selectedPayroll: payroll, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payroll', loading: false });
    }
  },

  createPayroll: async (data: any, userId: string, userName: string) => {
    set({ loading: true, error: null });
    try {
      const newPayroll = await PayrollService.createPayroll(data, userId, userName);
      set(state => ({ 
        payrolls: [newPayroll, ...state.payrolls], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create payroll', loading: false });
      throw error;
    }
  },

  processPayroll: async (id: string, userId: string, userName: string) => {
    set({ loading: true, error: null });
    try {
      const processedPayroll = await PayrollService.processPayroll(id, userId, userName);
      set(state => ({
        payrolls: state.payrolls.map(payroll => 
          payroll.id === id ? processedPayroll : payroll
        ),
        selectedPayroll: state.selectedPayroll?.id === id ? processedPayroll : state.selectedPayroll,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to process payroll', loading: false });
      throw error;
    }
  },

  // Payroll item actions
  fetchPayrollItems: async (payrollId: string) => {
    set({ loading: true, error: null });
    try {
      const payrollItems = await PayrollService.getPayrollItems(payrollId);
      set({ payrollItems, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payroll items', loading: false });
    }
  },

  fetchPayrollItemById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const payrollItem = await PayrollService.getPayrollItemById(id);
      set({ selectedPayrollItem: payrollItem, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payroll item', loading: false });
    }
  },

  updatePayrollItem: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const updatedPayrollItem = await PayrollService.updatePayrollItem(id, data);
      set(state => ({
        payrollItems: state.payrollItems.map(item => 
          item.id === id ? updatedPayrollItem : item
        ),
        selectedPayrollItem: state.selectedPayrollItem?.id === id ? updatedPayrollItem : state.selectedPayrollItem,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update payroll item', loading: false });
      throw error;
    }
  },

  markPayrollItemAsPaid: async (id: string, paymentMethod: string, paymentReference: string, paymentDate: string) => {
    set({ loading: true, error: null });
    try {
      const updatedPayrollItem = await PayrollService.markPayrollItemAsPaid(id, paymentMethod, paymentReference, paymentDate);
      set(state => ({
        payrollItems: state.payrollItems.map(item => 
          item.id === id ? updatedPayrollItem : item
        ),
        selectedPayrollItem: state.selectedPayrollItem?.id === id ? updatedPayrollItem : state.selectedPayrollItem,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark payroll item as paid', loading: false });
      throw error;
    }
  },

  // Payslip actions
  fetchPayslip: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const payslip = await PayrollService.getPayslip(id);
      set({ selectedPayslip: payslip, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payslip', loading: false });
    }
  },

  fetchEmployeePayslips: async (employeeId: string) => {
    set({ loading: true, error: null });
    try {
      const payslips = await PayrollService.getEmployeePayslips(employeeId);
      set({ payslips, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch employee payslips', loading: false });
    }
  },

  // Salary component actions
  fetchSalaryComponents: async () => {
    set({ loading: true, error: null });
    try {
      const salaryComponents = await PayrollService.getSalaryComponents();
      set({ salaryComponents, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch salary components', loading: false });
    }
  },

  createSalaryComponent: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const newComponent = await PayrollService.createSalaryComponent(data);
      set(state => ({ 
        salaryComponents: [...state.salaryComponents, newComponent], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create salary component', loading: false });
      throw error;
    }
  },

  updateSalaryComponent: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const updatedComponent = await PayrollService.updateSalaryComponent(id, data);
      set(state => ({
        salaryComponents: state.salaryComponents.map(component => 
          component.id === id ? updatedComponent : component
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update salary component', loading: false });
      throw error;
    }
  },

  deleteSalaryComponent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await PayrollService.deleteSalaryComponent(id);
      set(state => ({
        salaryComponents: state.salaryComponents.filter(component => component.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete salary component', loading: false });
      throw error;
    }
  },

  // Filter actions
  setFilters: (filters: Partial<PayrollFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));