export interface Expense {
  id: string;
  date: string;
  amount: number;
  vendor: string;
  category: string;
  description: string;
  notes?: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check';
  reference?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
}

export interface ExpenseFormData {
  date: string;
  amount: number;
  vendor: string;
  category: string;
  description: string;
  notes?: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check';
  reference?: string;
  status: 'pending' | 'approved';
}

export interface ExpenseFilters {
  search: string;
  category: string;
  status: string;
  paymentMethod: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  amountRange: {
    min?: number;
    max?: number;
  };
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}