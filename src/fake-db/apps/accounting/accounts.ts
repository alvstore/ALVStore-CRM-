import type { AccountType } from '@/types/apps/accounting/accountTypes'

export const db: AccountType[] = [
  {
    id: '1',
    code: '1000',
    name: 'Current Assets',
    type: 'ASSET',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '1010',
        code: '1010',
        name: 'Cash and Cash Equivalents',
        type: 'ASSET',
        balance: 50000,
        isActive: true,
        children: [
          {
            id: '1011',
            code: '1011',
            name: 'Petty Cash',
            type: 'ASSET',
            balance: 1000,
            isActive: true
          },
          {
            id: '1012',
            code: '1012',
            name: 'Main Bank Account',
            type: 'ASSET',
            balance: 49000,
            isActive: true
          }
        ]
      },
      {
        id: '1020',
        code: '1020',
        name: 'Accounts Receivable',
        type: 'ASSET',
        balance: 25000,
        isActive: true,
        children: [
          {
            id: '1021',
            code: '1021',
            name: 'Trade Receivables',
            type: 'ASSET',
            balance: 20000,
            isActive: true
          },
          {
            id: '1022',
            code: '1022',
            name: 'Other Receivables',
            type: 'ASSET',
            balance: 5000,
            isActive: true
          }
        ]
      },
      {
        id: '1030',
        code: '1030',
        name: 'Inventory',
        type: 'ASSET',
        balance: 35000,
        isActive: true
      },
      {
        id: '1040',
        code: '1040',
        name: 'Prepaid Expenses',
        type: 'ASSET',
        balance: 5000,
        isActive: true
      }
    ]
  },
  {
    id: '2',
    code: '2000',
    name: 'Non-Current Assets',
    type: 'ASSET',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '2010',
        code: '2010',
        name: 'Property, Plant & Equipment',
        type: 'ASSET',
        balance: 150000,
        isActive: true,
        children: [
          {
            id: '2011',
            code: '2011',
            name: 'Land',
            type: 'ASSET',
            balance: 50000,
            isActive: true
          },
          {
            id: '2012',
            code: '2012',
            name: 'Buildings',
            type: 'ASSET',
            balance: 80000,
            isActive: true,
            children: [
              {
                id: '20121',
                code: '2012.1',
                name: 'Accumulated Depreciation - Buildings',
                type: 'ASSET',
                balance: -15000,
                isActive: true
              }
            ]
          },
          {
            id: '2013',
            code: '2013',
            name: 'Equipment',
            type: 'ASSET',
            balance: 30000,
            isActive: true,
            children: [
              {
                id: '20131',
                code: '2013.1',
                name: 'Accumulated Depreciation - Equipment',
                type: 'ASSET',
                balance: -10000,
                isActive: true
              }
            ]
          }
        ]
      },
      {
        id: '2020',
        code: '2020',
        name: 'Intangible Assets',
        type: 'ASSET',
        balance: 30000,
        isActive: true,
        children: [
          {
            id: '2021',
            code: '2021',
            name: 'Software',
            type: 'ASSET',
            balance: 20000,
            isActive: true,
            children: [
              {
                id: '20211',
                code: '2021.1',
                name: 'Accumulated Amortization - Software',
                type: 'ASSET',
                balance: -5000,
                isActive: true
              }
            ]
          },
          {
            id: '2022',
            code: '2022',
            name: 'Goodwill',
            type: 'ASSET',
            balance: 15000,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: '3',
    code: '3000',
    name: 'Current Liabilities',
    type: 'LIABILITY',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '3010',
        code: '3010',
        name: 'Accounts Payable',
        type: 'LIABILITY',
        balance: 25000,
        isActive: true
      },
      {
        id: '3020',
        code: '3020',
        name: 'Short-term Loans',
        type: 'LIABILITY',
        balance: 20000,
        isActive: true
      },
      {
        id: '3030',
        code: '3030',
        name: 'Accrued Expenses',
        type: 'LIABILITY',
        balance: 10000,
        isActive: true,
        children: [
          {
            id: '3031',
            code: '3031',
            name: 'Salaries Payable',
            type: 'LIABILITY',
            balance: 6000,
            isActive: true
          },
          {
            id: '3032',
            code: '3032',
            name: 'Taxes Payable',
            type: 'LIABILITY',
            balance: 4000,
            isActive: true
          }
        ]
      },
      {
        id: '3040',
        code: '3040',
        name: 'Unearned Revenue',
        type: 'LIABILITY',
        balance: 5000,
        isActive: true
      }
    ]
  },
  {
    id: '4',
    code: '4000',
    name: 'Long-term Liabilities',
    type: 'LIABILITY',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '4010',
        code: '4010',
        name: 'Long-term Loans',
        type: 'LIABILITY',
        balance: 100000,
        isActive: true
      },
      {
        id: '4020',
        code: '4020',
        name: 'Deferred Tax Liabilities',
        type: 'LIABILITY',
        balance: 15000,
        isActive: true
      }
    ]
  },
  {
    id: '5',
    code: '5000',
    name: 'Equity',
    type: 'EQUITY',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '5010',
        code: '5010',
        name: 'Common Stock',
        type: 'EQUITY',
        balance: 100000,
        isActive: true
      },
      {
        id: '5020',
        code: '5020',
        name: 'Retained Earnings',
        type: 'EQUITY',
        balance: 45000,
        isActive: true
      },
      {
        id: '5030',
        code: '5030',
        name: 'Current Year Earnings',
        type: 'EQUITY',
        balance: 25000,
        isActive: true
      }
    ]
  },
  {
    id: '6',
    code: '6000',
    name: 'Revenue',
    type: 'REVENUE',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '6010',
        code: '6010',
        name: 'Product Sales',
        type: 'REVENUE',
        balance: 250000,
        isActive: true
      },
      {
        id: '6020',
        code: '6020',
        name: 'Service Revenue',
        type: 'REVENUE',
        balance: 100000,
        isActive: true
      },
      {
        id: '6030',
        code: '6030',
        name: 'Interest Income',
        type: 'REVENUE',
        balance: 5000,
        isActive: true
      }
    ]
  },
  {
    id: '7',
    code: '7000',
    name: 'Cost of Goods Sold',
    type: 'EXPENSE',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '7010',
        code: '7010',
        name: 'Direct Materials',
        type: 'EXPENSE',
        balance: 100000,
        isActive: true
      },
      {
        id: '7020',
        code: '7020',
        name: 'Direct Labor',
        type: 'EXPENSE',
        balance: 50000,
        isActive: true
      },
      {
        id: '7030',
        code: '7030',
        name: 'Manufacturing Overhead',
        type: 'EXPENSE',
        balance: 25000,
        isActive: true
      }
    ]
  },
  {
    id: '8',
    code: '8000',
    name: 'Operating Expenses',
    type: 'EXPENSE',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '8010',
        code: '8010',
        name: 'Salaries and Wages',
        type: 'EXPENSE',
        balance: 75000,
        isActive: true
      },
      {
        id: '8020',
        code: '8020',
        name: 'Rent Expense',
        type: 'EXPENSE',
        balance: 24000,
        isActive: true
      },
      {
        id: '8030',
        code: '8030',
        name: 'Utilities',
        type: 'EXPENSE',
        balance: 6000,
        isActive: true
      },
      {
        id: '8040',
        code: '8040',
        name: 'Marketing and Advertising',
        type: 'EXPENSE',
        balance: 15000,
        isActive: true
      },
      {
        id: '8050',
        code: '8050',
        name: 'Depreciation and Amortization',
        type: 'EXPENSE',
        balance: 10000,
        isActive: true
      },
      {
        id: '8090',
        code: '8090',
        name: 'Other Operating Expenses',
        type: 'EXPENSE',
        balance: 5000,
        isActive: true
      }
    ]
  },
  {
    id: '9',
    code: '9000',
    name: 'Other Income and Expenses',
    type: 'EXPENSE',
    balance: 0,
    isActive: true,
    children: [
      {
        id: '9010',
        code: '9010',
        name: 'Interest Expense',
        type: 'EXPENSE',
        balance: 5000,
        isActive: true
      },
      {
        id: '9020',
        code: '9020',
        name: 'Loss on Sale of Assets',
        type: 'EXPENSE',
        balance: 2000,
        isActive: true
      },
      {
        id: '9090',
        code: '9090',
        name: 'Other Income',
        type: 'REVENUE',
        balance: -3000, // Negative because it's income, not expense
        isActive: true
      }
    ]
  }
]

// Flatten the tree structure for table display
export const flatAccounts = db.flatMap(account => [
  { ...account, children: undefined },
  ...(account.children || []).flatMap(child => [
    { ...child, parentId: account.id, children: undefined },
    ...(child.children || []).map(grandChild => ({
      ...grandChild,
      parentId: child.id,
      children: undefined
    }))
  ])
])
