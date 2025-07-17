import { Quote, QuoteFilters, ConvertToInvoiceData } from '../types';

// Mock clients data for quotes
const mockClients = [
  { id: '1', name: 'John Smith', email: 'john@techsolutions.com', phone: '+1234567890' },
  { id: '2', name: 'Emily Davis', email: 'emily@creativeagency.com', phone: '+1234567892' },
  { id: '3', name: 'Michael Brown', email: 'michael@manufacturing.com', phone: '+1234567893' },
];

// Mock quotes data
const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'QUO-2024-001',
    clientId: '1',
    clientName: 'John Smith',
    clientEmail: 'john@techsolutions.com',
    clientPhone: '+1234567890',
    clientAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    items: [
      {
        id: '1',
        description: 'Website Development',
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
      },
      {
        id: '2',
        description: 'SEO Optimization',
        quantity: 3,
        unitPrice: 500,
        total: 1500,
      },
    ],
    subtotal: 6500,
    taxRate: 10,
    taxAmount: 650,
    discountType: 'percentage',
    discountValue: 5,
    discountAmount: 325,
    total: 6825,
    status: 'sent',
    validUntil: '2024-02-15T23:59:59Z',
    notes: 'Please review and let us know if you have any questions.',
    terms: 'Payment due within 30 days of acceptance.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    sentAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '2',
    number: 'QUO-2024-002',
    clientId: '2',
    clientName: 'Emily Davis',
    clientEmail: 'emily@creativeagency.com',
    clientPhone: '+1234567892',
    clientAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    items: [
      {
        id: '1',
        description: 'Logo Design',
        quantity: 1,
        unitPrice: 1200,
        total: 1200,
      },
      {
        id: '2',
        description: 'Brand Guidelines',
        quantity: 1,
        unitPrice: 800,
        total: 800,
      },
    ],
    subtotal: 2000,
    taxRate: 8.5,
    taxAmount: 170,
    discountType: 'fixed',
    discountValue: 100,
    discountAmount: 100,
    total: 2070,
    status: 'accepted',
    validUntil: '2024-02-28T23:59:59Z',
    notes: 'Excited to work on this project!',
    terms: 'Payment due within 15 days of acceptance.',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    sentAt: '2024-01-19T10:00:00Z',
    acceptedAt: '2024-01-22T11:15:00Z',
    convertedToInvoice: true,
    invoiceId: 'INV-2024-001',
  },
  {
    id: '3',
    number: 'QUO-2024-003',
    clientId: '3',
    clientName: 'Michael Brown',
    clientEmail: 'michael@manufacturing.com',
    clientPhone: '+1234567893',
    clientAddress: {
      street: '789 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    items: [
      {
        id: '1',
        description: 'Manufacturing Software License',
        quantity: 10,
        unitPrice: 200,
        total: 2000,
      },
      {
        id: '2',
        description: 'Implementation & Training',
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
      },
    ],
    subtotal: 5000,
    taxRate: 7,
    taxAmount: 350,
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 500,
    total: 4850,
    status: 'draft',
    validUntil: '2024-03-01T23:59:59Z',
    notes: 'Volume discount applied for 10+ licenses.',
    terms: 'Payment due within 45 days of acceptance.',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
];

let quotes = [...mockQuotes];
let nextQuoteNumber = 4;

export class QuoteService {
  static async getQuotes(filters?: QuoteFilters): Promise<Quote[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredQuotes = [...quotes];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredQuotes = filteredQuotes.filter(quote =>
          quote.number.toLowerCase().includes(search) ||
          quote.clientName.toLowerCase().includes(search) ||
          quote.clientEmail.toLowerCase().includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredQuotes = filteredQuotes.filter(quote => quote.status === filters.status);
      }
      
      if (filters.clientId && filters.clientId !== 'all') {
        filteredQuotes = filteredQuotes.filter(quote => quote.clientId === filters.clientId);
      }
      
      if (filters.dateRange.start) {
        filteredQuotes = filteredQuotes.filter(quote => 
          new Date(quote.createdAt) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredQuotes = filteredQuotes.filter(quote => 
          new Date(quote.createdAt) <= new Date(filters.dateRange.end!)
        );
      }
    }
    
    return filteredQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getQuoteById(id: string): Promise<Quote | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return quotes.find(quote => quote.id === id) || null;
  }

  static async createQuote(quoteData: Omit<Quote, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'clientName' | 'clientEmail' | 'clientPhone' | 'clientAddress' | 'createdByName' | 'subtotal' | 'taxAmount' | 'discountAmount' | 'total'>): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const client = mockClients.find(c => c.id === quoteData.clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Calculate totals
    const subtotal = quoteData.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = quoteData.discountType === 'percentage' 
      ? (subtotal * quoteData.discountValue) / 100
      : quoteData.discountValue;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * quoteData.taxRate) / 100;
    const total = taxableAmount + taxAmount;
    
    const newQuote: Quote = {
      ...quoteData,
      id: nextQuoteNumber.toString(),
      number: `QUO-2024-${nextQuoteNumber.toString().padStart(3, '0')}`,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: {
        street: '123 Default St',
        city: 'Default City',
        state: 'ST',
        zipCode: '12345',
        country: 'USA',
      },
      subtotal,
      taxAmount,
      discountAmount,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByName: 'Current User',
    };
    
    quotes.push(newQuote);
    nextQuoteNumber++;
    
    return newQuote;
  }

  static async updateQuote(id: string, quoteData: Partial<Quote>): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = quotes.findIndex(quote => quote.id === id);
    if (index === -1) {
      throw new Error('Quote not found');
    }
    
    // Recalculate totals if items or rates changed
    if (quoteData.items || quoteData.taxRate !== undefined || quoteData.discountValue !== undefined || quoteData.discountType) {
      const items = quoteData.items || quotes[index].items;
      const taxRate = quoteData.taxRate !== undefined ? quoteData.taxRate : quotes[index].taxRate;
      const discountType = quoteData.discountType || quotes[index].discountType;
      const discountValue = quoteData.discountValue !== undefined ? quoteData.discountValue : quotes[index].discountValue;
      
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const discountAmount = discountType === 'percentage' 
        ? (subtotal * discountValue) / 100
        : discountValue;
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (taxableAmount * taxRate) / 100;
      const total = taxableAmount + taxAmount;
      
      quoteData.subtotal = subtotal;
      quoteData.taxAmount = taxAmount;
      quoteData.discountAmount = discountAmount;
      quoteData.total = total;
    }
    
    quotes[index] = {
      ...quotes[index],
      ...quoteData,
      updatedAt: new Date().toISOString(),
    };
    
    return quotes[index];
  }

  static async deleteQuote(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = quotes.findIndex(quote => quote.id === id);
    if (index === -1) {
      throw new Error('Quote not found');
    }
    
    quotes.splice(index, 1);
  }

  static async convertToInvoice(data: ConvertToInvoiceData): Promise<{ success: boolean; invoiceId: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const quote = quotes.find(q => q.id === data.quoteId);
    if (!quote) {
      throw new Error('Quote not found');
    }
    
    if (quote.status !== 'accepted') {
      throw new Error('Only accepted quotes can be converted to invoices');
    }
    
    if (quote.convertedToInvoice) {
      throw new Error('Quote has already been converted to an invoice');
    }
    
    // Generate mock invoice ID
    const invoiceId = `INV-2024-${Date.now().toString().slice(-3)}`;
    
    // Update quote to mark as converted
    const index = quotes.findIndex(q => q.id === data.quoteId);
    quotes[index] = {
      ...quotes[index],
      convertedToInvoice: true,
      invoiceId,
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app, this would create an actual invoice record
    console.log('Created invoice:', {
      id: invoiceId,
      quoteId: data.quoteId,
      dueDate: data.dueDate,
      notes: data.notes,
      ...quote,
    });
    
    return {
      success: true,
      invoiceId,
    };
  }

  static async getClients(): Promise<Array<{ id: string; name: string; email: string }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockClients;
  }

  static async updateQuoteStatus(id: string, status: Quote['status']): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updateData: Partial<Quote> = { status };
    
    if (status === 'sent' && !quotes.find(q => q.id === id)?.sentAt) {
      updateData.sentAt = new Date().toISOString();
    } else if (status === 'accepted') {
      updateData.acceptedAt = new Date().toISOString();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date().toISOString();
    }
    
    return this.updateQuote(id, updateData);
  }
}