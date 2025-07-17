'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/server/db'
import { eq, and, like, or, gte, lte, sql } from 'drizzle-orm'
import { accounts } from '@/server/db/schema/accounting'
import type { AccountFilters } from '@/types/apps/accountingTypes'

// Mock data for development
const mockAccounts = [
  {
    id: '1',
    code: '1000',
    name: 'Cash and Cash Equivalents',
    type: 'asset',
    category: 'Current Assets',
    description: 'Cash on hand and in bank accounts',
    balance: 15000.00,
    isActive: true,
    level: 0,
    parentId: null,
    parentCode: null,
    parentName: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    code: '1100',
    name: 'Accounts Receivable',
    type: 'asset',
    category: 'Current Assets',
    description: 'Amounts owed by customers',
    balance: 25000.00,
    isActive: true,
    level: 0,
    parentId: null,
    parentCode: null,
    parentName: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    code: '1101',
    name: 'Trade Receivables',
    type: 'asset',
    category: 'Accounts Receivable',
    description: 'Trade debtors',
    balance: 20000.00,
    isActive: true,
    level: 1,
    parentId: '2',
    parentCode: '1100',
    parentName: 'Accounts Receivable',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '4',
    code: '2000',
    name: 'Accounts Payable',
    type: 'liability',
    category: 'Current Liabilities',
    description: 'Amounts owed to suppliers',
    balance: 12000.00,
    isActive: true,
    level: 0,
    parentId: null,
    parentCode: null,
    parentName: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '5',
    code: '4000',
    name: 'Revenue',
    type: 'revenue',
    category: 'Operating Revenue',
    description: 'Income from sales',
    balance: 100000.00,
    isActive: true,
    level: 0,
    parentId: null,
    parentCode: null,
    parentName: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '6',
    code: '5000',
    name: 'Cost of Goods Sold',
    type: 'expense',
    category: 'Cost of Sales',
    description: 'Direct costs of goods sold',
    balance: 60000.00,
    isActive: true,
    level: 0,
    parentId: null,
    parentCode: null,
    parentName: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '7',
    code: '6000',
    name: 'Operating Expenses',
    type: 'expense',
    category: 'General & Administrative',
    description: 'General operating expenses',
    balance: 15000.00,
    isActive: true,
    level: 0,
    parentId: null,
    parentCode: null,
    parentName: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
]

/**
 * Fetches chart of accounts with optional filtering
 */
export async function getChartOfAccounts(filters: AccountFilters = {}) {
  try {
    // In a real app, you would query the database like this:
    /*
    let query = db.select().from(accounts)
    
    // Apply filters
    if (filters.search) {
      query = query.where(
        or(
          like(accounts.name, `%${filters.search}%`),
          like(accounts.code, `%${filters.search}%`),
          like(accounts.description, `%${filters.search}%`)
        )
      )
    }
    
    if (filters.type && filters.type !== 'all') {
      query = query.where(eq(accounts.type, filters.type as any))
    }
    
    if (filters.category && filters.category !== 'all') {
      query = query.where(eq(accounts.category, filters.category))
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.where(eq(accounts.isActive, filters.status === 'active'))
    }
    
    const result = await query.orderBy(accounts.code)
    return result
    */
    
    // For now, we'll use mock data
    let result = [...mockAccounts]
    
    // Apply filters to mock data
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        account =>
          account.name.toLowerCase().includes(search) ||
          account.code.toLowerCase().includes(search) ||
          (account.description && account.description.toLowerCase().includes(search))
      )
    }
    
    if (filters.type && filters.type !== 'all') {
      result = result.filter(account => account.type === filters.type)
    }
    
    if (filters.category && filters.category !== 'all') {
      result = result.filter(account => account.category === filters.category)
    }
    
    if (filters.status && filters.status !== 'all') {
      const isActive = filters.status === 'active'
      result = result.filter(account => account.isActive === isActive)
    }
    
    return result
  } catch (error) {
    console.error('Error fetching chart of accounts:', error)
    throw new Error('Failed to fetch chart of accounts')
  }
}

/**
 * Creates a new account
 */
export async function createAccount(data: any) {
  try {
    // In a real app, you would insert into the database like this:
    /*
    const [newAccount] = await db.insert(accounts).values({
      ...data,
      balance: 0, // New accounts start with 0 balance
      level: data.parentId ? 1 : 0, // Set level based on parent
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    
    revalidatePath('/apps/accounting/chart-of-accounts')
    return newAccount
    */
    
    // For now, just return the data with a new ID
    const newAccount = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      balance: 0,
      level: data.parentId ? 1 : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // In a real app, you would add this to the database
    mockAccounts.push(newAccount as any)
    
    return newAccount
  } catch (error) {
    console.error('Error creating account:', error)
    throw new Error('Failed to create account')
  }
}

/**
 * Updates an existing account
 */
export async function updateAccount(id: string, data: any) {
  try {
    // In a real app, you would update the database like this:
    /*
    const [updatedAccount] = await db
      .update(accounts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, id))
      .returning()
    
    revalidatePath('/apps/accounting/chart-of-accounts')
    return updatedAccount
    */
    
    // For now, update the mock data
    const index = mockAccounts.findIndex(account => account.id === id)
    if (index === -1) {
      throw new Error('Account not found')
    }
    
    const updatedAccount = {
      ...mockAccounts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    mockAccounts[index] = updatedAccount as any
    
    return updatedAccount
  } catch (error) {
    console.error('Error updating account:', error)
    throw new Error('Failed to update account')
  }
}

/**
 * Deletes an account
 */
export async function deleteAccount(id: string) {
  try {
    // In a real app, you would delete from the database like this:
    /*
    await db.delete(accounts).where(eq(accounts.id, id))
    revalidatePath('/apps/accounting/chart-of-accounts')
    */
    
    // For now, remove from mock data
    const index = mockAccounts.findIndex(account => account.id === id)
    if (index !== -1) {
      mockAccounts.splice(index, 1)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting account:', error)
    throw new Error('Failed to delete account')
  }
}
