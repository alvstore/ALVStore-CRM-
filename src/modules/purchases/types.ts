export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: PurchaseOrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  receivedItems: ReceivedItem[];
}

export interface PurchaseOrderItem {
  id: string;
  productId?: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQuantity: number;
}

export interface ReceivedItem {
  id: string;
  purchaseOrderItemId: string;
  quantity: number;
  receivedDate: string;
  receivedBy: string;
  receivedByName: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson?: string;
  paymentTerms?: string;
  taxId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderFormData {
  supplierId: string;
  items: PurchaseOrderItem[];
  taxRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  orderDate: string;
  expectedDeliveryDate?: string;
  notes?: string;
  terms?: string;
  status: 'draft' | 'sent';
}

export interface PurchaseOrderFilters {
  search: string;
  status: string;
  supplierId: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface ReceiveStockData {
  purchaseOrderId: string;
  items: {
    itemId: string;
    receivedQuantity: number;
    notes?: string;
  }[];
  receivedDate: string;
  notes?: string;
}