import { Payment, PaymentFilters, Invoice, PaymentSummary } from '../types';

// Mock invoices data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    clientId: '1',
    clientName: 'John Smith',
    total: 6825.00,
    paid: 3000.00,
    balance: 3825.00,
    status: 'partial',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    number: 'INV-2024-002',
    clientId: '2',
    clientName: 'Emily Davis',
    total: 2070.00,
    paid: 0.00,
    balance: 2070.00,
    status: 'sent',
    dueDate: '2024-02-28',
    createdAt: '2024-01-18T09:00:00Z',
  },
  {
    id: '3',
    number: 'INV-2024-003',
    clientId: '3',
    clientName: 'Michael Brown',
    total: 4850.00,
    paid: 4850.00,
    balance: 0.00,
    status: 'paid',
    dueDate: '2024-03-01',
    createdAt: '2024-01-20T14:00:00Z',
  },
];

// Mock payments data
const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    invoiceNumber: 'INV-2024-001',
    clientId: '1',
    clientName: 'John Smith',
    amount: 2000.00,
    paymentDate: '2024-01-25',
    paymentMethod: 'bank_transfer',
    reference: 'TXN-001-2024',
    notes: 'Partial payment - first installment',
    status: 'completed',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    processedBy: '1',
    processedByName: 'John Admin',
    processedAt: '2024-01-25T10:30:00Z',
  },
  {
    id: '2',
    invoiceId: '1',
    invoiceNumber: 'INV-2024-001',
    clientId: '1',
    clientName: 'John Smith',
    amount: 1000.00,
    paymentDate: '2024-01-28',
    paymentMethod: 'card',
    reference: 'CC-4532-XXXX',
    notes: 'Partial payment - second installment',
    status: 'completed',
    createdAt: '2024-01-28T14:00:00Z',
    updatedAt: '2024-01-28T14:15:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    processedBy: '2',
    processedByName: 'Jane Staff',
    processedAt: '2024-01-28T14:15:00Z',
  },
  {
    id: '3',
    invoiceId: '3',
    invoiceNumber: 'INV-2024-003',
    clientId: '3',
    clientName: 'Michael Brown',
    amount: 4850.00,
    paymentDate: '2024-01-30',
    paymentMethod: 'check',
    reference: 'CHK-789456',
    notes: 'Full payment by check',
    status: 'completed',
    createdAt: '2024-01-30T09:00:00Z',
    updatedAt: '2024-01-30T11:00:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    processedBy: '1',
    processedByName: 'John Admin',
    processedAt: '2024-01-30T11:00:00Z',
  },
  {
    id: '4',
    invoiceId: '2',
    invoiceNumber: 'INV-2024-002',
    clientId: '2',
    clientName: 'Emily Davis',
    amount: 1000.00,
    paymentDate: '2024-02-01',
    paymentMethod: 'online',
    reference: 'PAY-ONLINE-001',
    notes: 'Partial payment via online portal',
    status: 'pending',
    createdAt: '2024-02-01T16:00:00Z',
    updatedAt: '2024-02-01T16:00:00Z',
    createdBy: '4',
    createdByName: 'Bob Customer',
  },
];

let payments = [...mockPayments];
let invoices = [...mockInvoices];
let nextId = 5;

export class PaymentService {
  static async getPayments(filters?: PaymentFilters): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredPayments = [...payments];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredPayments = filteredPayments.filter(payment =>
          payment.invoiceNumber.toLowerCase().includes(search) ||
          payment.clientName.toLowerCase().includes(search) ||
          payment.reference?.toLowerCase().includes(search)
        );
      }
      
      if (filters.invoiceId && filters.invoiceId !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.invoiceId === filters.invoiceId);
      }
      
      if (filters.clientId && filters.clientId !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.clientId === filters.clientId);
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
      }
      
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.paymentMethod === filters.paymentMethod);
      }
      
      if (filters.dateRange.start) {
        filteredPayments = filteredPayments.filter(payment => 
          new Date(payment.paymentDate) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredPayments = filteredPayments.filter(payment => 
          new Date(payment.paymentDate) <= new Date(filters.dateRange.end!)
        );
      }
      
      if (filters.amountRange.min !== undefined) {
        filteredPayments = filteredPayments.filter(payment => payment.amount >= filters.amountRange.min!);
      }
      
      if (filters.amountRange.max !== undefined) {
        filteredPayments = filteredPayments.filter(payment => payment.amount <= filters.amountRange.max!);
      }
    }
    
    return filteredPayments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  static async getPaymentById(id: string): Promise<Payment | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return payments.find(payment => payment.id === id) || null;
  }

  static async createPayment(paymentData: Omit<Payment, 'id' | 'invoiceNumber' | 'clientId' | 'clientName' | 'createdAt' | 'updatedAt' | 'createdByName' | 'processedBy' | 'processedByName' | 'processedAt'>): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const invoice = invoices.find(inv => inv.id === paymentData.invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const newPayment: Payment = {
      ...paymentData,
      id: nextId.toString(),
      invoiceNumber: invoice.number,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByName: 'Current User',
    };
    
    if (paymentData.status === 'completed') {
      newPayment.processedBy = paymentData.createdBy;
      newPayment.processedByName = 'Current User';
      newPayment.processedAt = new Date().toISOString();
      
      // Update invoice paid amount and status
      const invoiceIndex = invoices.findIndex(inv => inv.id === paymentData.invoiceId);
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex].paid += paymentData.amount;
        invoices[invoiceIndex].balance = invoices[invoiceIndex].total - invoices[invoiceIndex].paid;
        
        if (invoices[invoiceIndex].balance <= 0) {
          invoices[invoiceIndex].status = 'paid';
        } else if (invoices[invoiceIndex].paid > 0) {
          invoices[invoiceIndex].status = 'partial';
        }
      }
    }
    
    payments.push(newPayment);
    nextId++;
    
    return newPayment;
  }

  static async updatePayment(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = payments.findIndex(payment => payment.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }
    
    const oldPayment = payments[index];
    const wasCompleted = oldPayment.status === 'completed';
    const willBeCompleted = paymentData.status === 'completed';
    
    payments[index] = {
      ...payments[index],
      ...paymentData,
      updatedAt: new Date().toISOString(),
    };
    
    // Handle status changes and invoice updates
    if (!wasCompleted && willBeCompleted) {
      payments[index].processedBy = '1'; // Mock current user
      payments[index].processedByName = 'Current User';
      payments[index].processedAt = new Date().toISOString();
      
      // Add to invoice paid amount
      const invoiceIndex = invoices.findIndex(inv => inv.id === oldPayment.invoiceId);
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex].paid += payments[index].amount;
        invoices[invoiceIndex].balance = invoices[invoiceIndex].total - invoices[invoiceIndex].paid;
        
        if (invoices[invoiceIndex].balance <= 0) {
          invoices[invoiceIndex].status = 'paid';
        } else if (invoices[invoiceIndex].paid > 0) {
          invoices[invoiceIndex].status = 'partial';
        }
      }
    } else if (wasCompleted && !willBeCompleted) {
      // Remove from invoice paid amount
      const invoiceIndex = invoices.findIndex(inv => inv.id === oldPayment.invoiceId);
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex].paid -= oldPayment.amount;
        invoices[invoiceIndex].balance = invoices[invoiceIndex].total - invoices[invoiceIndex].paid;
        
        if (invoices[invoiceIndex].paid <= 0) {
          invoices[invoiceIndex].status = 'sent';
        } else {
          invoices[invoiceIndex].status = 'partial';
        }
      }
    }
    
    return payments[index];
  }

  static async deletePayment(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = payments.findIndex(payment => payment.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }
    
    const payment = payments[index];
    
    // If payment was completed, update invoice
    if (payment.status === 'completed') {
      const invoiceIndex = invoices.findIndex(inv => inv.id === payment.invoiceId);
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex].paid -= payment.amount;
        invoices[invoiceIndex].balance = invoices[invoiceIndex].total - invoices[invoiceIndex].paid;
        
        if (invoices[invoiceIndex].paid <= 0) {
          invoices[invoiceIndex].status = 'sent';
        } else {
          invoices[invoiceIndex].status = 'partial';
        }
      }
    }
    
    payments.splice(index, 1);
  }

  static async getInvoices(): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return invoices.filter(invoice => invoice.balance > 0); // Only return invoices with outstanding balance
  }

  static async getClients(): Promise<Array<{ id: string; name: string }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const uniqueClients = Array.from(
      new Map(invoices.map(inv => [inv.clientId, { id: inv.clientId, name: inv.clientName }])).values()
    );
    return uniqueClients;
  }

  static async getPaymentSummary(): Promise<PaymentSummary> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalPayments = payments.length;
    const totalAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    
    const methods = ['cash', 'card', 'bank_transfer', 'check', 'online'];
    const methodBreakdown = methods.map(method => {
      const methodPayments = payments.filter(p => p.paymentMethod === method && p.status === 'completed');
      return {
        method,
        amount: methodPayments.reduce((sum, p) => sum + p.amount, 0),
        count: methodPayments.length,
      };
    }).filter(item => item.count > 0);
    
    return {
      totalPayments,
      totalAmount,
      pendingPayments,
      completedPayments,
      methodBreakdown,
    };
  }
}