import { Customer, CustomerActivity, ContactPerson, Address } from '@/types/apps/crmTypes';

const API_BASE_URL = '/api/customers';

// Sample Indian customer data for different business types
const SAMPLE_INDIAN_CUSTOMERS: Partial<Customer>[] = [
  // CRM Customers (B2B)
  {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@techsolutions.in',
    phone: '+919876543210',
    company: 'Tech Solutions India Pvt. Ltd.',
    type: 'business',
    status: 'active',
    source: 'crm',
    industry: 'Information Technology',
    addresses: [{
      id: 'addr-1',
      type: 'billing',
      street: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      addressType: 'billing',
      isDefault: true
    }],
    tags: ['enterprise', 'it-services'],
    customFields: {
      annualRevenue: '5-10 Cr',
      employeeCount: '50-200'
    },
    communicationPreferences: {
      email: true,
      sms: true,
      phone: false,
      preferred: 'email',
      marketingEmails: true,
      newsletter: true
    }
  },
  // POS Customers (Retail)
  {
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@email.com',
    phone: '+919876543211',
    type: 'individual',
    status: 'active',
    source: 'pos',
    addresses: [{
      id: 'addr-2',
      type: 'shipping',
      street: '456 Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400052',
      country: 'India',
      addressType: 'shipping',
      isDefault: true
    }],
    tags: ['retail', 'frequent-buyer'],
    customFields: {
      loyaltyPoints: '1250',
      lastPurchase: '2025-07-10'
    },
    communicationPreferences: {
      email: true,
      sms: true,
      phone: true,
      preferred: 'sms',
      marketingEmails: true,
      newsletter: true
    }
  },
  // E-commerce Customers
  {
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+919876543212',
    type: 'individual',
    status: 'active',
    source: 'ecommerce',
    addresses: [{
      id: 'addr-3',
      type: 'billing',
      street: '789 Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
      addressType: 'billing',
      isDefault: true
    }],
    tags: ['premium', 'online-shopper'],
    customFields: {
      totalOrders: '15',
      totalSpent: '45000',
      memberSince: '2023-01-15'
    },
    communicationPreferences: {
      email: true,
      sms: false,
      phone: false,
      preferred: 'email',
      marketingEmails: true,
      newsletter: true
    }
  },
  // Additional sample customers
  {
    firstName: 'Ananya',
    lastName: 'Gupta',
    email: 'ananya.g@fashionboutique.in',
    phone: '+919876543213',
    company: 'Urban Fashion Boutique',
    type: 'business',
    status: 'active',
    source: 'crm',
    industry: 'Retail',
    addresses: [{
      id: 'addr-4',
      type: 'billing',
      street: '321 Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560025',
      country: 'India',
      addressType: 'billing',
      isDefault: true
    }],
    tags: ['retail', 'fashion'],
    customFields: {
      storeType: 'Premium',
      customerSince: '2022-05-20'
    },
    communicationPreferences: {
      email: true,
      sms: true,
      phone: true,
      preferred: 'email',
      marketingEmails: true,
      newsletter: false
    }
  },
  {
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'v.singh@foodexpress.com',
    phone: '+919876543214',
    type: 'individual',
    status: 'active',
    source: 'pos',
    addresses: [{
      id: 'addr-5',
      type: 'shipping',
      street: '789 Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700016',
      country: 'India',
      addressType: 'shipping',
      isDefault: true
    }],
    tags: ['food', 'frequent-diner'],
    customFields: {
      favoriteCuisine: 'North Indian',
      lastVisit: '2025-07-05'
    },
    communicationPreferences: {
      email: true,
      sms: true,
      phone: true,
      preferred: 'phone',
      marketingEmails: false,
      newsletter: false
    }
  }
];

class CustomerService {
  /**
   * Get all customers with pagination and filtering
   * @param params Query parameters for filtering and pagination
   * @returns Paginated list of customers
   */
  async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    source?: 'crm' | 'pos' | 'ecommerce' | 'all';
  } = {}): Promise<{ data: Customer[]; pagination: { total: number; page: number; totalPages: number; limit: number } }> {
    try {
      // For demo purposes, return sample data when in development
      if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
        // Filter by source if specified
        let filteredData = [...SAMPLE_INDIAN_CUSTOMERS];
        
        if (params.source && params.source !== 'all') {
          filteredData = filteredData.filter(
            customer => (customer as any).source === params.source
          );
        }
        
        // Apply search filter
        if (params.search) {
          const search = params.search.toLowerCase();
          filteredData = filteredData.filter(customer => 
            `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase().includes(search) ||
            customer.email?.toLowerCase().includes(search) ||
            customer.phone?.includes(search) ||
            (customer as any).company?.toLowerCase().includes(search)
          );
        }
        
        // Apply status filter
        if (params.status) {
          filteredData = filteredData.filter(
            customer => customer.status === params.status
          );
        }
        
        // Apply sorting
        if (params.sortBy) {
          filteredData.sort((a, b) => {
            const aValue = a[params.sortBy as keyof Customer];
            const bValue = b[params.sortBy as keyof Customer];
            
            if (aValue === bValue) return 0;
            if (!aValue) return 1;
            if (!bValue) return -1;
            
            const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
            return aValue > bValue ? sortOrder : -sortOrder;
          });
        }
        
        // Apply pagination
        const page = params.page || 1;
        const limit = params.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        return {
          data: paginatedData as Customer[],
          pagination: {
            total: filteredData.length,
            page: page,
            totalPages: Math.ceil(filteredData.length / limit),
            limit: limit
          }
        };
      }
      
      // Real API call
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.source && params.source !== 'all') queryParams.append('source', params.source);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch customers');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get a single customer by ID
   * @param id Customer ID
   * @returns Customer details or null if not found
   */
  async getCustomerById(id: string | number): Promise<Customer | null> {
    try {
      // For demo purposes, return sample data when in development
      if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
        // Try to find customer by ID
        const customer = SAMPLE_INDIAN_CUSTOMERS.find(
          (_, index) => index.toString() === id.toString()
        );
        
        if (customer) {
          // Add some sample activities
          const activities: CustomerActivity[] = [
            {
              id: 'act-1',
              type: 'note',
              title: 'Account Created',
              description: 'New customer account was created',
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              userId: 'system',
              userName: 'System'
            },
            {
              id: 'act-2',
              type: 'other',
              title: 'First Purchase',
              description: 'Completed first purchase',
              date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
              userId: 'system',
              userName: 'System',
              metadata: { 
                type: 'purchase',
                amount: '2499', 
                currency: 'INR',
                items: 3 
              }
            },
            {
              id: 'act-3',
              type: 'email',
              title: 'Support Ticket',
              description: 'Created support ticket #1234',
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              userId: 'support-1',
              userName: 'Support Team',
              metadata: {
                type: 'support'
              }
            }
          ];
          
          return {
            ...customer,
            id: id.toString(),
            customerId: `CUST-${1000 + parseInt(id.toString())}`,
            activities,
            contacts: [
              {
                id: 'cont-1',
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                email: customer.email || '',
                phone: customer.phone || '',
                position: 'Primary Contact',
                isPrimary: true
              }
            ],
            addresses: [
              {
                id: 'addr-default',
                type: 'billing',
                street: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                postalCode: '400001',
                country: 'India',
                addressType: 'billing',
                isDefault: true
              }
            ],
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          } as Customer;
        }
        return null;
      }
      
      // Real API call
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch customer');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new customer
   * @param customerData Customer data
   * @returns Created customer
   */
  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>): Promise<Customer> {
    try {
      // For demo purposes, if no data is provided, use sample data
      const demoData = customerData || {} as any;
      
      // If this is a demo request, select a random sample customer
      if (customerData && (customerData as any).isDemo) {
        const randomCustomer = SAMPLE_INDIAN_CUSTOMERS[
          Math.floor(Math.random() * SAMPLE_INDIAN_CUSTOMERS.length)
        ];
        
        // Merge demo data with sample data
        Object.assign(demoData, randomCustomer);
      }
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...demoData,
          customerId: `CUST-${Date.now().toString().slice(-6)}`,
          status: demoData.status || 'lead',
          type: demoData.type || 'individual',
          communicationPreferences: {
            email: true,
            sms: Math.random() > 0.5, // Randomly enable SMS
            phone: Math.random() > 0.7, // Less likely to enable phone
            preferred: ['email', 'sms', 'phone'][Math.floor(Math.random() * 3)],
            marketingEmails: Math.random() > 0.3, // 70% chance to enable
            newsletter: Math.random() > 0.5, // 50% chance to enable
            ...demoData.communicationPreferences
          },
          tags: demoData.tags || [],
          customFields: demoData.customFields || {},
          taxExempt: demoData.taxExempt || false,
          order: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param customerData Updated customer data
   * @returns Updated customer
   */
  async updateCustomer(id: string | number, customerData: Partial<Customer>): Promise<Customer> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update customer');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a customer (mark as inactive)
   * @param id Customer ID
   * @returns True if deletion was successful
   */
  async deleteCustomer(id: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete customer');
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get customer activities
   * @param customerId Customer ID
   * @returns List of customer activities
   */
  async getCustomerActivities(customerId: string | number): Promise<CustomerActivity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/activities`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch customer activities');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error fetching activities for customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Add a contact person to a customer
   * @param customerId Customer ID
   * @param contact Contact person data
   * @returns Created contact person
   */
  async addContact(customerId: string | number, contact: Omit<ContactPerson, 'id'>): Promise<ContactPerson> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add contact');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }

  /**
   * Update a contact person
   * @param customerId Customer ID
   * @param contactId Contact person ID
   * @param contact Updated contact data
   * @returns Updated contact person
   */
  async updateContact(
    customerId: string | number, 
    contactId: string | number, 
    contact: Partial<ContactPerson>
  ): Promise<ContactPerson> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update contact');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error updating contact ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a contact person
   * @param customerId Customer ID
   * @param contactId Contact person ID
   * @returns True if deletion was successful
   */
  async deleteContact(customerId: string | number, contactId: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/contacts/${contactId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete contact');
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting contact ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Add an address to a customer
   * @param customerId Customer ID
   * @param address Address data
   * @returns Created address
   */
  async addAddress(customerId: string | number, address: Omit<Address, 'id' | 'isDefault'>): Promise<Address> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add address');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  /**
   * Update an address
   * @param customerId Customer ID
   * @param addressId Address ID
   * @param address Updated address data
   * @returns Updated address
   */
  async updateAddress(
    customerId: string | number,
    addressId: string | number,
    address: Partial<Address>
  ): Promise<Address> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update address');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error updating address ${addressId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an address
   * @param customerId Customer ID
   * @param addressId Address ID
   * @returns True if deletion was successful
   */
  async deleteAddress(customerId: string | number, addressId: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/addresses/${addressId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete address');
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting address ${addressId}:`, error);
      throw error;
    }
  }

  /**
   * Log an activity for a customer
   * @param customerId Customer ID
   * @param activity Activity data
   * @returns Created activity
   */
  async logActivity(customerId: string | number, activity: Omit<CustomerActivity, 'id'>): Promise<CustomerActivity> {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...activity,
          date: activity.date || new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to log activity');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error logging activity for customer ${customerId}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance
export const customerService = new CustomerService();

export default customerService;
