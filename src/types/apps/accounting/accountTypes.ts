export type AccountType = {
  id: string
  code: string
  name: string
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
  balance: number
  isActive: boolean
  parentId?: string
  children?: AccountType[]
  description?: string
  currency?: string
  isSystem?: boolean
  openingBalance?: number
  currentBalance?: number
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type FlatAccountType = Omit<AccountType, 'children'> & {
  parentId?: string
  children?: undefined
  level?: number
  hasChildren?: boolean
}

export type AccountFormType = {
  id?: string
  code: string
  name: string
  type: string
  parentId?: string | null
  description?: string
  isActive: boolean
  openingBalance?: number
  currency?: string
}

export type AccountTypeType = {
  id: string
  name: string
  description?: string
  accounts?: AccountType[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type AccountFilterType = {
  search?: string
  type?: string
  isActive?: boolean
}

export type AccountBalanceHistoryType = {
  date: Date | string
  balance: number
}

export type AccountTransactionSummaryType = {
  id: string
  date: Date | string
  reference: string
  description?: string
  debit: number
  credit: number
  balance: number
}

export type AccountStatementType = {
  account: AccountType
  openingBalance: number
  closingBalance: number
  startDate: Date | string
  endDate: Date | string
  transactions: AccountTransactionSummaryType[]
}

export type AccountTreeNode = {
  id: string
  code: string
  name: string
  type: string
  balance: number
  children: AccountTreeNode[]
  level: number
  isExpanded?: boolean
}

export type AccountBulkActionType = {
  ids: string[]
  action: 'activate' | 'deactivate' | 'delete'
}

export type AccountImportType = {
  code: string
  name: string
  type: string
  parentCode?: string
  description?: string
  isActive: boolean
  openingBalance?: number
  currency?: string
}

export type AccountExportType = {
  id: string
  code: string
  name: string
  type: string
  parentCode?: string
  description?: string
  isActive: boolean
  openingBalance: number
  currentBalance: number
  currency: string
  createdAt: string
  updatedAt: string
}
