export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check' | 'online';
  reference?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  processedBy?: string;
  processedByName?: string;
  processedAt?: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  total: number;
  paid: number;
  balance: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export interface PaymentFormData {
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check' | 'online';
  reference?: string;
  notes?: string;
  status: 'pending' | 'completed';
}

export interface PaymentFilters {
  search: string;
  invoiceId: string;
  clientId: string;
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

export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  pendingPayments: number;
  completedPayments: number;
  methodBreakdown: { method: string; amount: number; count: number }[];
}