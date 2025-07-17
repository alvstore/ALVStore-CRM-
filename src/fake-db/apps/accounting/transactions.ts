import type { TransactionType, TransactionStatus, TransactionFilterType } from '@/types/apps/accounting/transactionTypes'

const now = new Date()

// Helper function to generate random IDs
const generateId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

// Sample transaction data
export const db: TransactionType[] = [
  {
    id: 'txn_001',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 1),
    reference: 'INV-1001',
    description: 'Initial investment',
    amount: 100000,
    type: 'CREDIT',
    status: 'POSTED',
    accountId: '1012', // Main Bank Account
    relatedAccountId: '5010', // Common Stock
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 1),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 1)
  },
  {
    id: 'txn_002',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 2),
    reference: 'INV-1002',
    description: 'Office rent for June',
    amount: 2000,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '8020', // Rent Expense
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 2),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 2)
  },
  {
    id: 'txn_003',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 3),
    reference: 'INV-1003',
    description: 'Purchase of office supplies',
    amount: 500,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '8090', // Other Operating Expenses
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_002',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 3),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 3)
  },
  {
    id: 'txn_004',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 5),
    reference: 'INV-1004',
    description: 'Consulting services',
    amount: 1500,
    type: 'CREDIT',
    status: 'POSTED',
    accountId: '1012', // Main Bank Account
    relatedAccountId: '6020', // Service Revenue
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 5)
  },
  {
    id: 'txn_005',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 8),
    reference: 'INV-1005',
    description: 'Product sale',
    amount: 3500,
    type: 'CREDIT',
    status: 'POSTED',
    accountId: '1012', // Main Bank Account
    relatedAccountId: '6010', // Product Sales
    createdById: 'user_002',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 8),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 8)
  },
  {
    id: 'txn_006',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 10),
    reference: 'INV-1006',
    description: 'Monthly internet bill',
    amount: 100,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '8030', // Utilities
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 10),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 10)
  },
  {
    id: 'txn_007',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 12),
    reference: 'INV-1007',
    description: 'Office cleaning service',
    amount: 300,
    type: 'DEBIT',
    status: 'PENDING',
    accountId: '8090', // Other Operating Expenses
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_002',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 12),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 12)
  },
  {
    id: 'txn_008',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 15),
    reference: 'INV-1008',
    description: 'Software subscription',
    amount: 200,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '2021', // Software
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 15),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 15)
  },
  {
    id: 'txn_009',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 18),
    reference: 'INV-1009',
    description: 'Office supplies',
    amount: 150,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '8090', // Other Operating Expenses
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_002',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 18),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 18)
  },
  {
    id: 'txn_010',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 20),
    reference: 'INV-1010',
    description: 'Client payment received',
    amount: 5000,
    type: 'CREDIT',
    status: 'POSTED',
    accountId: '1012', // Main Bank Account
    relatedAccountId: '1021', // Trade Receivables
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 20),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 20)
  },
  {
    id: 'txn_011',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 22),
    reference: 'INV-1011',
    description: 'Monthly team lunch',
    amount: 250,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '8090', // Other Operating Expenses
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_002',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 22),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 22)
  },
  {
    id: 'txn_012',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 25),
    reference: 'INV-1012',
    description: 'Website hosting',
    amount: 50,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '8090', // Other Operating Expenses
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 25),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 25)
  },
  {
    id: 'txn_013',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 28),
    reference: 'INV-1013',
    description: 'Consulting services',
    amount: 2000,
    type: 'CREDIT',
    status: 'POSTED',
    accountId: '1012', // Main Bank Account
    relatedAccountId: '6020', // Service Revenue
    createdById: 'user_002',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 28),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 28)
  },
  {
    id: 'txn_014',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 29),
    reference: 'INV-1014',
    description: 'Office printer',
    amount: 800,
    type: 'DEBIT',
    status: 'POSTED',
    accountId: '2013', // Equipment
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_001',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 29),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 29)
  },
  {
    id: 'txn_015',
    transactionDate: new Date(now.getFullYear(), now.getMonth(), 30),
    reference: 'INV-1015',
    description: 'Monthly utilities',
    amount: 300,
    type: 'DEBIT',
    status: 'PENDING',
    accountId: '8030', // Utilities
    relatedAccountId: '1012', // Main Bank Account
    createdById: 'user_002',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 30),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 30)
  }
]

// Helper function to get transactions with filters
export const getTransactions = (filters: TransactionFilterType = {}): TransactionType[] => {
  return db.filter(transaction => {
    // Filter by status
    if (filters.status && filters.status !== 'ALL' && transaction.status !== filters.status) {
      return false
    }

    // Filter by type
    if (filters.type && transaction.type !== filters.type) {
      return false
    }

    // Filter by account
    if (filters.accountId && transaction.accountId !== filters.accountId) {
      return false
    }

    // Filter by date range
    if (filters.startDate && new Date(transaction.transactionDate) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(transaction.transactionDate) > new Date(filters.endDate)) {
      return false
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      return (
        transaction.reference.toLowerCase().includes(searchTerm) ||
        transaction.description.toLowerCase().includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm)
      )
    }

    return true
  })
}

// Get a single transaction by ID
export const getTransactionById = (id: string): TransactionType | undefined => {
  return db.find(transaction => transaction.id === id)
}

// Create a new transaction
export const createTransaction = (data: Omit<TransactionType, 'id' | 'createdAt' | 'updatedAt'>): TransactionType => {
  const newTransaction: TransactionType = {
    ...data,
    id: `txn_${generateId()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  db.push(newTransaction)
  return newTransaction
}

// Update an existing transaction
export const updateTransaction = (id: string, data: Partial<Omit<TransactionType, 'id' | 'createdAt'>>): TransactionType | null => {
  const index = db.findIndex(transaction => transaction.id === id)
  
  if (index === -1) return null
  
  const updatedTransaction = {
    ...db[index],
    ...data,
    updatedAt: new Date()
  }
  
  db[index] = updatedTransaction
  return updatedTransaction
}

// Delete a transaction
export const deleteTransaction = (id: string): boolean => {
  const index = db.findIndex(transaction => transaction.id === id)
  
  if (index === -1) return false
  
  db.splice(index, 1)
  return true
}

// Get transactions by account ID
export const getTransactionsByAccountId = (accountId: string): TransactionType[] => {
  return db.filter(
    transaction => transaction.accountId === accountId || transaction.relatedAccountId === accountId
  )
}

// Get account balance
// export const getAccountBalance = (accountId: string): number => {
//   const transactions = getTransactionsByAccountId(accountId)
//   
//   return transactions.reduce((balance, transaction) => {
//     // If this is the account being debited, subtract the amount
//     if (transaction.accountId === accountId && transaction.type === 'DEBIT') {
//       return balance - transaction.amount
//     }
//     // If this is the account being credited, add the amount
//     if (transaction.relatedAccountId === accountId && transaction.type === 'CREDIT') {
//       return balance + transaction.amount
//     }
//     return balance
//   }, 0)
// }
