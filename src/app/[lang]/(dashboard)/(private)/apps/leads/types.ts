export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'email' | 'phone' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  assignedToName?: string;
  estimatedValue?: number;
  expectedCloseDate?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface LeadFormData {
  name: string;
  company?: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'email' | 'phone' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  estimatedValue?: number;
  expectedCloseDate?: string;
  notes?: string;
  tags: string[];
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  nextFollowUpDate?: string;
}

export interface LeadFilters {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  source: string;
  tags: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Lead['status'];
  leads: Lead[];
  color: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change';
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}