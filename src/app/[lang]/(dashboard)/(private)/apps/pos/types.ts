export interface POSProduct {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  imageUrl?: string;
  taxRate: number;
  discountable: boolean;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
}

export interface Sale {
  id: string;
  number: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'check' | 'multiple';
  paymentDetails?: {
    cash?: {
      amount: number;
      change: number;
    };
    card?: {
      amount: number;
      reference: string;
      last4?: string;
    };
    upi?: {
      amount: number;
      reference: string;
    };
    bankTransfer?: {
      amount: number;
      reference: string;
    };
    check?: {
      amount: number;
      reference: string;
    };
  };
  customerId?: string;
  customerName?: string;
  notes?: string;
  status: 'completed' | 'refunded' | 'partially_refunded';
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface SaleFilters {
  search: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  paymentMethod?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalAmount: number;
  averageAmount: number;
  paymentMethodBreakdown: {
    method: string;
    count: number;
    amount: number;
  }[];
  hourlyBreakdown: {
    hour: number;
    count: number;
    amount: number;
  }[];
}