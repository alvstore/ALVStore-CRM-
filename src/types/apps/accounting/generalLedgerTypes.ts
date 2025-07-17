import { AccountType } from './accountTypes'
import { JournalEntryType } from './journalEntryTypes'

export type GeneralLedgerEntryType = {
  id: string
  entryDate: Date | string
  journalEntryId: string
  journalEntryReference: string
  accountId: string
  accountCode: string
  accountName: string
  description?: string
  debit: number
  credit: number
  balance: number
  currency: string
  exchangeRate?: number
  fiscalYearId: string
  periodId: string
  createdById: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type AccountBalanceType = {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  openingBalance: number
  debit: number
  credit: number
  balance: number
  currency: string
}

export type GeneralLedgerFilterType = {
  accountId?: string
  startDate?: Date | string
  endDate?: Date | string
  fiscalYearId?: string
  periodId?: string
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type GeneralLedgerSummaryType = {
  totalDebit: number
  totalCredit: number
  balance: number
  accountCount: number
  entryCount: number
}

export type GeneralLedgerReportType = {
  entries: GeneralLedgerEntryType[]
  summary: GeneralLedgerSummaryType
  accountBalances: AccountBalanceType[]
  startDate: Date | string
  endDate: Date | string
}

export type GeneralLedgerExportType = {
  format: 'csv' | 'excel' | 'pdf'
  includeDetails: boolean
  includeSummary: boolean
  dateRange: {
    start: Date | string
    end: Date | string
  }
  accountIds?: string[]
  fiscalYearId?: string
  periodId?: string
}

export type GeneralLedgerImportType = {
  file: File | null
  mapping: Record<string, string>
  options: {
    createNewAccounts: boolean
    matchBy: 'code' | 'name' | 'id'
    dateFormat: string
    decimalSeparator: '.' | ','
    thousandSeparator: ',' | '.' | ''
  }
}

export type GeneralLedgerReconciliationType = {
  id: string
  accountId: string
  statementDate: Date | string
  statementBalance: number
  endingBalance: number
  clearedBalance: number
  difference: number
  status: 'open' | 'completed' | 'cancelled'
  notes?: string
  reconciledById?: string
  reconciledAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export type GeneralLedgerReconciliationEntryType = {
  id: string
  reconciliationId: string
  entryId: string
  entryType: 'debit' | 'credit'
  amount: number
  status: 'cleared' | 'voided'
  clearedAt: Date | string
  clearedById: string
  notes?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type GeneralLedgerAccountActivityType = {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  entries: Array<{
    id: string
    date: Date | string
    reference: string
    description?: string
    debit: number
    credit: number
    balance: number
    journalEntryId: string
  }>
  openingBalance: number
  endingBalance: number
  totalDebit: number
  totalCredit: number
}

export type GeneralLedgerTrialBalanceType = {
  accounts: Array<{
    accountId: string
    accountCode: string
    accountName: string
    accountType: AccountType
    openingDebit: number
    openingCredit: number
    periodDebit: number
    periodCredit: number
    endingDebit: number
    endingCredit: number
  }>
  totals: {
    openingDebit: number
    openingCredit: number
    periodDebit: number
    periodCredit: number
    endingDebit: number
    endingCredit: number
  }
  startDate: Date | string
  endDate: Date | string
  generatedAt: Date | string
}
