import { ThemeColor } from '@core/types'

// Base customer type that extends the existing ecommerce customer
export interface Customer extends BaseCustomer {
  // Basic Info
  firstName?: string
  lastName?: string
  fullName?: string
  type: 'individual' | 'business'
  taxId?: string
  website?: string
  industry?: string
  source?: 'crm' | 'pos' | 'ecommerce' | 'other'
  notes?: string
  
  // Contact Information
  phone?: string
  company?: string
  contacts: ContactPerson[]
  addresses: Address[]
  communicationPreferences: CommunicationPreferences
  
  // Financial Information
  creditLimit?: number
  paymentTerms?: number // days
  taxExempt: boolean
  taxCertificate?: string
  
  // Relationships
  assignedTo?: string // User ID
  tags: string[]
  customFields: Record<string, any>
  
  // Activities
  activities?: CustomerActivity[]
  
  // Metadata
  createdAt: Date | string
  updatedAt: Date | string
  createdBy: string
  lastActivity?: Date | string
  status: 'active' | 'inactive' | 'lead' | 'customer' | 'churned'
}

// Base customer type that matches the existing ecommerce customer
export interface BaseCustomer {
  id: number | string
  customer: string
  customerId: string
  email: string
  country: string
  countryCode: string
  countryFlag?: string
  order: number
  totalSpent: number
  avatar: string
  contact?: string
}

export interface ContactPerson {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position?: string
  isPrimary: boolean
  notes?: string
  department?: string
  avatar?: string
  status?: 'active' | 'inactive'
  createdAt?: Date | string
  updatedAt?: Date | string
  
  // For backward compatibility
  name?: string
}

export interface Address {
  id: string
  type: 'billing' | 'shipping' | 'both'
  street: string
  street2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  addressType?: 'home' | 'work' | 'billing' | 'shipping' // For backward compatibility
  notes?: string
  latitude?: number
  longitude?: number
}

export interface CommunicationPreferences {
  email: boolean
  sms: boolean
  phone: boolean
  preferred: 'email' | 'sms' | 'phone'
  doNotDisturb?: boolean
  doNotDisturbUntil?: Date | string
  marketingEmails: boolean
  newsletter: boolean
}

// Activity types
export interface CustomerActivity {
  id: string
  type: 'note' | 'email' | 'call' | 'meeting' | 'other'
  title: string
  description?: string
  date: Date | string
  userId: string
  userName: string
  userAvatar?: string
  metadata?: Record<string, any>
}

// Permission types
export type Resource = 'customer' | 'contact' | 'invoice' | 'quote' | 'order'
export type Action = 'create' | 'read' | 'update' | 'delete' | 'export' | 'import'

export interface PermissionCondition {
  field: string
  operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'startsWith' | 'endsWith' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte'
  value: any
}

export interface Permission {
  resource: Resource
  actions: Action[]
  conditions?: PermissionCondition[]
  fields?: string[] // For field-level permissions
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
  isSystemRole: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}

// Status with color mapping
export const customerStatusColor: Record<string, ThemeColor> = {
  active: 'success',
  inactive: 'secondary',
  lead: 'info',
  customer: 'primary',
  churned: 'error'
}

// Default communication preferences
export const defaultCommunicationPreferences: CommunicationPreferences = {
  email: true,
  sms: false,
  phone: false,
  preferred: 'email',
  doNotDisturb: false,
  marketingEmails: true,
  newsletter: true
}

// Default customer object
export const defaultCustomer: Partial<Customer> = {
  type: 'individual',
  contacts: [],
  addresses: [],
  communicationPreferences: { ...defaultCommunicationPreferences },
  taxExempt: false,
  tags: [],
  customFields: {},
  status: 'lead',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
