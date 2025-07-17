import { PurchaseOrder, PurchaseOrderFilters, Supplier, ReceiveStockData } from '../types';

// Mock suppliers data
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Tech Components Ltd',
    email: 'orders@techcomponents.com',
    phone: '+1234567890',
    address: {
      street: '123 Industrial Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    contactPerson: 'John Supplier',
    paymentTerms: 'Net 30',
    taxId: 'TC123456789',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Office Supplies Pro',
    email: 'sales@officesuppliespro.com',
    phone: '+1234567891',
    address: {
      street: '456 Business Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    contactPerson: 'Sarah Manager',
    paymentTerms: 'Net 15',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Hardware Solutions Inc',
    email: 'procurement@hardwaresolutions.com',
    phone: '+1234567892',
    address: {
      street: '789 Manufacturing St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    contactPerson: 'Mike Hardware',
    paymentTerms: 'Net 45',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock purchase orders data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    number: 'PO-2024-001',
    supplierId: '1',
    supplierName: 'Tech Components Ltd',
    supplierEmail: 'orders@techcomponents.com',
    supplierPhone: '+1234567890',
    supplierAddress: {
      street: '123 Industrial Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones',
        quantity: 50,
        unitPrice: 45.00,
        total: 2250.00,
        receivedQuantity: 50,
      },
      {
        id: '2',
        productId: '5',
        productName: 'Wireless Computer Mouse',
        description: 'Ergonomic wireless mouse',
        quantity: 25,
        unitPrice: 18.00,
        total: 450.00,
        receivedQuantity: 25,
      },
    ],
    subtotal: 2700.00,
    taxRate: 8.5,
    taxAmount: 229.50,
    discountType: 'percentage',
    discountValue: 5,
    discountAmount: 135.00,
    total: 2794.50,
    status: 'received',
    orderDate: '2024-01-15',
    expectedDeliveryDate: '2024-01-25',
    receivedDate: '2024-01-24',
    notes: 'Urgent order for new product launch',
    terms: 'Payment due within 30 days of delivery',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-24T14:30:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    receivedItems: [
      {
        id: '1',
        purchaseOrderItemId: '1',
        quantity: 50,
        receivedDate: '2024-01-24',
        receivedBy: '2',
        receivedByName: 'Jane Staff',
        notes: 'All items in good condition',
      },
      {
        id: '2',
        purchaseOrderItemId: '2',
        quantity: 25,
        receivedDate: '2024-01-24',
        receivedBy: '2',
        receivedByName: 'Jane Staff',
        notes: 'Perfect condition',
      },
    ],
  },
  {
    id: '2',
    number: 'PO-2024-002',
    supplierId: '2',
    supplierName: 'Office Supplies Pro',
    supplierEmail: 'sales@officesuppliespro.com',
    supplierPhone: '+1234567891',
    supplierAddress: {
      street: '456 Business Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    items: [
      {
        id: '1',
        productName: 'Office Paper A4',
        description: '500 sheets per pack',
        quantity: 100,
        unitPrice: 5.50,
        total: 550.00,
        receivedQuantity: 0,
      },
      {
        id: '2',
        productName: 'Printer Ink Cartridges',
        description: 'Black ink cartridge set',
        quantity: 20,
        unitPrice: 25.00,
        total: 500.00,
        receivedQuantity: 0,
      },
    ],
    subtotal: 1050.00,
    taxRate: 7.0,
    taxAmount: 73.50,
    discountType: 'fixed',
    discountValue: 50.00,
    discountAmount: 50.00,
    total: 1073.50,
    status: 'confirmed',
    orderDate: '2024-01-20',
    expectedDeliveryDate: '2024-01-30',
    notes: 'Monthly office supplies order',
    terms: 'Payment due within 15 days of delivery',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-21T11:15:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    receivedItems: [],
  },
  {
    id: '3',
    number: 'PO-2024-003',
    supplierId: '3',
    supplierName: 'Hardware Solutions Inc',
    supplierEmail: 'procurement@hardwaresolutions.com',
    supplierPhone: '+1234567892',
    supplierAddress: {
      street: '789 Manufacturing St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    items: [
      {
        id: '1',
        productId: '4',
        productName: 'Professional Screwdriver Set',
        description: '12-piece precision screwdriver set',
        quantity: 30,
        unitPrice: 12.50,
        total: 375.00,
        receivedQuantity: 15,
      },
    ],
    subtotal: 375.00,
    taxRate: 6.0,
    taxAmount: 22.50,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    total: 397.50,
    status: 'sent',
    orderDate: '2024-01-25',
    expectedDeliveryDate: '2024-02-05',
    notes: 'Tools for repair department',
    terms: 'Payment due within 45 days of delivery',
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-28T16:45:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    receivedItems: [
      {
        id: '1',
        purchaseOrderItemId: '1',
        quantity: 15,
        receivedDate: '2024-01-28',
        receivedBy: '3',
        receivedByName: 'Mike Technician',
        notes: 'Partial delivery - remaining items expected next week',
      },
    ],
  },
];

let purchaseOrders = [...mockPurchaseOrders];
let suppliers = [...mockSuppliers];
let nextPONumber = 4;

export class PurchaseOrderService {
  static async getPurchaseOrders(filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredPOs = [...purchaseOrders];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredPOs = filteredPOs.filter(po =>
          po.number.toLowerCase().includes(search) ||
          po.supplierName.toLowerCase().includes(search) ||
          po.items.some(item => item.productName.toLowerCase().includes(search))
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredPOs = filteredPOs.filter(po => po.status === filters.status);
      }
      
      if (filters.supplierId && filters.supplierId !== 'all') {
        filteredPOs = filteredPOs.filter(po => po.supplierId === filters.supplierId);
      }
      
      if (filters.dateRange.start) {
        filteredPOs = filteredPOs.filter(po => 
          new Date(po.orderDate) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredPOs = filteredPOs.filter(po => 
          new Date(po.orderDate) <= new Date(filters.dateRange.end!)
        );
      }
    }
    
    return filteredPOs.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  static async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return purchaseOrders.find(po => po.id === id) || null;
  }

  static async createPurchaseOrder(poData: Omit<PurchaseOrder, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'supplierName' | 'supplierEmail' | 'supplierPhone' | 'supplierAddress' | 'createdByName' | 'subtotal' | 'taxAmount' | 'discountAmount' | 'total' | 'receivedItems'>): Promise<PurchaseOrder> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const supplier = suppliers.find(s => s.id === poData.supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    
    // Calculate totals
    const subtotal = poData.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = poData.discountType === 'percentage' 
      ? (subtotal * poData.discountValue) / 100
      : poData.discountValue;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * poData.taxRate) / 100;
    const total = taxableAmount + taxAmount;
    
    const newPO: PurchaseOrder = {
      ...poData,
      id: nextPONumber.toString(),
      number: `PO-2024-${nextPONumber.toString().padStart(3, '0')}`,
      supplierName: supplier.name,
      supplierEmail: supplier.email,
      supplierPhone: supplier.phone,
      supplierAddress: supplier.address,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByName: 'Current User',
      receivedItems: [],
      items: poData.items.map(item => ({ ...item, receivedQuantity: 0 })),
    };
    
    purchaseOrders.push(newPO);
    nextPONumber++;
    
    return newPO;
  }

  static async updatePurchaseOrder(id: string, poData: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      throw new Error('Purchase order not found');
    }
    
    // Recalculate totals if items or rates changed
    if (poData.items || poData.taxRate !== undefined || poData.discountValue !== undefined || poData.discountType) {
      const items = poData.items || purchaseOrders[index].items;
      const taxRate = poData.taxRate !== undefined ? poData.taxRate : purchaseOrders[index].taxRate;
      const discountType = poData.discountType || purchaseOrders[index].discountType;
      const discountValue = poData.discountValue !== undefined ? poData.discountValue : purchaseOrders[index].discountValue;
      
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const discountAmount = discountType === 'percentage' 
        ? (subtotal * discountValue) / 100
        : discountValue;
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (taxableAmount * taxRate) / 100;
      const total = taxableAmount + taxAmount;
      
      poData.subtotal = subtotal;
      poData.taxAmount = taxAmount;
      poData.discountAmount = discountAmount;
      poData.total = total;
    }
    
    purchaseOrders[index] = {
      ...purchaseOrders[index],
      ...poData,
      updatedAt: new Date().toISOString(),
    };
    
    return purchaseOrders[index];
  }

  static async deletePurchaseOrder(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      throw new Error('Purchase order not found');
    }
    
    purchaseOrders.splice(index, 1);
  }

  static async receiveStock(data: ReceiveStockData): Promise<PurchaseOrder> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const poIndex = purchaseOrders.findIndex(po => po.id === data.purchaseOrderId);
    if (poIndex === -1) {
      throw new Error('Purchase order not found');
    }
    
    const po = purchaseOrders[poIndex];
    
    // Update received quantities and add received items
    data.items.forEach(receivedItem => {
      const itemIndex = po.items.findIndex(item => item.id === receivedItem.itemId);
      if (itemIndex !== -1) {
        po.items[itemIndex].receivedQuantity += receivedItem.receivedQuantity;
        
        // Add to received items history
        po.receivedItems.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          purchaseOrderItemId: receivedItem.itemId,
          quantity: receivedItem.receivedQuantity,
          receivedDate: data.receivedDate,
          receivedBy: '1', // Mock current user
          receivedByName: 'Current User',
          notes: receivedItem.notes,
        });
      }
    });
    
    // Check if all items are fully received
    const allItemsReceived = po.items.every(item => item.receivedQuantity >= item.quantity);
    if (allItemsReceived && po.status !== 'received') {
      po.status = 'received';
      po.receivedDate = data.receivedDate;
    }
    
    po.updatedAt = new Date().toISOString();
    
    return po;
  }

  static async getSuppliers(): Promise<Supplier[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return suppliers.filter(supplier => supplier.status === 'active');
  }

  static async updatePurchaseOrderStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updateData: Partial<PurchaseOrder> = { status };
    
    if (status === 'sent') {
      // Mark as sent
    } else if (status === 'confirmed') {
      // Mark as confirmed by supplier
    }
    
    return this.updatePurchaseOrder(id, updateData);
  }
}