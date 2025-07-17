import { Customer as BaseCustomer } from '@/types/apps/ecommerceTypes'
import { Customer, defaultCommunicationPreferences } from '@/types/apps/crmTypes'

/**
 * Migration to enhance the customer schema with additional fields and relationships
 * This migration will transform the existing customer data to the new format
 */

export function migrateCustomers(existingCustomers: BaseCustomer[], currentUserId: string): Customer[] {
  return existingCustomers.map(customer => ({
    // Preserve existing fields
    ...customer,
    
    // Add new fields with default values
    type: 'individual',
    contacts: [
      {
        id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: customer.customer,
        email: customer.email,
        phone: customer.contact || '',
        isPrimary: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    addresses: [
      {
        id: `addr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'both',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: customer.country,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    communicationPreferences: { ...defaultCommunicationPreferences },
    taxExempt: false,
    tags: [],
    customFields: {},
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: currentUserId,
    lastActivity: new Date().toISOString()
  }))
}

/**
 * This function should be called during application startup to migrate existing data
 */
export function runCustomerMigration(existingData: any, currentUserId: string) {
  if (!existingData.customerData) {
    console.warn('No customer data found to migrate')
    return existingData
  }

  console.log('Starting customer data migration...')
  const migratedCustomers = migrateCustomers(existingData.customerData, currentUserId)
  
  return {
    ...existingData,
    customerData: migratedCustomers
  }
}

// Type guard to check if object is a BaseCustomer
function isBaseCustomer(customer: any): customer is BaseCustomer {
  return (
    customer &&
    typeof customer === 'object' &&
    'id' in customer &&
    'customer' in customer &&
    'email' in customer
  )
}

// Helper function to apply the migration
export function applyCustomerMigration(data: any, currentUserId: string = 'system') {
  try {
    if (Array.isArray(data)) {
      return data.map(item => isBaseCustomer(item) 
        ? migrateCustomers([item], currentUserId)[0] 
        : item)
    } else if (data && typeof data === 'object') {
      // Handle the case where data is the entire ecommerce data object
      if (Array.isArray(data.customerData)) {
        return runCustomerMigration(data, currentUserId)
      }
      
      // Handle nested customer data
      const result: Record<string, any> = {}
      for (const key in data) {
        result[key] = applyCustomerMigration(data[key], currentUserId)
      }
      return result
    }
    return data
  } catch (error) {
    console.error('Error during customer migration:', error)
    return data
  }
}
