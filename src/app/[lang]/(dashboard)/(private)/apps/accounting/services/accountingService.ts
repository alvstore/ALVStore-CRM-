import { 
  ChartOfAccount, 
  JournalEntry, 
  GeneralLedgerEntry, 
  TrialBalance, 
  TrialBalanceEntry,
  AccountingFilters,
  GeneralLedgerFilters 
} from '../types';

// Mock Chart of Accounts data
const mockChartOfAccounts: ChartOfAccount[] = [
  // Assets
  {
    id: '1',
    code: '1000',
    name: 'ASSETS',
    type: 'asset',
    category: 'Current Assets',
    level: 0,
    isActive: true,
    balance: 0,
    debitBalance: 0,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    code: '1001',
    name: 'Cash and Cash Equivalents',
    type: 'asset',
    category: 'Current Assets',
    parentId: '1',
    parentCode: '1000',
    parentName: 'ASSETS',
    level: 1,
    isActive: true,
    balance: 75500.00,
    debitBalance: 75500.00,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '3',
    code: '1002',
    name: 'Accounts Receivable',
    type: 'asset',
    category: 'Current Assets',
    parentId: '1',
    parentCode: '1000',
    parentName: 'ASSETS',
    level: 1,
    isActive: true,
    balance: 15000.00,
    debitBalance: 15000.00,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '4',
    code: '1003',
    name: 'Inventory',
    type: 'asset',
    category: 'Current Assets',
    parentId: '1',
    parentCode: '1000',
    parentName: 'ASSETS',
    level: 1,
    isActive: true,
    balance: 25000.00,
    debitBalance: 25000.00,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '5',
    code: '1500',
    name: 'Fixed Assets',
    type: 'asset',
    category: 'Fixed Assets',
    parentId: '1',
    parentCode: '1000',
    parentName: 'ASSETS',
    level: 1,
    isActive: true,
    balance: 50000.00,
    debitBalance: 50000.00,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  
  // Liabilities
  {
    id: '6',
    code: '2000',
    name: 'LIABILITIES',
    type: 'liability',
    category: 'Current Liabilities',
    level: 0,
    isActive: true,
    balance: 0,
    debitBalance: 0,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    code: '2001',
    name: 'Accounts Payable',
    type: 'liability',
    category: 'Current Liabilities',
    parentId: '6',
    parentCode: '2000',
    parentName: 'LIABILITIES',
    level: 1,
    isActive: true,
    balance: 8500.00,
    debitBalance: 0,
    creditBalance: 8500.00,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '8',
    code: '2002',
    name: 'Accrued Expenses',
    type: 'liability',
    category: 'Current Liabilities',
    parentId: '6',
    parentCode: '2000',
    parentName: 'LIABILITIES',
    level: 1,
    isActive: true,
    balance: 3200.00,
    debitBalance: 0,
    creditBalance: 3200.00,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '9',
    code: '2500',
    name: 'Long-term Debt',
    type: 'liability',
    category: 'Long-term Liabilities',
    parentId: '6',
    parentCode: '2000',
    parentName: 'LIABILITIES',
    level: 1,
    isActive: true,
    balance: 25000.00,
    debitBalance: 0,
    creditBalance: 25000.00,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },

  // Equity
  {
    id: '10',
    code: '3000',
    name: 'EQUITY',
    type: 'equity',
    category: 'Owner\'s Equity',
    level: 0,
    isActive: true,
    balance: 0,
    debitBalance: 0,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '11',
    code: '3001',
    name: 'Owner\'s Capital',
    type: 'equity',
    category: 'Owner\'s Equity',
    parentId: '10',
    parentCode: '3000',
    parentName: 'EQUITY',
    level: 1,
    isActive: true,
    balance: 100000.00,
    debitBalance: 0,
    creditBalance: 100000.00,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '12',
    code: '3002',
    name: 'Retained Earnings',
    type: 'equity',
    category: 'Owner\'s Equity',
    parentId: '10',
    parentCode: '3000',
    parentName: 'EQUITY',
    level: 1,
    isActive: true,
    balance: 15800.00,
    debitBalance: 0,
    creditBalance: 15800.00,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },

  // Revenue
  {
    id: '13',
    code: '4000',
    name: 'REVENUE',
    type: 'revenue',
    category: 'Operating Revenue',
    level: 0,
    isActive: true,
    balance: 0,
    debitBalance: 0,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '14',
    code: '4001',
    name: 'Sales Revenue',
    type: 'revenue',
    category: 'Operating Revenue',
    parentId: '13',
    parentCode: '4000',
    parentName: 'REVENUE',
    level: 1,
    isActive: true,
    balance: 45000.00,
    debitBalance: 0,
    creditBalance: 45000.00,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '15',
    code: '4002',
    name: 'Service Revenue',
    type: 'revenue',
    category: 'Operating Revenue',
    parentId: '13',
    parentCode: '4000',
    parentName: 'REVENUE',
    level: 1,
    isActive: true,
    balance: 18000.00,
    debitBalance: 0,
    creditBalance: 18000.00,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },

  // Expenses
  {
    id: '16',
    code: '5000',
    name: 'EXPENSES',
    type: 'expense',
    category: 'Operating Expenses',
    level: 0,
    isActive: true,
    balance: 0,
    debitBalance: 0,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '17',
    code: '5001',
    name: 'Cost of Goods Sold',
    type: 'expense',
    category: 'Cost of Sales',
    parentId: '16',
    parentCode: '5000',
    parentName: 'EXPENSES',
    level: 1,
    isActive: true,
    balance: 18000.00,
    debitBalance: 18000.00,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '18',
    code: '5002',
    name: 'Rent Expense',
    type: 'expense',
    category: 'Operating Expenses',
    parentId: '16',
    parentCode: '5000',
    parentName: 'EXPENSES',
    level: 1,
    isActive: true,
    balance: 6000.00,
    debitBalance: 6000.00,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '19',
    code: '5003',
    name: 'Utilities Expense',
    type: 'expense',
    category: 'Operating Expenses',
    parentId: '16',
    parentCode: '5000',
    parentName: 'EXPENSES',
    level: 1,
    isActive: true,
    balance: 1200.00,
    debitBalance: 1200.00,
    creditBalance: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
];

// Mock Journal Entries data
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    number: 'JE-2024-001',
    date: '2024-01-15',
    description: 'Sales revenue recognition',
    reference: 'INV-2024-001',
    entries: [
      {
        id: '1',
        journalEntryId: '1',
        accountId: '2',
        accountCode: '1001',
        accountName: 'Cash and Cash Equivalents',
        description: 'Cash received from customer',
        debit: 5000.00,
        credit: 0.00,
      },
      {
        id: '2',
        journalEntryId: '1',
        accountId: '14',
        accountCode: '4001',
        accountName: 'Sales Revenue',
        description: 'Revenue recognition',
        debit: 0.00,
        credit: 5000.00,
      },
    ],
    totalDebit: 5000.00,
    totalCredit: 5000.00,
    status: 'posted',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    postedAt: '2024-01-15T10:30:00Z',
    postedBy: '1',
    postedByName: 'John Admin',
  },
  {
    id: '2',
    number: 'JE-2024-002',
    date: '2024-01-20',
    description: 'Rent expense payment',
    reference: 'CHK-001',
    entries: [
      {
        id: '3',
        journalEntryId: '2',
        accountId: '18',
        accountCode: '5002',
        accountName: 'Rent Expense',
        description: 'Monthly office rent',
        debit: 1200.00,
        credit: 0.00,
      },
      {
        id: '4',
        journalEntryId: '2',
        accountId: '2',
        accountCode: '1001',
        accountName: 'Cash and Cash Equivalents',
        description: 'Cash payment for rent',
        debit: 0.00,
        credit: 1200.00,
      },
    ],
    totalDebit: 1200.00,
    totalCredit: 1200.00,
    status: 'posted',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    postedAt: '2024-01-20T14:15:00Z',
    postedBy: '1',
    postedByName: 'John Admin',
  },
  {
    id: '3',
    number: 'JE-2024-003',
    date: '2024-01-25',
    description: 'Purchase of inventory',
    reference: 'PO-2024-001',
    entries: [
      {
        id: '5',
        journalEntryId: '3',
        accountId: '4',
        accountCode: '1003',
        accountName: 'Inventory',
        description: 'Inventory purchase',
        debit: 3000.00,
        credit: 0.00,
      },
      {
        id: '6',
        journalEntryId: '3',
        accountId: '7',
        accountCode: '2001',
        accountName: 'Accounts Payable',
        description: 'Amount owed to supplier',
        debit: 0.00,
        credit: 3000.00,
      },
    ],
    totalDebit: 3000.00,
    totalCredit: 3000.00,
    status: 'posted',
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    postedAt: '2024-01-25T11:30:00Z',
    postedBy: '1',
    postedByName: 'John Admin',
  },
  {
    id: '4',
    number: 'JE-2024-004',
    date: '2024-01-30',
    description: 'Service revenue recognition',
    reference: 'INV-2024-005',
    entries: [
      {
        id: '7',
        journalEntryId: '4',
        accountId: '3',
        accountCode: '1002',
        accountName: 'Accounts Receivable',
        description: 'Service provided on credit',
        debit: 2500.00,
        credit: 0.00,
      },
      {
        id: '8',
        journalEntryId: '4',
        accountId: '15',
        accountCode: '4002',
        accountName: 'Service Revenue',
        description: 'Service revenue recognition',
        debit: 0.00,
        credit: 2500.00,
      },
    ],
    totalDebit: 2500.00,
    totalCredit: 2500.00,
    status: 'draft',
    createdAt: '2024-01-30T16:00:00Z',
    updatedAt: '2024-01-30T16:00:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
];

// Mock General Ledger data
const mockGeneralLedger: GeneralLedgerEntry[] = [
  {
    id: '1',
    accountId: '2',
    accountCode: '1001',
    accountName: 'Cash and Cash Equivalents',
    journalEntryId: '1',
    journalEntryNumber: 'JE-2024-001',
    date: '2024-01-15',
    description: 'Cash received from customer',
    reference: 'INV-2024-001',
    debit: 5000.00,
    credit: 0.00,
    balance: 5000.00,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    accountId: '14',
    accountCode: '4001',
    accountName: 'Sales Revenue',
    journalEntryId: '1',
    journalEntryNumber: 'JE-2024-001',
    date: '2024-01-15',
    description: 'Revenue recognition',
    reference: 'INV-2024-001',
    debit: 0.00,
    credit: 5000.00,
    balance: 5000.00,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '3',
    accountId: '18',
    accountCode: '5002',
    accountName: 'Rent Expense',
    journalEntryId: '2',
    journalEntryNumber: 'JE-2024-002',
    date: '2024-01-20',
    description: 'Monthly office rent',
    reference: 'CHK-001',
    debit: 1200.00,
    credit: 0.00,
    balance: 1200.00,
    createdAt: '2024-01-20T14:15:00Z',
  },
  {
    id: '4',
    accountId: '2',
    accountCode: '1001',
    accountName: 'Cash and Cash Equivalents',
    journalEntryId: '2',
    journalEntryNumber: 'JE-2024-002',
    date: '2024-01-20',
    description: 'Cash payment for rent',
    reference: 'CHK-001',
    debit: 0.00,
    credit: 1200.00,
    balance: 3800.00,
    createdAt: '2024-01-20T14:15:00Z',
  },
  {
    id: '5',
    accountId: '4',
    accountCode: '1003',
    accountName: 'Inventory',
    journalEntryId: '3',
    journalEntryNumber: 'JE-2024-003',
    date: '2024-01-25',
    description: 'Inventory purchase',
    reference: 'PO-2024-001',
    debit: 3000.00,
    credit: 0.00,
    balance: 3000.00,
    createdAt: '2024-01-25T11:30:00Z',
  },
  {
    id: '6',
    accountId: '7',
    accountCode: '2001',
    accountName: 'Accounts Payable',
    journalEntryId: '3',
    journalEntryNumber: 'JE-2024-003',
    date: '2024-01-25',
    description: 'Amount owed to supplier',
    reference: 'PO-2024-001',
    debit: 0.00,
    credit: 3000.00,
    balance: 3000.00,
    createdAt: '2024-01-25T11:30:00Z',
  },
];

let chartOfAccounts = [...mockChartOfAccounts];
let journalEntries = [...mockJournalEntries];
let generalLedger = [...mockGeneralLedger];
let nextAccountId = 20;
let nextJournalId = 5;
let nextLedgerId = 7;

export class AccountingService {
  static async getChartOfAccounts(filters?: AccountingFilters): Promise<ChartOfAccount[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredAccounts = [...chartOfAccounts];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredAccounts = filteredAccounts.filter(account =>
          account.code.toLowerCase().includes(search) ||
          account.name.toLowerCase().includes(search) ||
          account.category.toLowerCase().includes(search)
        );
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredAccounts = filteredAccounts.filter(account => account.type === filters.type);
      }
      
      if (filters.category && filters.category !== 'all') {
        filteredAccounts = filteredAccounts.filter(account => account.category === filters.category);
      }
    }
    
    return filteredAccounts.sort((a, b) => a.code.localeCompare(b.code));
  }

  static async getAccountById(id: string): Promise<ChartOfAccount | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return chartOfAccounts.find(account => account.id === id) || null;
  }

  static async createAccount(accountData: Omit<ChartOfAccount, 'id' | 'balance' | 'debitBalance' | 'creditBalance' | 'createdAt' | 'updatedAt'>): Promise<ChartOfAccount> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for duplicate code
    if (chartOfAccounts.some(acc => acc.code === accountData.code)) {
      throw new Error('Account code already exists');
    }
    
    const newAccount: ChartOfAccount = {
      ...accountData,
      id: nextAccountId.toString(),
      balance: 0,
      debitBalance: 0,
      creditBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    chartOfAccounts.push(newAccount);
    nextAccountId++;
    
    return newAccount;
  }

  static async updateAccount(id: string, accountData: Partial<ChartOfAccount>): Promise<ChartOfAccount> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = chartOfAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Account not found');
    }
    
    // Check for duplicate code if code is being changed
    if (accountData.code && accountData.code !== chartOfAccounts[index].code) {
      if (chartOfAccounts.some(acc => acc.code === accountData.code && acc.id !== id)) {
        throw new Error('Account code already exists');
      }
    }
    
    chartOfAccounts[index] = {
      ...chartOfAccounts[index],
      ...accountData,
      updatedAt: new Date().toISOString(),
    };
    
    return chartOfAccounts[index];
  }

  static async deleteAccount(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = chartOfAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Account not found');
    }
    
    // Check if account has transactions
    const hasTransactions = generalLedger.some(entry => entry.accountId === id);
    if (hasTransactions) {
      throw new Error('Cannot delete account with existing transactions');
    }
    
    chartOfAccounts.splice(index, 1);
  }

  static async getJournalEntries(filters?: AccountingFilters): Promise<JournalEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEntries = [...journalEntries];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredEntries = filteredEntries.filter(entry =>
          entry.number.toLowerCase().includes(search) ||
          entry.description.toLowerCase().includes(search) ||
          entry.reference?.toLowerCase().includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredEntries = filteredEntries.filter(entry => entry.status === filters.status);
      }
      
      if (filters.dateRange.start) {
        filteredEntries = filteredEntries.filter(entry => 
          new Date(entry.date) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredEntries = filteredEntries.filter(entry => 
          new Date(entry.date) <= new Date(filters.dateRange.end!)
        );
      }
    }
    
    return filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getJournalEntryById(id: string): Promise<JournalEntry | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return journalEntries.find(entry => entry.id === id) || null;
  }

  static async createJournalEntry(entryData: Omit<JournalEntry, 'id' | 'number' | 'totalDebit' | 'totalCredit' | 'createdAt' | 'updatedAt' | 'createdByName'>): Promise<JournalEntry> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate totals
    const totalDebit = entryData.entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = entryData.entries.reduce((sum, entry) => sum + entry.credit, 0);
    
    // Validate balanced entry
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error('Journal entry must be balanced (total debits must equal total credits)');
    }
    
    const newEntry: JournalEntry = {
      ...entryData,
      id: nextJournalId.toString(),
      number: `JE-2024-${nextJournalId.toString().padStart(3, '0')}`,
      totalDebit,
      totalCredit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByName: 'Current User',
      entries: entryData.entries.map((entry, index) => ({
        ...entry,
        id: `${nextJournalId}_${index + 1}`,
        journalEntryId: nextJournalId.toString(),
      })),
    };
    
    journalEntries.push(newEntry);
    nextJournalId++;
    
    return newEntry;
  }

  static async postJournalEntry(id: string): Promise<JournalEntry> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = journalEntries.findIndex(entry => entry.id === id);
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    
    const entry = journalEntries[index];
    if (entry.status !== 'draft') {
      throw new Error('Only draft entries can be posted');
    }
    
    // Update journal entry status
    journalEntries[index] = {
      ...entry,
      status: 'posted',
      postedAt: new Date().toISOString(),
      postedBy: '1',
      postedByName: 'Current User',
      updatedAt: new Date().toISOString(),
    };
    
    // Create general ledger entries
    entry.entries.forEach(entryLine => {
      const ledgerEntry: GeneralLedgerEntry = {
        id: nextLedgerId.toString(),
        accountId: entryLine.accountId,
        accountCode: entryLine.accountCode,
        accountName: entryLine.accountName,
        journalEntryId: entry.id,
        journalEntryNumber: entry.number,
        date: entry.date,
        description: entryLine.description || entry.description,
        reference: entry.reference,
        debit: entryLine.debit,
        credit: entryLine.credit,
        balance: 0, // Will be calculated
        createdAt: new Date().toISOString(),
      };
      
      generalLedger.push(ledgerEntry);
      nextLedgerId++;
      
      // Update account balances
      const accountIndex = chartOfAccounts.findIndex(acc => acc.id === entryLine.accountId);
      if (accountIndex !== -1) {
        const account = chartOfAccounts[accountIndex];
        account.debitBalance += entryLine.debit;
        account.creditBalance += entryLine.credit;
        
        // Calculate net balance based on account type
        if (account.type === 'asset' || account.type === 'expense') {
          account.balance = account.debitBalance - account.creditBalance;
        } else {
          account.balance = account.creditBalance - account.debitBalance;
        }
        
        account.updatedAt = new Date().toISOString();
      }
    });
    
    return journalEntries[index];
  }

  static async deleteJournalEntry(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = journalEntries.findIndex(entry => entry.id === id);
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    
    const entry = journalEntries[index];
    if (entry.status === 'posted') {
      throw new Error('Cannot delete posted journal entries. Reverse the entry instead.');
    }
    
    journalEntries.splice(index, 1);
  }

  static async getGeneralLedger(filters?: GeneralLedgerFilters): Promise<GeneralLedgerEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEntries = [...generalLedger];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredEntries = filteredEntries.filter(entry =>
          entry.accountCode.toLowerCase().includes(search) ||
          entry.accountName.toLowerCase().includes(search) ||
          entry.description.toLowerCase().includes(search) ||
          entry.reference?.toLowerCase().includes(search)
        );
      }
      
      if (filters.accountId && filters.accountId !== 'all') {
        filteredEntries = filteredEntries.filter(entry => entry.accountId === filters.accountId);
      }
      
      if (filters.dateRange.start) {
        filteredEntries = filteredEntries.filter(entry => 
          new Date(entry.date) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredEntries = filteredEntries.filter(entry => 
          new Date(entry.date) <= new Date(filters.dateRange.end!)
        );
      }
    }
    
    return filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getTrialBalance(asOfDate?: string): Promise<TrialBalance> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const cutoffDate = asOfDate ? new Date(asOfDate) : new Date();
    
    // Filter general ledger entries up to the cutoff date
    const relevantEntries = generalLedger.filter(entry => 
      new Date(entry.date) <= cutoffDate
    );
    
    // Group by account and calculate balances
    const accountBalances = new Map<string, {
      account: ChartOfAccount;
      debitTotal: number;
      creditTotal: number;
    }>();
    
    relevantEntries.forEach(entry => {
      const account = chartOfAccounts.find(acc => acc.id === entry.accountId);
      if (!account) return;
      
      if (!accountBalances.has(entry.accountId)) {
        accountBalances.set(entry.accountId, {
          account,
          debitTotal: 0,
          creditTotal: 0,
        });
      }
      
      const balance = accountBalances.get(entry.accountId)!;
      balance.debitTotal += entry.debit;
      balance.creditTotal += entry.credit;
    });
    
    // Create trial balance entries
    const entries: TrialBalanceEntry[] = [];
    let totalDebits = 0;
    let totalCredits = 0;
    
    accountBalances.forEach(({ account, debitTotal, creditTotal }) => {
      const netBalance = debitTotal - creditTotal;
      const debitBalance = netBalance > 0 ? netBalance : 0;
      const creditBalance = netBalance < 0 ? Math.abs(netBalance) : 0;
      
      entries.push({
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        debitBalance,
        creditBalance,
        netBalance,
      });
      
      totalDebits += debitBalance;
      totalCredits += creditBalance;
    });
    
    // Sort by account code
    entries.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
    
    return {
      asOfDate: cutoffDate.toISOString().split('T')[0],
      entries,
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
      generatedAt: new Date().toISOString(),
    };
  }

  static async getAccountCategories(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categories = [...new Set(chartOfAccounts.map(account => account.category))];
    return categories.sort();
  }
}