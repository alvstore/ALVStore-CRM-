import { Expense, ExpenseFilters, ExpenseCategory } from '../types';

// Mock expense categories
const mockCategories: ExpenseCategory[] = [
  { id: '1', name: 'Office Supplies', description: 'Stationery, equipment, etc.', color: '#2196f3' },
  { id: '2', name: 'Travel', description: 'Business travel expenses', color: '#4caf50' },
  { id: '3', name: 'Marketing', description: 'Advertising and promotion', color: '#ff9800' },
  { id: '4', name: 'Utilities', description: 'Electricity, internet, phone', color: '#9c27b0' },
  { id: '5', name: 'Software', description: 'Software licenses and subscriptions', color: '#f44336' },
  { id: '6', name: 'Meals', description: 'Business meals and entertainment', color: '#795548' },
  { id: '7', name: 'Equipment', description: 'Hardware and equipment purchases', color: '#607d8b' },
  { id: '8', name: 'Professional Services', description: 'Legal, accounting, consulting', color: '#e91e63' },
];

// Mock expenses data
const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2024-01-20',
    amount: 250.00,
    vendor: 'Office Depot',
    category: 'Office Supplies',
    description: 'Printer paper and ink cartridges',
    notes: 'For main office printer',
    status: 'approved',
    paymentMethod: 'card',
    reference: 'CC-2024-001',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-21T09:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    approvedBy: '1',
    approvedByName: 'John Admin',
    approvedAt: '2024-01-21T09:30:00Z',
  },
  {
    id: '2',
    date: '2024-01-22',
    amount: 1200.00,
    vendor: 'Delta Airlines',
    category: 'Travel',
    description: 'Flight tickets for client meeting in Chicago',
    notes: 'Round trip for 2 people',
    status: 'approved',
    paymentMethod: 'card',
    reference: 'CC-2024-002',
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    approvedBy: '1',
    approvedByName: 'John Admin',
    approvedAt: '2024-01-22T16:45:00Z',
  },
  {
    id: '3',
    date: '2024-01-25',
    amount: 89.99,
    vendor: 'Adobe',
    category: 'Software',
    description: 'Monthly Creative Cloud subscription',
    notes: 'Design team subscription',
    status: 'pending',
    paymentMethod: 'card',
    reference: 'CC-2024-003',
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z',
    createdBy: '3',
    createdByName: 'Mike Technician',
  },
  {
    id: '4',
    date: '2024-01-26',
    amount: 450.00,
    vendor: 'Electric Company',
    category: 'Utilities',
    description: 'Monthly electricity bill',
    notes: 'Office building utilities',
    status: 'approved',
    paymentMethod: 'bank_transfer',
    reference: 'BT-2024-001',
    createdAt: '2024-01-26T08:00:00Z',
    updatedAt: '2024-01-26T10:15:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    approvedBy: '1',
    approvedByName: 'John Admin',
    approvedAt: '2024-01-26T10:15:00Z',
  },
  {
    id: '5',
    date: '2024-01-28',
    amount: 125.50,
    vendor: 'Restaurant ABC',
    category: 'Meals',
    description: 'Client lunch meeting',
    notes: 'Meeting with potential client',
    status: 'pending',
    paymentMethod: 'cash',
    createdAt: '2024-01-28T13:30:00Z',
    updatedAt: '2024-01-28T13:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
];

let expenses = [...mockExpenses];
let nextId = 6;

export class ExpenseService {
  static async getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredExpenses = [...expenses];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredExpenses = filteredExpenses.filter(expense =>
          expense.vendor.toLowerCase().includes(search) ||
          expense.description.toLowerCase().includes(search) ||
          expense.category.toLowerCase().includes(search)
        );
      }
      
      if (filters.category && filters.category !== 'all') {
        filteredExpenses = filteredExpenses.filter(expense => expense.category === filters.category);
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredExpenses = filteredExpenses.filter(expense => expense.status === filters.status);
      }
      
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        filteredExpenses = filteredExpenses.filter(expense => expense.paymentMethod === filters.paymentMethod);
      }
      
      if (filters.dateRange.start) {
        filteredExpenses = filteredExpenses.filter(expense => 
          new Date(expense.date) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredExpenses = filteredExpenses.filter(expense => 
          new Date(expense.date) <= new Date(filters.dateRange.end!)
        );
      }
      
      if (filters.amountRange.min !== undefined) {
        filteredExpenses = filteredExpenses.filter(expense => expense.amount >= filters.amountRange.min!);
      }
      
      if (filters.amountRange.max !== undefined) {
        filteredExpenses = filteredExpenses.filter(expense => expense.amount <= filters.amountRange.max!);
      }
    }
    
    return filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getExpenseById(id: string): Promise<Expense | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return expenses.find(expense => expense.id === id) || null;
  }

  static async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'createdByName' | 'approvedBy' | 'approvedByName' | 'approvedAt'>): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newExpense: Expense = {
      ...expenseData,
      id: nextId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByName: 'Current User',
    };
    
    expenses.push(newExpense);
    nextId++;
    
    return newExpense;
  }

  static async updateExpense(id: string, expenseData: Partial<Expense>): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = expenses.findIndex(expense => expense.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    
    expenses[index] = {
      ...expenses[index],
      ...expenseData,
      updatedAt: new Date().toISOString(),
    };
    
    return expenses[index];
  }

  static async deleteExpense(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = expenses.findIndex(expense => expense.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    
    expenses.splice(index, 1);
  }

  static async approveExpense(id: string, approverId: string, approverName: string): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.updateExpense(id, {
      status: 'approved',
      approvedBy: approverId,
      approvedByName: approverName,
      approvedAt: new Date().toISOString(),
    });
  }

  static async rejectExpense(id: string): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.updateExpense(id, {
      status: 'rejected',
    });
  }

  static async getCategories(): Promise<ExpenseCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories;
  }

  static async getExpenseStats(): Promise<{
    totalExpenses: number;
    pendingExpenses: number;
    approvedExpenses: number;
    totalAmount: number;
    categoryBreakdown: { category: string; amount: number; count: number }[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalExpenses = expenses.length;
    const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
    const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const categoryBreakdown = mockCategories.map(category => {
      const categoryExpenses = expenses.filter(e => e.category === category.name);
      return {
        category: category.name,
        amount: categoryExpenses.reduce((sum, e) => sum + e.amount, 0),
        count: categoryExpenses.length,
      };
    }).filter(item => item.count > 0);
    
    return {
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      totalAmount,
      categoryBreakdown,
    };
  }
}