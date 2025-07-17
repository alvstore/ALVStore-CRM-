export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  parentId?: string;
  parentCode?: string;
  parentName?: string;
  level: number;
  isActive: boolean;
  description?: string;
  balance: number;
  debitBalance: number;
  creditBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  number: string;
  date: string;
  description: string;
  reference?: string;
  entries: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  postedAt?: string;
  postedBy?: string;
  postedByName?: string;
  reversedAt?: string;
  reversedBy?: string;
  reversedByName?: string;
  reversalReason?: string;
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description?: string;
  debit: number;
  credit: number;
  reference?: string;
}

export interface GeneralLedgerEntry {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  journalEntryId: string;
  journalEntryNumber: string;
  date: string;
  description: string;
  reference?: string;
  debit: number;
  credit: number;
  balance: number;
  createdAt: string;
}

export interface TrialBalanceEntry {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  debitBalance: number;
  creditBalance: number;
  netBalance: number;
}

export interface TrialBalance {
  asOfDate: string;
  entries: TrialBalanceEntry[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  generatedAt: string;
}

export interface ChartOfAccountFormData {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  parentId?: string;
  description?: string;
}

export interface JournalEntryFormData {
  date: string;
  description: string;
  reference?: string;
  entries: {
    accountId: string;
    description?: string;
    debit: number;
    credit: number;
    reference?: string;
  }[];
}

export interface AccountingFilters {
  search: string;
  type: string;
  category: string;
  status: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface GeneralLedgerFilters {
  search: string;
  accountId: string;
  dateRange: {
    start?: string;
    end?: string;
  };
}