import type { JournalEntryType, JournalEntryStatus, JournalEntryFilterType } from '@/types/apps/accounting/journalEntryTypes'

const now = new Date()

// Helper function to generate random IDs
const generateId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

// Sample journal entry data
export const db: JournalEntryType[] = [
  {
    id: 'je_001',
    entryDate: new Date(now.getFullYear(), now.getMonth(), 1),
    reference: 'JE-2023-001',
    description: 'Initial investment',
    status: 'POSTED',
    totalDebit: 100000,
    totalCredit: 100000,
    currency: 'USD',
    fiscalYearId: 'fy_2023',
    periodId: '2023-06',
    createdById: 'user_001',
    approvedById: 'user_001',
    approvedAt: new Date(now.getFullYear(), now.getMonth(), 1),
    createdAt: new Date(now.getFullYear(), now.getMonth(), 1),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 1),
    lineItems: [
      {
        id: 'jeli_001',
        accountId: '1012', // Main Bank Account
        description: 'Initial investment deposit',
        debit: 100000,
        credit: 0,
        currency: 'USD',
        exchangeRate: 1,
        taxId: null,
        taxAmount: 0,
        projectId: null,
        departmentId: null,
        createdById: 'user_001',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 1),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 1)
      },
      {
        id: 'jeli_002',
        accountId: '5010', // Common Stock
        description: 'Common stock issuance',
        debit: 0,
        credit: 100000,
        currency: 'USD',
        exchangeRate: 1,
        taxId: null,
        taxAmount: 0,
        projectId: null,
        departmentId: null,
        createdById: 'user_001',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 1),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 1)
      }
    ]
  },
  {
    id: 'je_002',
    entryDate: new Date(now.getFullYear(), now.getMonth(), 5),
    reference: 'JE-2023-002',
    description: 'Office rent for June',
    status: 'POSTED',
    totalDebit: 2000,
    totalCredit: 2000,
    currency: 'USD',
    fiscalYearId: 'fy_2023',
    periodId: '2023-06',
    createdById: 'user_001',
    approvedById: 'user_001',
    approvedAt: new Date(now.getFullYear(), now.getMonth(), 5),
    createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 5),
    lineItems: [
      {
        id: 'jeli_003',
        accountId: '8020', // Rent Expense
        description: 'Office rent for June',
        debit: 2000,
        credit: 0,
        currency: 'USD',
        exchangeRate: 1,
        taxId: 'tax_001',
        taxAmount: 0,
        projectId: 'proj_001',
        departmentId: 'dept_001',
        createdById: 'user_001',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 5)
      },
      {
        id: 'jeli_004',
        accountId: '1012', // Main Bank Account
        description: 'Payment for office rent',
        debit: 0,
        credit: 2000,
        currency: 'USD',
        exchangeRate: 1,
        taxId: null,
        taxAmount: 0,
        projectId: null,
        departmentId: null,
        createdById: 'user_001',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 5)
      }
    ]
  },
  {
    id: 'je_003',
    entryDate: new Date(now.getFullYear(), now.getMonth(), 10),
    reference: 'JE-2023-003',
    description: 'Consulting services revenue',
    status: 'POSTED',
    totalDebit: 1500,
    totalCredit: 1500,
    currency: 'USD',
    fiscalYearId: 'fy_2023',
    periodId: '2023-06',
    createdById: 'user_002',
    approvedById: 'user_001',
    approvedAt: new Date(now.getFullYear(), now.getMonth(), 10),
    createdAt: new Date(now.getFullYear(), now.getMonth(), 10),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 10),
    lineItems: [
      {
        id: 'jeli_005',
        accountId: '1012', // Main Bank Account
        description: 'Payment received for consulting services',
        debit: 1500,
        credit: 0,
        currency: 'USD',
        exchangeRate: 1,
        taxId: 'tax_002',
        taxAmount: 0,
        projectId: 'proj_002',
        departmentId: 'dept_002',
        createdById: 'user_002',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 10),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 10)
      },
      {
        id: 'jeli_006',
        accountId: '6020', // Service Revenue
        description: 'Consulting services provided',
        debit: 0,
        credit: 1500,
        currency: 'USD',
        exchangeRate: 1,
        taxId: null,
        taxAmount: 0,
        projectId: null,
        departmentId: null,
        createdById: 'user_002',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 10),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 10)
      }
    ]
  },
  {
    id: 'je_004',
    entryDate: new Date(now.getFullYear(), now.getMonth(), 15),
    reference: 'JE-2023-004',
    description: 'Purchase of office equipment',
    status: 'POSTED',
    totalDebit: 2500,
    totalCredit: 2500,
    currency: 'USD',
    fiscalYearId: 'fy_2023',
    periodId: '2023-06',
    createdById: 'user_001',
    approvedById: 'user_001',
    approvedAt: new Date(now.getFullYear(), now.getMonth(), 15),
    createdAt: new Date(now.getFullYear(), now.getMonth(), 15),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 15),
    lineItems: [
      {
        id: 'jeli_007',
        accountId: '2013', // Office Equipment
        description: 'Purchase of office equipment',
        debit: 2500,
        credit: 0,
        currency: 'USD',
        exchangeRate: 1,
        taxId: 'tax_003',
        taxAmount: 0,
        projectId: 'proj_001',
        departmentId: 'dept_001',
        createdById: 'user_001',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 15),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 15)
      },
      {
        id: 'jeli_008',
        accountId: '1012', // Main Bank Account
        description: 'Payment for office equipment',
        debit: 0,
        credit: 2500,
        currency: 'USD',
        exchangeRate: 1,
        taxId: null,
        taxAmount: 0,
        projectId: null,
        departmentId: null,
        createdById: 'user_001',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 15),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 15)
      }
    ]
  },
  {
    id: 'je_005',
    entryDate: new Date(now.getFullYear(), now.getMonth(), 20),
    reference: 'JE-2023-005',
    description: 'Depreciation expense for June',
    status: 'POSTED',
    totalDebit: 500,
    totalCredit: 500,
    currency: 'USD',
    fiscalYearId: 'fy_2023',
    periodId: '2023-06',
    createdById: 'user_002',
    approvedById: 'user_001',
    approvedAt: new Date(now.getFullYear(), now.getMonth(), 20),
    createdAt: new Date(now.getFullYear(), now.getMonth(), 20),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 20),
    lineItems: [
      {
        id: 'jeli_009',
        accountId: '8050', // Depreciation Expense
        description: 'Monthly depreciation',
        debit: 500,
        credit: 0,
        currency: 'USD',
        exchangeRate: 1,
        taxId: null,
        taxAmount: 0,
        projectId: null,
        departmentId: 'dept_001',
        createdById: 'user_002',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 20),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 20)
      },
      {
        id: 'jeli_010',
        accountId: '1060', // Accumulated Depreciation
        description: 'Accumulated depreciation',
        debit: 0,
        credit: 500,
        currency: 'USD',
        exchangeRate: 1,
        taxId: null,
        taxAmount: 0,
        projectId: null,
        departmentId: null,
        createdById: 'user_002',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 20),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 20)
      }
    ]
  }
]

// Helper function to get journal entries with filters
export const getJournalEntries = (filters: JournalEntryFilterType = {}): JournalEntryType[] => {
  return db.filter(entry => {
    // Filter by status
    if (filters.status && filters.status !== 'ALL' && entry.status !== filters.status) {
      return false
    }

    // Filter by reference or description
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      if (!entry.reference.toLowerCase().includes(searchTerm) && 
          !entry.description.toLowerCase().includes(searchTerm)) {
        return false
      }
    }

    // Filter by date range
    if (filters.startDate && new Date(entry.entryDate) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(entry.entryDate) > new Date(filters.endDate)) {
      return false
    }

    // Filter by amount range
    if (filters.minAmount && entry.totalDebit < filters.minAmount) {
      return false
    }
    if (filters.maxAmount && entry.totalDebit > filters.maxAmount) {
      return false
    }

    // Filter by fiscal year or period if provided
    if (filters.fiscalYearId && entry.fiscalYearId !== filters.fiscalYearId) {
      return false
    }
    if (filters.periodId && entry.periodId !== filters.periodId) {
      return false
    }

    return true
  })
}

// Get a single journal entry by ID
export const getJournalEntryById = (id: string): JournalEntryType | undefined => {
  return db.find(entry => entry.id === id)
}

// Create a new journal entry
export const createJournalEntry = (data: Omit<JournalEntryType, 'id' | 'createdAt' | 'updatedAt' | 'lineItems'> & { lineItems: Array<Omit<JournalEntryLineItemType, 'id' | 'createdAt' | 'updatedAt'>> }): JournalEntryType => {
  const newEntry: JournalEntryType = {
    ...data,
    id: `je_${generateId()}`,
    lineItems: data.lineItems.map(item => ({
      ...item,
      id: `jeli_${generateId()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  db.push(newEntry)
  return newEntry
}

// Update an existing journal entry
export const updateJournalEntry = (
  id: string, 
  data: Partial<Omit<JournalEntryType, 'id' | 'createdAt' | 'updatedAt' | 'lineItems'>> & { 
    lineItems?: Array<Partial<Omit<JournalEntryLineItemType, 'id' | 'createdAt' | 'updatedAt'>>> 
  }
): JournalEntryType | null => {
  const index = db.findIndex(entry => entry.id === id)
  
  if (index === -1) return null
  
  const updatedEntry = {
    ...db[index],
    ...data,
    updatedAt: new Date()
  }
  
  // Update line items if provided
  if (data.lineItems) {
    updatedEntry.lineItems = data.lineItems.map(item => {
      const existingItem = db[index].lineItems.find(li => li.id === item.id)
      if (existingItem) {
        return {
          ...existingItem,
          ...item,
          updatedAt: new Date()
        }
      }
      return {
        ...item,
        id: `jeli_${generateId()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }
  
  db[index] = updatedEntry
  return updatedEntry
}

// Delete a journal entry
export const deleteJournalEntry = (id: string): boolean => {
  const index = db.findIndex(entry => entry.id === id)
  
  if (index === -1) return false
  
  db.splice(index, 1)
  return true
}

// Get journal entries by account ID
export const getJournalEntriesByAccountId = (accountId: string): JournalEntryType[] => {
  return db.filter(entry => 
    entry.lineItems.some(item => item.accountId === accountId)
  )
}

// Get journal entries by status
export const getJournalEntriesByStatus = (status: JournalEntryStatus): JournalEntryType[] => {
  return db.filter(entry => entry.status === status)
}

// Get journal entries by date range
export const getJournalEntriesByDateRange = (startDate: Date | string, endDate: Date | string): JournalEntryType[] => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return db.filter(entry => {
    const entryDate = new Date(entry.entryDate)
    return entryDate >= start && entryDate <= end
  })
}
