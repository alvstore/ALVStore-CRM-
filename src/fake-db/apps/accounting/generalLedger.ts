import type { GeneralLedgerEntryType, GeneralLedgerFilterType, AccountBalanceType } from '@/types/apps/accounting/generalLedgerTypes'
import { getJournalEntriesByDateRange } from './journal-entries'
import { db as accountsDb } from './accounts'

// Helper function to generate general ledger entries from journal entries
const generateGeneralLedgerEntries = (): GeneralLedgerEntryType[] => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  // Get all journal entries for the current month
  const journalEntries = getJournalEntriesByDateRange(startOfMonth, endOfMonth)
  
  // Flatten all line items from journal entries into general ledger entries
  const entries: GeneralLedgerEntryType[] = []
  
  journalEntries.forEach(journalEntry => {
    journalEntry.lineItems.forEach(lineItem => {
      entries.push({
        id: `gle_${entries.length + 1}`,
        entryDate: journalEntry.entryDate,
        journalEntryId: journalEntry.id,
        journalEntryReference: journalEntry.reference,
        accountId: lineItem.accountId,
        accountCode: accountsDb.find(a => a.id === lineItem.accountId)?.code || '',
        accountName: accountsDb.find(a => a.id === lineItem.accountId)?.name || '',
        description: lineItem.description || journalEntry.description,
        debit: lineItem.debit,
        credit: lineItem.credit,
        balance: 0, // Will be calculated later
        currency: lineItem.currency,
        exchangeRate: lineItem.exchangeRate,
        fiscalYearId: journalEntry.fiscalYearId,
        periodId: journalEntry.periodId,
        createdById: journalEntry.createdById,
        createdAt: journalEntry.createdAt,
        updatedAt: journalEntry.updatedAt
      })
    })
  })
  
  // Sort entries by date and then by account code
  entries.sort((a, b) => {
    const dateDiff = new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()
    if (dateDiff !== 0) return dateDiff
    return a.accountCode.localeCompare(b.accountCode)
  })
  
  // Calculate running balances
  const accountBalances: Record<string, number> = {}
  
  return entries.map(entry => {
    const accountId = entry.accountId
    const currentBalance = accountBalances[accountId] || 0
    const newBalance = currentBalance + entry.debit - entry.credit
    accountBalances[accountId] = newBalance
    
    return {
      ...entry,
      balance: newBalance
    }
  })
}

// Generate the general ledger entries
export const db = generateGeneralLedgerEntries()

// Get general ledger entries with filters
export const getGeneralLedgerEntries = (filters: GeneralLedgerFilterType = {}): GeneralLedgerEntryType[] => {
  return db.filter(entry => {
    // Filter by account
    if (filters.accountId && entry.accountId !== filters.accountId) {
      return false
    }
    
    // Filter by date range
    if (filters.startDate && new Date(entry.entryDate) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(entry.entryDate) > new Date(filters.endDate)) {
      return false
    }
    
    // Filter by fiscal year
    if (filters.fiscalYearId && entry.fiscalYearId !== filters.fiscalYearId) {
      return false
    }
    
    // Filter by period
    if (filters.periodId && entry.periodId !== filters.periodId) {
      return false
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      if (!entry.journalEntryReference.toLowerCase().includes(searchTerm) &&
          !entry.description?.toLowerCase().includes(searchTerm) &&
          !entry.accountName.toLowerCase().includes(searchTerm) &&
          !entry.accountCode.toLowerCase().includes(searchTerm)) {
        return false
      }
    }
    
    return true
  })
}

// Get account balances
// export const getAccountBalances = (filters: Omit<GeneralLedgerFilterType, 'accountId'> = {}): AccountBalanceType[] => {
//   const entries = getGeneralLedgerEntries(filters)
//   const balances: Record<string, AccountBalanceType> = {}
  
//   entries.forEach(entry => {
//     if (!balances[entry.accountId]) {
//       balances[entry.accountId] = {
//         accountId: entry.accountId,
//         accountCode: entry.accountCode,
//         accountName: entry.accountName,
//         openingBalance: 0, // Would need to calculate from previous periods
//         debit: 0,
//         credit: 0,
//         balance: 0,
//         currency: entry.currency
//       }
//     }
    
//     const balance = balances[entry.accountId]
//     balance.debit += entry.debit
//     balance.credit += entry.credit
//     balance.balance = balance.debit - balance.credit
//   })
  
//   return Object.values(balances)
// }

// Get general ledger entry by ID
export const getGeneralLedgerEntryById = (id: string): GeneralLedgerEntryType | undefined => {
  return db.find(entry => entry.id === id)
}

// Get general ledger entries by account ID
export const getGeneralLedgerEntriesByAccountId = (accountId: string): GeneralLedgerEntryType[] => {
  return db.filter(entry => entry.accountId === accountId)
}

// Get general ledger entries by journal entry ID
export const getGeneralLedgerEntriesByJournalEntryId = (journalEntryId: string): GeneralLedgerEntryType[] => {
  return db.filter(entry => entry.journalEntryId === journalEntryId)
}

// Get general ledger entries by date range
export const getGeneralLedgerEntriesByDateRange = (startDate: Date | string, endDate: Date | string): GeneralLedgerEntryType[] => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return db.filter(entry => {
    const entryDate = new Date(entry.entryDate)
    return entryDate >= start && entryDate <= end
  })
}

// Get general ledger entries by fiscal year
export const getGeneralLedgerEntriesByFiscalYear = (fiscalYearId: string): GeneralLedgerEntryType[] => {
  return db.filter(entry => entry.fiscalYearId === fiscalYearId)
}

// Get general ledger entries by period
export const getGeneralLedgerEntriesByPeriod = (periodId: string): GeneralLedgerEntryType[] => {
  return db.filter(entry => entry.periodId === periodId)
}

// Get general ledger summary
export const getGeneralLedgerSummary = (filters: Omit<GeneralLedgerFilterType, 'accountId'> = {}): {
  totalDebit: number
  totalCredit: number
  balance: number
  accountCount: number
  entryCount: number
} => {
  const entries = getGeneralLedgerEntries(filters)
  
  const accountIds = new Set<string>()
  let totalDebit = 0
  let totalCredit = 0
  
  entries.forEach(entry => {
    accountIds.add(entry.accountId)
    totalDebit += entry.debit
    totalCredit += entry.credit
  })
  
  return {
    totalDebit,
    totalCredit,
    balance: totalDebit - totalCredit,
    accountCount: accountIds.size,
    entryCount: entries.length
  }
}
