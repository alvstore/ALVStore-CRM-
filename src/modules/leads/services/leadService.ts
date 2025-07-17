import { Lead, LeadFilters, LeadActivity } from '../types';

// Mock staff data for assignment
const mockStaff = [
  { id: '1', name: 'John Admin', role: 'admin' },
  { id: '2', name: 'Jane Staff', role: 'staff' },
  { id: '3', name: 'Mike Sales', role: 'staff' },
  { id: '4', name: 'Sarah Manager', role: 'staff' },
];

// Mock leads data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    company: 'StartupCorp',
    email: 'alice@startupcorp.com',
    phone: '+1234567890',
    source: 'website',
    status: 'new',
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'Jane Staff',
    estimatedValue: 15000,
    expectedCloseDate: '2024-02-15',
    notes: 'Interested in our premium package. Needs proposal by end of week.',
    tags: ['Premium', 'Urgent'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
    lastContactDate: '2024-01-22T14:30:00Z',
    nextFollowUpDate: '2024-01-25T09:00:00Z',
    address: {
      street: '123 Startup Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
  },
  {
    id: '2',
    name: 'Robert Chen',
    company: 'Tech Innovations',
    email: 'robert@techinnovations.com',
    phone: '+1234567891',
    source: 'referral',
    status: 'contacted',
    priority: 'medium',
    assignedTo: '3',
    assignedToName: 'Mike Sales',
    estimatedValue: 25000,
    expectedCloseDate: '2024-03-01',
    notes: 'Referred by existing client. Very interested in enterprise solution.',
    tags: ['Enterprise', 'Referral'],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-23T11:15:00Z',
    lastContactDate: '2024-01-23T11:15:00Z',
    nextFollowUpDate: '2024-01-26T14:00:00Z',
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    company: 'Design Studio',
    email: 'maria@designstudio.com',
    phone: '+1234567892',
    source: 'social',
    status: 'qualified',
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'Jane Staff',
    estimatedValue: 8000,
    expectedCloseDate: '2024-02-28',
    notes: 'Creative agency looking for design tools. Budget confirmed.',
    tags: ['Design', 'Creative'],
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-24T16:45:00Z',
    lastContactDate: '2024-01-24T16:45:00Z',
    nextFollowUpDate: '2024-01-27T10:00:00Z',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1234567893',
    source: 'email',
    status: 'proposal',
    priority: 'medium',
    assignedTo: '3',
    assignedToName: 'Mike Sales',
    estimatedValue: 12000,
    expectedCloseDate: '2024-02-20',
    notes: 'Individual consultant. Proposal sent, waiting for response.',
    tags: ['Consultant', 'Individual'],
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-24T09:30:00Z',
    lastContactDate: '2024-01-24T09:30:00Z',
    nextFollowUpDate: '2024-01-28T15:00:00Z',
  },
  {
    id: '5',
    name: 'Jennifer Lee',
    company: 'Manufacturing Plus',
    email: 'jennifer@manufacturingplus.com',
    phone: '+1234567894',
    source: 'phone',
    status: 'negotiation',
    priority: 'high',
    assignedTo: '4',
    assignedToName: 'Sarah Manager',
    estimatedValue: 35000,
    expectedCloseDate: '2024-02-10',
    notes: 'Large manufacturing company. In final negotiations on pricing.',
    tags: ['Manufacturing', 'Large Deal'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T13:20:00Z',
    lastContactDate: '2024-01-25T13:20:00Z',
    nextFollowUpDate: '2024-01-29T11:00:00Z',
  },
];

let leads = [...mockLeads];
let nextId = 6;

export class LeadService {
  static async getLeads(filters?: LeadFilters): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredLeads = [...leads];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(search) ||
          lead.company?.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
      }
      
      if (filters.priority && filters.priority !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.priority === filters.priority);
      }
      
      if (filters.assignedTo && filters.assignedTo !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.assignedTo === filters.assignedTo);
      }
      
      if (filters.source && filters.source !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
      }
      
      if (filters.tags.length > 0) {
        filteredLeads = filteredLeads.filter(lead =>
          filters.tags.some(tag => lead.tags.includes(tag))
        );
      }
    }
    
    return filteredLeads;
  }

  static async getLeadById(id: string): Promise<Lead | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return leads.find(lead => lead.id === id) || null;
  }

  static async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'assignedToName'>): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const assignedStaff = leadData.assignedTo ? mockStaff.find(s => s.id === leadData.assignedTo) : null;
    
    const newLead: Lead = {
      ...leadData,
      id: nextId.toString(),
      assignedToName: assignedStaff?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    leads.push(newLead);
    nextId++;
    
    return newLead;
  }

  static async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = leads.findIndex(lead => lead.id === id);
    if (index === -1) {
      throw new Error('Lead not found');
    }
    
    const assignedStaff = leadData.assignedTo ? mockStaff.find(s => s.id === leadData.assignedTo) : null;
    
    leads[index] = {
      ...leads[index],
      ...leadData,
      assignedToName: assignedStaff?.name || leads[index].assignedToName,
      updatedAt: new Date().toISOString(),
    };
    
    return leads[index];
  }

  static async deleteLead(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = leads.findIndex(lead => lead.id === id);
    if (index === -1) {
      throw new Error('Lead not found');
    }
    
    leads.splice(index, 1);
  }

  static async convertToClient(leadId: string): Promise<{ success: boolean; clientId: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lead = leads.find(l => l.id === leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    // In a real app, this would create a client record and remove the lead
    // For now, we'll just update the lead status to 'won'
    const index = leads.findIndex(l => l.id === leadId);
    leads[index] = {
      ...leads[index],
      status: 'won',
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      clientId: `client_${leadId}`, // Mock client ID
    };
  }

  static async getStaff(): Promise<Array<{ id: string; name: string; role: string }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStaff;
  }

  static async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock activities
    return [
      {
        id: '1',
        leadId,
        type: 'note',
        title: 'Initial contact made',
        description: 'Called the lead and discussed their requirements.',
        createdAt: '2024-01-22T10:00:00Z',
        createdBy: '2',
        createdByName: 'Jane Staff',
      },
      {
        id: '2',
        leadId,
        type: 'email',
        title: 'Proposal sent',
        description: 'Sent detailed proposal with pricing information.',
        createdAt: '2024-01-23T14:30:00Z',
        createdBy: '2',
        createdByName: 'Jane Staff',
      },
    ];
  }
}