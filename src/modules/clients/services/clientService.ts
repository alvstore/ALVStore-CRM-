import { Client, ContactPerson, ClientFile, ClientFilters } from '../types';

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc.',
    email: 'john@techsolutions.com',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    notes: 'VIP client, prefers email communication',
    status: 'active',
    tags: ['VIP', 'Tech'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    totalOrders: 15,
    totalValue: 45000,
    lastOrderDate: '2024-01-18T12:00:00Z',
    files: [],
    contacts: [
      {
        id: 'c1',
        clientId: '1',
        name: 'Sarah Johnson',
        email: 'sarah@techsolutions.com',
        phone: '+1234567891',
        position: 'CTO',
        department: 'Technology',
        isPrimary: true,
        notes: 'Technical decision maker',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Emily Davis',
    company: 'Creative Agency',
    email: 'emily@creativeagency.com',
    phone: '+1234567892',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    notes: 'Interested in design services',
    status: 'lead',
    tags: ['Design', 'Marketing'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
    totalOrders: 3,
    totalValue: 12000,
    lastOrderDate: '2024-01-12T16:00:00Z',
    files: [],
    contacts: [],
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Manufacturing Corp',
    email: 'michael@manufacturing.com',
    phone: '+1234567893',
    address: {
      street: '789 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    notes: 'Large volume orders, quarterly billing',
    status: 'active',
    tags: ['Manufacturing', 'Bulk'],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-21T11:45:00Z',
    totalOrders: 28,
    totalValue: 89000,
    lastOrderDate: '2024-01-20T10:30:00Z',
    files: [],
    contacts: [],
  },
];

let clients = [...mockClients];
let nextId = 4;

export class ClientService {
  static async getClients(filters?: ClientFilters): Promise<Client[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredClients = [...clients];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredClients = filteredClients.filter(client =>
          client.name.toLowerCase().includes(search) ||
          client.company?.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredClients = filteredClients.filter(client => client.status === filters.status);
      }
      
      if (filters.tags.length > 0) {
        filteredClients = filteredClients.filter(client =>
          filters.tags.some(tag => client.tags.includes(tag))
        );
      }
    }
    
    return filteredClients;
  }

  static async getClientById(id: string): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return clients.find(client => client.id === id) || null;
  }

  static async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalValue' | 'files' | 'contacts'>): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newClient: Client = {
      ...clientData,
      id: nextId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalOrders: 0,
      totalValue: 0,
      files: [],
      contacts: [],
    };
    
    clients.push(newClient);
    nextId++;
    
    return newClient;
  }

  static async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = clients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    
    clients[index] = {
      ...clients[index],
      ...clientData,
      updatedAt: new Date().toISOString(),
    };
    
    return clients[index];
  }

  static async deleteClient(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = clients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    
    clients.splice(index, 1);
  }

  static async addContact(clientId: string, contactData: Omit<ContactPerson, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<ContactPerson> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    const newContact: ContactPerson = {
      ...contactData,
      id: `contact_${Date.now()}`,
      clientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    client.contacts.push(newContact);
    return newContact;
  }

  static async updateContact(clientId: string, contactId: string, contactData: Partial<ContactPerson>): Promise<ContactPerson> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    const contactIndex = client.contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1) {
      throw new Error('Contact not found');
    }
    
    client.contacts[contactIndex] = {
      ...client.contacts[contactIndex],
      ...contactData,
      updatedAt: new Date().toISOString(),
    };
    
    return client.contacts[contactIndex];
  }

  static async deleteContact(clientId: string, contactId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    const contactIndex = client.contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1) {
      throw new Error('Contact not found');
    }
    
    client.contacts.splice(contactIndex, 1);
  }

  static async uploadFile(clientId: string, file: File): Promise<ClientFile> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Mock file upload - in real app, upload to Cloudinary or similar
    const newFile: ClientFile = {
      id: `file_${Date.now()}`,
      clientId,
      name: file.name,
      url: `https://example.com/files/${file.name}`,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'current-user-id',
    };
    
    client.files.push(newFile);
    return newFile;
  }

  static async deleteFile(clientId: string, fileId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    const fileIndex = client.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) {
      throw new Error('File not found');
    }
    
    client.files.splice(fileIndex, 1);
  }
}