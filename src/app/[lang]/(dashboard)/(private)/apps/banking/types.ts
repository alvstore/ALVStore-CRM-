export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  description?: string;
  openingBalance: number;
  openingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  accountId: string;
  accountName: string;
  type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out';
  amount: number;
  balance: number;
  description: string;
  reference?: string;
  category?: string;
  date: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  transferToAccountId?: string;
  transferToAccountName?: string;
  transferFromAccountId?: string;
  transferFromAccountName?: string;
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  reference?: string;
  entries: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface BankAccountFormData {
  name: string;
  accountNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
  currency: string;
  openingBalance: number;
  openingDate: string;
  description?: string;
}

export interface TransactionFormData {
  accountId: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  description: string;
  reference?: string;
  category?: string;
  date: string;
  transferToAccountId?: string;
}

export interface BankingFilters {
  search: string;
  accountId: string;
  type: string;
  category: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  amountRange: {
    min?: number;
    max?: number;
  };
}

export interface BankingSummary {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  accountBreakdown: { accountName: string; balance: number; accountType: string }[];
  recentTransactions: BankTransaction[];
}