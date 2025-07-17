import { AccountType } from './accountTypes'

export type TrialBalanceAccountType = {
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
}

export type TrialBalanceTotalsType = {
  openingDebit: number
  openingCredit: number
  periodDebit: number
  periodCredit: number
  endingDebit: number
  endingCredit: number
}

export type TrialBalanceType = {
  accounts: TrialBalanceAccountType[]
  totals: TrialBalanceTotalsType
  startDate: Date | string
  endDate: Date | string
  generatedAt: Date | string
}

export type TrialBalanceSummaryType = {
  startDate: Date | string
  endDate: Date | string
  totalDebit: number
  totalCredit: number
  difference: number
  isBalanced: boolean
  accountCount: number
  generatedAt: Date | string
}

export type TrialBalanceByAccountType = {
  accountType: string
  accounts: TrialBalanceAccountType[]
  totals: TrialBalanceTotalsType
}

export type TrialBalanceByTypeReportType = {
  startDate: Date | string
  endDate: Date | string
  byType: TrialBalanceByAccountType[]
  totals: TrialBalanceTotalsType
  generatedAt: Date | string
}

export type TrialBalanceExportFormat = 'csv' | 'excel' | 'pdf'

export type TrialBalanceExportOptions = {
  format: TrialBalanceExportFormat
  includeDetails: boolean
  includeSummary: boolean
  includeZeroBalances: boolean
  includeOpeningBalances: boolean
  includePeriodActivity: boolean
  includeEndingBalances: boolean
}

export type TrialBalanceFilterType = {
  startDate?: Date | string
  endDate?: Date | string
  fiscalYearId?: string
  periodId?: string
  accountType?: AccountType
  includeInactive?: boolean
  search?: string
}

export type TrialBalanceComparisonType = {
  current: TrialBalanceType
  previous?: TrialBalanceType
  percentageChange: {
    periodDebit: number
    periodCredit: number
    endingDebit: number
    endingCredit: number
  }
  variance: {
    periodDebit: number
    periodCredit: number
    endingDebit: number
    endingCredit: number
  }
}

export type TrialBalanceAccountActivityType = {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  openingBalance: number
  endingBalance: number
  totalDebit: number
  totalCredit: number
  entries: Array<{
    id: string
    date: Date | string
    reference: string
    description?: string
    debit: number
    credit: number
    balance: number
  }>
}

export type TrialBalanceAccountDetailType = {
  account: TrialBalanceAccountType
  activity: TrialBalanceAccountActivityType
  startDate: Date | string
  endDate: Date | string
  generatedAt: Date | string
}

export type TrialBalanceReconciliationType = {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  statementDate: Date | string
  statementBalance: number
  calculatedBalance: number
  difference: number
  status: 'reconciled' | 'unreconciled' | 'partially_reconciled'
  reconciledAt?: Date | string
  reconciledBy?: string
  notes?: string
  entries: Array<{
    id: string
    date: Date | string
    reference: string
    description?: string
    debit: number
    credit: number
    balance: number
    status: 'cleared' | 'uncleared' | 'voided'
    clearedAt?: Date | string
    clearedBy?: string
  }>
}
