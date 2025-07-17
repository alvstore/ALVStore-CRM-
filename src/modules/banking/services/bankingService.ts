import { BankAccount, BankTransaction, JournalEntry, BankingFilters, BankingSummary } from '../types';

// Mock bank accounts data
const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Business Checking',
    accountNumber: '****1234',
    bankName: 'First National Bank',
    accountType: 'checking',
    balance: 25000.00,
    currency: 'USD',
    isActive: true,
    description: 'Primary business checking account',
    openingBalance: 10000.00,
    openingDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '2',
    name: 'Business Savings',
    accountNumber: '****5678',
    bankName: 'First National Bank',
    accountType: 'savings',
    balance: 50000.00,
    currency: 'USD',
    isActive: true,
    description: 'Emergency fund and savings',
    openingBalance: 45000.00,
    openingDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
  },
  {
    id: '3',
    name: 'Petty Cash',
    accountNumber: 'CASH-001',
    bankName: 'Cash Account',
    accountType: 'checking',
    balance: 500.00,
    currency: 'USD',
    isActive: true,
    description: 'Office petty cash fund',
    openingBalance: 1000.00,
    openingDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-28T14:20:00Z',
  },
  {
    id: '4',
    name: 'Business Credit Card',
    accountNumber: '****9999',
    bankName: 'Business Bank',
    accountType: 'credit',
    balance: -2500.00,
    currency: 'USD',
    isActive: true,
    description: 'Business expenses credit card',
    openingBalance: 0.00,
    openingDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-29T16:45:00Z',
  },
];

// Mock bank transactions data
const mockBankTransactions: BankTransaction[] = [
  {
    id: '1',
    accountId: '1',
    accountName: 'Business Checking',
    type: 'deposit',
    amount: 5000.00,
    balance: 25000.00,
    description: 'Customer payment - Invoice INV-2024-001',
    reference: 'DEP-001',
    category: 'Revenue',
    date: '2024-01-30',
    createdAt: '2024-01-30T15:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '2',
    accountId: '1',
    accountName: 'Business Checking',
    type: 'withdraw',
    amount: 1200.00,
    balance: 20000.00,
    description: 'Office rent payment',
    reference: 'CHK-001',
    category: 'Rent',
    date: '2024-01-28',
    createdAt: '2024-01-28T14:20:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
  {
    id: '3',
    accountId: '2',
    accountName: 'Business Savings',
    type: 'deposit',
    amount: 5000.00,
    balance: 50000.00,
    description: 'Monthly savings transfer',
    reference: 'SAV-001',
    category: 'Savings',
    date: '2024-01-25',
    createdAt: '2024-01-25T10:15:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
  {
    id: '4',
    accountId: '1',
    accountName: 'Business Checking',
    type: 'transfer_out',
    amount: 5000.00,
    balance: 21200.00,
    description: 'Transfer to savings account',
    reference: 'TRF-001',
    category: 'Transfer',
    date: '2024-01-25',
    createdAt: '2024-01-25T10:15:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    transferToAccountId: '2',
    transferToAccountName: 'Business Savings',
  },
  {
    id: '5',
    accountId: '2',
    accountName: 'Business Savings',
    type: 'transfer_in',
    amount: 5000.00,
    balance: 45000.00,
    description: 'Transfer from checking account',
    reference: 'TRF-001',
    category: 'Transfer',
    date: '2024-01-25',
    createdAt: '2024-01-25T10:15:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    transferFromAccountId: '1',
    transferFromAccountName: 'Business Checking',
  },
  {
    id: '6',
    accountId: '3',
    accountName: 'Petty Cash',
    type: 'withdraw',
    amount: 50.00,
    balance: 500.00,
    description: 'Office supplies purchase',
    reference: 'CASH-001',
    category: 'Office Supplies',
    date: '2024-01-28',
    createdAt: '2024-01-28T14:20:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '7',
    accountId: '4',
    accountName: 'Business Credit Card',
    type: 'withdraw',
    amount: 2500.00,
    balance: -2500.00,
    description: 'Equipment purchase',
    reference: 'CC-001',
    category: 'Equipment',
    date: '2024-01-29',
    createdAt: '2024-01-29T16:45:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
];

// Mock journal entries
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    transactionId: '1',
    date: '2024-01-30',
    description: 'Customer payment - Invoice INV-2024-001',
    reference: 'DEP-001',
    entries: [
      {
        id: '1',
        accountCode: '1001',
        accountName: 'Business Checking',
        debit: 5000.00,
        credit: 0.00,
        description: 'Cash received',
      },
      {
        id: '2',
        accountCode: '4001',
        accountName: 'Sales Revenue',
        debit: 0.00,
        credit: 5000.00,
        description: 'Revenue recognition',
      },
    ],
    totalDebit: 5000.00,
    totalCredit: 5000.00,
    createdAt: '2024-01-30T15:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '2',
    transactionId: '2',
    date: '2024-01-28',
    description: 'Office rent payment',
    reference: 'CHK-001',
    entries: [
      {
        id: '1',
        accountCode: '5001',
        accountName: 'Rent Expense',
        debit: 1200.00,
        credit: 0.00,
        description: 'Monthly rent',
      },
      {
        id: '2',
        accountCode: '1001',
        accountName: 'Business Checking',
        debit: 0.00,
        credit: 1200.00,
        description: 'Cash payment',
      },
    ],
    totalDebit: 1200.00,
    totalCredit: 1200.00,
    createdAt: '2024-01-28T14:20:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
];

let bankAccounts = [...mockBankAccounts];
let bankTransactions = [...mockBankTransactions];
let journalEntries = [...mockJournalEntries];
let nextTransactionId = 8;
let nextJournalId = 3;

export class BankingService {
  static async getBankAccounts(): Promise<BankAccount[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return bankAccounts.filter(account => account.isActive);
  }

  static async getBankAccountById(id: string): Promise<BankAccount | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return bankAccounts.find(account => account.id === id) || null;
  }

  static async createBankAccount(accountData: Omit<BankAccount, 'id' | 'balance' | 'createdAt' | 'updatedAt'>): Promise<BankAccount> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAccount: BankAccount = {
      ...accountData,
      id: (bankAccounts.length + 1).toString(),
      balance: accountData.openingBalance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    bankAccounts.push(newAccount);
    
    // Create opening balance journal entry if opening balance > 0
    if (accountData.openingBalance !== 0) {
      const openingTransaction: BankTransaction = {
        id: nextTransactionId.toString(),
        accountId: newAccount.id,
        accountName: newAccount.name,
        type: accountData.openingBalance > 0 ? 'deposit' : 'withdraw',
        amount: Math.abs(accountData.openingBalance),
        balance: accountData.openingBalance,
        description: 'Opening balance',
        reference: `OB-${newAccount.id}`,
        category: 'Opening Balance',
        date: accountData.openingDate,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        createdByName: 'System',
      };
      
      bankTransactions.push(openingTransaction);
      nextTransactionId++;
    }
    
    return newAccount;
  }

  static async updateBankAccount(id: string, accountData: Partial<BankAccount>): Promise<BankAccount> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = bankAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Bank account not found');
    }
    
    bankAccounts[index] = {
      ...bankAccounts[index],
      ...accountData,
      updatedAt: new Date().toISOString(),
    };
    
    return bankAccounts[index];
  }

  static async deleteBankAccount(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = bankAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Bank account not found');
    }
    
    // Check if account has transactions
    const hasTransactions = bankTransactions.some(transaction => transaction.accountId === id);
    if (hasTransactions) {
      // Soft delete - mark as inactive
      bankAccounts[index].isActive = false;
      bankAccounts[index].updatedAt = new Date().toISOString();
    } else {
      // Hard delete if no transactions
      bankAccounts.splice(index, 1);
    }
  }

  static async getBankTransactions(filters?: BankingFilters): Promise<BankTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredTransactions = [...bankTransactions];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.description.toLowerCase().includes(search) ||
          transaction.reference?.toLowerCase().includes(search) ||
          transaction.accountName.toLowerCase().includes(search)
        );
      }
      
      if (filters.accountId && filters.accountId !== 'all') {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.accountId === filters.accountId);
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.type === filters.type);
      }
      
      if (filters.category && filters.category !== 'all') {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.category === filters.category);
      }
      
      if (filters.dateRange.start) {
        filteredTransactions = filteredTransactions.filter(transaction => 
          new Date(transaction.date) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredTransactions = filteredTransactions.filter(transaction => 
          new Date(transaction.date) <= new Date(filters.dateRange.end!)
        );
      }
      
      if (filters.amountRange.min !== undefined) {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.amount >= filters.amountRange.min!);
      }
      
      if (filters.amountRange.max !== undefined) {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.amount <= filters.amountRange.max!);
      }
    }
    
    return filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async createTransaction(transactionData: any): Promise<BankTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const account = bankAccounts.find(acc => acc.id === transactionData.accountId);
    if (!account) {
      throw new Error('Bank account not found');
    }
    
    const transactions: BankTransaction[] = [];
    
    if (transactionData.type === 'transfer') {
      const toAccount = bankAccounts.find(acc => acc.id === transactionData.transferToAccountId);
      if (!toAccount) {
        throw new Error('Transfer destination account not found');
      }
      
      // Create transfer out transaction
      const transferOutTransaction: BankTransaction = {
        id: nextTransactionId.toString(),
        accountId: account.id,
        accountName: account.name,
        type: 'transfer_out',
        amount: transactionData.amount,
        balance: account.balance - transactionData.amount,
        description: `Transfer to ${toAccount.name}`,
        reference: transactionData.reference || `TRF-${nextTransactionId}`,
        category: 'Transfer',
        date: transactionData.date,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        createdByName: 'Current User',
        transferToAccountId: toAccount.id,
        transferToAccountName: toAccount.name,
      };
      
      // Create transfer in transaction
      const transferInTransaction: BankTransaction = {
        id: (nextTransactionId + 1).toString(),
        accountId: toAccount.id,
        accountName: toAccount.name,
        type: 'transfer_in',
        amount: transactionData.amount,
        balance: toAccount.balance + transactionData.amount,
        description: `Transfer from ${account.name}`,
        reference: transactionData.reference || `TRF-${nextTransactionId}`,
        category: 'Transfer',
        date: transactionData.date,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        createdByName: 'Current User',
        transferFromAccountId: account.id,
        transferFromAccountName: account.name,
      };
      
      // Update account balances
      account.balance -= transactionData.amount;
      account.updatedAt = new Date().toISOString();
      toAccount.balance += transactionData.amount;
      toAccount.updatedAt = new Date().toISOString();
      
      transactions.push(transferOutTransaction, transferInTransaction);
      bankTransactions.push(transferOutTransaction, transferInTransaction);
      nextTransactionId += 2;
      
    } else {
      // Regular deposit or withdrawal
      const balanceChange = transactionData.type === 'deposit' ? transactionData.amount : -transactionData.amount;
      
      const transaction: BankTransaction = {
        id: nextTransactionId.toString(),
        accountId: account.id,
        accountName: account.name,
        type: transactionData.type,
        amount: transactionData.amount,
        balance: account.balance + balanceChange,
        description: transactionData.description,
        reference: transactionData.reference,
        category: transactionData.category,
        date: transactionData.date,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        createdByName: 'Current User',
      };
      
      // Update account balance
      account.balance += balanceChange;
      account.updatedAt = new Date().toISOString();
      
      transactions.push(transaction);
      bankTransactions.push(transaction);
      nextTransactionId++;
    }
    
    // Create journal entries for each transaction
    transactions.forEach(transaction => {
      this.createJournalEntry(transaction);
    });
    
    return transactions;
  }

  private static createJournalEntry(transaction: BankTransaction): void {
    const journalEntry: JournalEntry = {
      id: nextJournalId.toString(),
      transactionId: transaction.id,
      date: transaction.date,
      description: transaction.description,
      reference: transaction.reference,
      entries: [],
      totalDebit: transaction.amount,
      totalCredit: transaction.amount,
      createdAt: new Date().toISOString(),
      createdBy: '1',
      createdByName: 'Current User',
    };
    
    // Create journal entry lines based on transaction type
    if (transaction.type === 'deposit') {
      journalEntry.entries = [
        {
          id: '1',
          accountCode: '1001',
          accountName: transaction.accountName,
          debit: transaction.amount,
          credit: 0,
          description: 'Cash received',
        },
        {
          id: '2',
          accountCode: '4001',
          accountName: 'Revenue',
          debit: 0,
          credit: transaction.amount,
          description: 'Revenue recognition',
        },
      ];
    } else if (transaction.type === 'withdraw') {
      journalEntry.entries = [
        {
          id: '1',
          accountCode: '5001',
          accountName: transaction.category || 'Expense',
          debit: transaction.amount,
          credit: 0,
          description: 'Expense payment',
        },
        {
          id: '2',
          accountCode: '1001',
          accountName: transaction.accountName,
          debit: 0,
          credit: transaction.amount,
          description: 'Cash payment',
        },
      ];
    } else if (transaction.type === 'transfer_out') {
      journalEntry.entries = [
        {
          id: '1',
          accountCode: '1002',
          accountName: transaction.transferToAccountName || 'Transfer Account',
          debit: transaction.amount,
          credit: 0,
          description: 'Transfer to account',
        },
        {
          id: '2',
          accountCode: '1001',
          accountName: transaction.accountName,
          debit: 0,
          credit: transaction.amount,
          description: 'Transfer from account',
        },
      ];
    }
    
    journalEntries.push(journalEntry);
    nextJournalId++;
  }

  static async getJournalEntries(): Promise<JournalEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getBankingSummary(): Promise<BankingSummary> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const totalBalance = bankAccounts
      .filter(account => account.isActive)
      .reduce((sum, account) => sum + account.balance, 0);
    
    const deposits = bankTransactions.filter(t => t.type === 'deposit' || t.type === 'transfer_in');
    const withdrawals = bankTransactions.filter(t => t.type === 'withdraw' || t.type === 'transfer_out');
    
    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    
    const accountBreakdown = bankAccounts
      .filter(account => account.isActive)
      .map(account => ({
        accountName: account.name,
        balance: account.balance,
        accountType: account.accountType,
      }));
    
    const recentTransactions = bankTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    return {
      totalBalance,
      totalDeposits,
      totalWithdrawals,
      accountBreakdown,
      recentTransactions,
    };
  }
}