export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  status: 'active' | 'inactive' | 'lead';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalValue: number;
  lastOrderDate?: string;
  files: ClientFile[];
  contacts: ContactPerson[];
}

export interface ContactPerson {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFile {
  id: string;
  clientId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ClientFormData {
  name: string;
  company?: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
  status: 'active' | 'inactive' | 'lead';
  tags: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
}

export interface ClientFilters {
  search: string;
  status: string;
  tags: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
}