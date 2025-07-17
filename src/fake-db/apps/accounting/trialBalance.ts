import type { GeneralLedgerTrialBalanceType, AccountBalanceType } from '@/types/apps/accounting/generalLedgerTypes'
import { db as accountsDb } from './accounts'
import { getGeneralLedgerEntriesByDateRange } from './generalLedger'

// Helper function to generate trial balance
export const generateTrialBalance = (startDate: Date | string, endDate: Date | string): GeneralLedgerTrialBalanceType => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Get all ledger entries for the period
  const ledgerEntries = getGeneralLedgerEntriesByDateRange(start, end)
  
  // Initialize account balances
  const accountBalances: Record<string, {
    accountId: string
    accountCode: string
    accountName: string
    accountType: string
    openingDebit: number
    openingCredit: number
    periodDebit: number
    periodCredit: number
    endingDebit: number
    endingCredit: number
  }> = {}
  
  // Process each ledger entry
  ledgerEntries.forEach(entry => {
    if (!accountBalances[entry.accountId]) {
      const account = accountsDb.find(acc => acc.id === entry.accountId) || {
        code: entry.accountCode,
        name: entry.accountName,
        type: 'ASSET' // Default type if account not found
      }
      
      accountBalances[entry.accountId] = {
        accountId: entry.accountId,
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        openingDebit: 0, // Would need to calculate from previous periods
        openingCredit: 0, // Would need to calculate from previous periods
        periodDebit: 0,
        periodCredit: 0,
        endingDebit: 0,
        endingCredit: 0
      }
    }
    
    const balance = accountBalances[entry.accountId]
    
    // Add to period totals
    balance.periodDebit += entry.debit
    balance.periodCredit += entry.credit
    
    // Calculate ending balances based on account type
    switch (balance.accountType) {
      case 'ASSET':
      case 'EXPENSE':
        balance.endingDebit = balance.openingDebit + balance.periodDebit - balance.periodCredit
        balance.endingCredit = 0
        break
      case 'LIABILITY':
      case 'EQUITY':
      case 'REVENUE':
        balance.endingCredit = balance.openingCredit + balance.periodCredit - balance.periodDebit
        balance.endingDebit = 0
        break
    }
  })
  
  // Convert to array and calculate totals
  const accounts = Object.values(accountBalances)
  
  const totals = accounts.reduce((acc, account) => ({
    openingDebit: acc.openingDebit + account.openingDebit,
    openingCredit: acc.openingCredit + account.openingCredit,
    periodDebit: acc.periodDebit + account.periodDebit,
    periodCredit: acc.periodCredit + account.periodCredit,
    endingDebit: acc.endingDebit + account.endingDebit,
    endingCredit: acc.endingCredit + account.endingCredit
  }), {
    openingDebit: 0,
    openingCredit: 0,
    periodDebit: 0,
    periodCredit: 0,
    endingDebit: 0,
    endingCredit: 0
  })
  
  return {
    accounts,
    totals,
    startDate: start,
    endDate: end,
    generatedAt: new Date()
  }
}

// Get trial balance for a specific period
export const getTrialBalance = (startDate: Date | string, endDate: Date | string): GeneralLedgerTrialBalanceType => {
  return generateTrialBalance(startDate, endDate)
}

// Get account balances for trial balance
export const getTrialBalanceAccountBalances = (startDate: Date | string, endDate: Date | string): AccountBalanceType[] => {
  const trialBalance = generateTrialBalance(startDate, endDate)
  
  return trialBalance.accounts.map(account => ({
    accountId: account.accountId,
    accountCode: account.accountCode,
    accountName: account.accountName,
    accountType: account.accountType,
    openingBalance: account.openingDebit - account.openingCredit,
    debit: account.periodDebit,
    credit: account.periodCredit,
    balance: account.endingDebit - account.endingCredit,
    currency: 'USD' // Default currency
  }))
}

// Get trial balance summary
export const getTrialBalanceSummary = (startDate: Date | string, endDate: Date | string) => {
  const trialBalance = generateTrialBalance(startDate, endDate)
  
  return {
    startDate: trialBalance.startDate,
    endDate: trialBalance.endDate,
    totalDebit: trialBalance.totals.periodDebit,
    totalCredit: trialBalance.totals.periodCredit,
    difference: Math.abs(trialBalance.totals.periodDebit - trialBalance.totals.periodCredit),
    isBalanced: Math.abs(trialBalance.totals.periodDebit - trialBalance.totals.periodCredit) < 0.01,
    accountCount: trialBalance.accounts.length,
    generatedAt: trialBalance.generatedAt
  }
}

// Export trial balance to different formats
export const exportTrialBalance = (
  startDate: Date | string,
  endDate: Date | string,
  format: 'csv' | 'excel' | 'pdf' = 'csv'
): string => {
  const trialBalance = generateTrialBalance(startDate, endDate)
  
  // In a real implementation, this would generate the appropriate file format
  // For now, we'll just return a string representation
  return `Trial Balance Report\n` +
    `Period: ${new Date(trialBalance.startDate).toLocaleDateString()} - ${new Date(trialBalance.endDate).toLocaleDateString()}\n` +
    `Generated: ${new Date(trialBalance.generatedAt).toLocaleString()}\n\n` +
    `Account Code | Account Name | Type | Opening Debit | Opening Credit | Period Debit | Period Credit | Ending Debit | Ending Credit\n` +
    `------------|--------------|------|---------------|----------------|--------------|---------------|--------------|-------------\n` +
    trialBalance.accounts.map(acc => 
      `${acc.accountCode} | ${acc.accountName} | ${acc.accountType} | ` +
      `${acc.openingDebit.toFixed(2)} | ${acc.openingCredit.toFixed(2)} | ` +
      `${acc.periodDebit.toFixed(2)} | ${acc.periodCredit.toFixed(2)} | ` +
      `${acc.endingDebit.toFixed(2)} | ${acc.endingCredit.toFixed(2)}`
    ).join('\n') + '\n\n' +
    `Totals: | | | ${trialBalance.totals.openingDebit.toFixed(2)} | ${trialBalance.totals.openingCredit.toFixed(2)} | ` +
    `${trialBalance.totals.periodDebit.toFixed(2)} | ${trialBalance.totals.periodCredit.toFixed(2)} | ` +
    `${trialBalance.totals.endingDebit.toFixed(2)} | ${trialBalance.totals.endingCredit.toFixed(2)}`
}

// Get trial balance by account type
export const getTrialBalanceByAccountType = (startDate: Date | string, endDate: Date | string) => {
  const trialBalance = generateTrialBalance(startDate, endDate)
  
  // Group by account type
  const byType: Record<string, {
    accountType: string
    accounts: typeof trialBalance.accounts
    totals: typeof trialBalance.totals
  }> = {}
  
  trialBalance.accounts.forEach(account => {
    if (!byType[account.accountType]) {
      byType[account.accountType] = {
        accountType: account.accountType,
        accounts: [],
        totals: {
          openingDebit: 0,
          openingCredit: 0,
          periodDebit: 0,
          periodCredit: 0,
          endingDebit: 0,
          endingCredit: 0
        }
      }
    }
    
    byType[account.accountType].accounts.push(account)
    byType[account.accountType].totals.openingDebit += account.openingDebit
    byType[account.accountType].totals.openingCredit += account.openingCredit
    byType[account.accountType].totals.periodDebit += account.periodDebit
    byType[account.accountType].totals.periodCredit += account.periodCredit
    byType[account.accountType].totals.endingDebit += account.endingDebit
    byType[account.accountType].totals.endingCredit += account.endingCredit
  })
  
  return {
    startDate: trialBalance.startDate,
    endDate: trialBalance.endDate,
    byType: Object.values(byType),
    totals: trialBalance.totals,
    generatedAt: trialBalance.generatedAt
  }
}
