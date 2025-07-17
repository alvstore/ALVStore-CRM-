export interface Quote {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  convertedToInvoice?: boolean;
  invoiceId?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuoteFormData {
  clientId: string;
  items: QuoteItem[];
  taxRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;
  notes?: string;
  terms?: string;
  status: 'draft' | 'sent';
}

export interface QuoteFilters {
  search: string;
  status: string;
  clientId: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface ConvertToInvoiceData {
  quoteId: string;
  dueDate: string;
  notes?: string;
}