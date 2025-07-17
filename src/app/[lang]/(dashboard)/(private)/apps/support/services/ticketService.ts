import { SupportTicket, TicketComment, TicketFilters, TicketCategory } from '../types';
import { Client } from '@/modules/clients/types';

// Mock ticket categories
const mockCategories: TicketCategory[] = [
  { id: '1', name: 'Technical Issue', description: 'Hardware or software problems', color: '#2196f3' },
  { id: '2', name: 'Billing', description: 'Payment or invoice related issues', color: '#4caf50' },
  { id: '3', name: 'Account', description: 'Account access or settings', color: '#ff9800' },
  { id: '4', name: 'Feature Request', description: 'Suggestions for new features', color: '#9c27b0' },
  { id: '5', name: 'Bug Report', description: 'Reporting software bugs', color: '#f44336' },
  { id: '6', name: 'General Inquiry', description: 'General questions or information', color: '#607d8b' },
];

// Mock support tickets
const mockTickets: SupportTicket[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'John Smith',
    clientEmail: 'john@techsolutions.com',
    subject: 'Unable to access account',
    description: 'I am unable to log in to my account. It says "Invalid credentials" even though I am sure my password is correct.',
    status: 'open',
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'Jane Staff',
    category: 'Account',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: '1',
    createdByName: 'John Smith',
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Emily Davis',
    clientEmail: 'emily@creativeagency.com',
    subject: 'Billing discrepancy on invoice #INV-2024-002',
    description: 'There seems to be a discrepancy in my latest invoice. I was charged for services I did not receive.',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: '2',
    assignedToName: 'Jane Staff',
    category: 'Billing',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
    createdBy: '2',
    createdByName: 'Emily Davis',
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Michael Brown',
    clientEmail: 'michael@manufacturing.com',
    subject: 'Feature request: Bulk import',
    description: 'It would be very helpful if we could import multiple items at once using a CSV file.',
    status: 'open',
    priority: 'low',
    category: 'Feature Request',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    createdBy: '3',
    createdByName: 'Michael Brown',
  },
  {
    id: '4',
    clientId: '1',
    clientName: 'John Smith',
    clientEmail: 'john@techsolutions.com',
    subject: 'Application crashes on startup',
    description: 'After the latest update, the application crashes immediately when I try to open it.',
    status: 'resolved',
    priority: 'urgent',
    assignedTo: '3',
    assignedToName: 'Mike Technician',
    category: 'Technical Issue',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    createdBy: '1',
    createdByName: 'John Smith',
    resolvedAt: '2024-01-12T16:45:00Z',
    resolvedBy: '3',
    resolvedByName: 'Mike Technician',
  },
  {
    id: '5',
    clientId: '2',
    clientName: 'Emily Davis',
    clientEmail: 'emily@creativeagency.com',
    subject: 'Need help with export functionality',
    description: 'I am trying to export my data but I am getting an error message. Can you please help?',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: '3',
    assignedToName: 'Mike Technician',
    category: 'Technical Issue',
    createdAt: '2024-01-22T11:30:00Z',
    updatedAt: '2024-01-22T13:15:00Z',
    createdBy: '2',
    createdByName: 'Emily Davis',
  },
];

// Mock ticket comments
const mockComments: TicketComment[] = [
  {
    id: '1',
    ticketId: '1',
    content: 'I have tried resetting my password but still cannot log in.',
    isInternal: false,
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: '1',
    createdByName: 'John Smith',
    createdByRole: 'client',
  },
  {
    id: '2',
    ticketId: '1',
    content: 'I will look into this issue right away. Can you please provide your username?',
    isInternal: false,
    createdAt: '2024-01-15T11:00:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    createdByRole: 'staff',
  },
  {
    id: '3',
    ticketId: '1',
    content: 'Note: This account was locked due to multiple failed login attempts.',
    isInternal: true,
    createdAt: '2024-01-15T11:05:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    createdByRole: 'staff',
  },
  {
    id: '4',
    ticketId: '2',
    content: 'I have reviewed the invoice and found the issue. We will issue a refund for the incorrect charges.',
    isInternal: false,
    createdAt: '2024-01-19T14:20:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    createdByRole: 'staff',
  },
  {
    id: '5',
    ticketId: '4',
    content: 'I have identified the issue. It appears to be a compatibility problem with the latest OS update. I am pushing a fix now.',
    isInternal: false,
    createdAt: '2024-01-12T15:30:00Z',
    createdBy: '3',
    createdByName: 'Mike Technician',
    createdByRole: 'technician',
  },
  {
    id: '6',
    ticketId: '4',
    content: 'The fix has been deployed. Please update your application and let me know if the issue persists.',
    isInternal: false,
    createdAt: '2024-01-12T16:45:00Z',
    createdBy: '3',
    createdByName: 'Mike Technician',
    createdByRole: 'technician',
  },
];

let tickets = [...mockTickets];
let comments = [...mockComments];
let categories = [...mockCategories];
let nextTicketId = 6;
let nextCommentId = 7;

export class TicketService {
  static async getTickets(filters?: TicketFilters): Promise<SupportTicket[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredTickets = [...tickets];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket =>
          ticket.subject.toLowerCase().includes(search) ||
          ticket.description.toLowerCase().includes(search) ||
          ticket.clientName.toLowerCase().includes(search) ||
          ticket.clientEmail.toLowerCase().includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
      }
      
      if (filters.priority && filters.priority !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
      }
      
      if (filters.assignedTo && filters.assignedTo !== 'all') {
        if (filters.assignedTo === 'unassigned') {
          filteredTickets = filteredTickets.filter(ticket => !ticket.assignedTo);
        } else {
          filteredTickets = filteredTickets.filter(ticket => ticket.assignedTo === filters.assignedTo);
        }
      }
      
      if (filters.category && filters.category !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => ticket.category === filters.category);
      }
      
      if (filters.clientId && filters.clientId !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => ticket.clientId === filters.clientId);
      }
      
      if (filters.dateRange.start) {
        filteredTickets = filteredTickets.filter(ticket => 
          new Date(ticket.createdAt) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredTickets = filteredTickets.filter(ticket => 
          new Date(ticket.createdAt) <= new Date(filters.dateRange.end!)
        );
      }
    }
    
    return filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getTicketById(id: string): Promise<SupportTicket | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return tickets.find(ticket => ticket.id === id) || null;
  }

  static async createTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'createdByName' | 'assignedToName'>): Promise<SupportTicket> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get client name if not provided
    let clientName = ticketData.clientName;
    let clientEmail = ticketData.clientEmail;
    
    const newTicket: SupportTicket = {
      ...ticketData,
      id: nextTicketId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientName,
      clientEmail,
      createdByName: 'Current User', // This would be set based on the authenticated user
    };
    
    // Set assignedToName if assignedTo is provided
    if (ticketData.assignedTo) {
      // In a real app, you would fetch the user's name from the database
      newTicket.assignedToName = ticketData.assignedTo === '2' ? 'Jane Staff' : 
                                ticketData.assignedTo === '3' ? 'Mike Technician' : 'Unknown';
    }
    
    tickets.push(newTicket);
    nextTicketId++;
    
    return newTicket;
  }

  static async updateTicket(id: string, ticketData: Partial<SupportTicket>): Promise<SupportTicket> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    
    // Set assignedToName if assignedTo is provided and changed
    if (ticketData.assignedTo && ticketData.assignedTo !== tickets[index].assignedTo) {
      // In a real app, you would fetch the user's name from the database
      ticketData.assignedToName = ticketData.assignedTo === '2' ? 'Jane Staff' : 
                                 ticketData.assignedTo === '3' ? 'Mike Technician' : 'Unknown';
    }
    
    // Set resolvedAt and resolvedBy if status is changed to resolved
    if (ticketData.status === 'resolved' && tickets[index].status !== 'resolved') {
      ticketData.resolvedAt = new Date().toISOString();
      ticketData.resolvedBy = '1'; // Current user ID
      ticketData.resolvedByName = 'Current User'; // Current user name
    }
    
    tickets[index] = {
      ...tickets[index],
      ...ticketData,
      updatedAt: new Date().toISOString(),
    };
    
    return tickets[index];
  }

  static async deleteTicket(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    
    tickets.splice(index, 1);
    
    // Delete associated comments
    comments = comments.filter(comment => comment.ticketId !== id);
  }

  static async getTicketComments(ticketId: string): Promise<TicketComment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return comments
      .filter(comment => comment.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  static async addTicketComment(ticketId: string, commentData: Omit<TicketComment, 'id' | 'ticketId' | 'createdAt'>): Promise<TicketComment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ticket = tickets.find(ticket => ticket.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const newComment: TicketComment = {
      ...commentData,
      id: nextCommentId.toString(),
      ticketId,
      createdAt: new Date().toISOString(),
    };
    
    comments.push(newComment);
    nextCommentId++;
    
    // Update ticket's updatedAt timestamp
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].updatedAt = new Date().toISOString();
    }
    
    return newComment;
  }

  static async getCategories(): Promise<TicketCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return categories;
  }

  static async getTicketStats(): Promise<{
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    highPriorityTickets: number;
    avgResponseTime: number; // in hours
    categoryBreakdown: { category: string; count: number }[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const highPriorityTickets = tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
    
    // Mock average response time calculation
    const avgResponseTime = 4.5; // hours
    
    // Category breakdown
    const categoryBreakdown = categories.map(category => {
      const count = tickets.filter(t => t.category === category.name).length;
      return { category: category.name, count };
    }).filter(item => item.count > 0);
    
    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      highPriorityTickets,
      avgResponseTime,
      categoryBreakdown,
    };
  }
}