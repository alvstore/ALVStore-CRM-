export interface SupportTicket {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  assignedToName?: string;
  category: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
}

export interface SupportTicketFormData {
  clientId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  category: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
  createdByRole: string;
}

export interface TicketCommentFormData {
  content: string;
  isInternal: boolean;
  attachments?: File[];
}

export interface TicketFilters {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  category: string;
  clientId: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface TicketCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}