// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  // ============================
  // DASHBOARDS
  // ============================
  {
    label: 'Dashboards',
    icon: 'tabler-layout-dashboard',
    children: [
      {
        label: 'CRM',
        href: '/dashboards/crm',
        icon: 'tabler-users'
      },
      {
        label: 'Analytics',
        href: '/dashboards/analytics',
        icon: 'tabler-chart-bar'
      },
      {
        label: 'E-commerce',
        href: '/dashboards/ecommerce',
        icon: 'tabler-shopping-cart'
      }
    ]
  },

  // ============================
  // BUSINESS SUITE
  // ============================
  {
    label: 'Business Suite',
    isSection: true
  },

  // CRM & Sales
  {
    label: 'CRM & Sales',
    icon: 'tabler-users',
    children: [
      {
        label: 'Dashboard',
        href: '/apps/crm/dashboard',
        icon: 'tabler-layout-dashboard'
      },
      {
        label: 'Customers',
        href: '/apps/crm/customers',
        icon: 'tabler-users'
      },
      {
        label: 'Leads',
        href: '/apps/crm/leads',
        icon: 'tabler-target-arrow'
      },
      {
        label: 'Deals',
        href: '/apps/crm/deals',
        icon: 'tabler-hand-finger'
      },
      {
        label: 'Quotes',
        href: '/apps/crm/quotes',
        icon: 'tabler-file-invoice'
      },
      {
        label: 'Activities',
        href: '/apps/crm/activities',
        icon: 'tabler-activity'
      }
    ]
  },

  // Finance & Accounting
  {
    label: 'Finance & Accounting',
    icon: 'tabler-calculator',
    children: [
      // Finance
      {
        label: 'Finance Dashboard',
        href: '/apps/finance/dashboard',
        icon: 'tabler-layout-dashboard'
      },
      {
        label: 'Cash Flow',
        href: '/apps/finance/cash-flow',
        icon: 'tabler-cash-banknote'
      },
      {
        label: 'Income',
        href: '/apps/finance/income',
        icon: 'tabler-trending-up'
      },
      {
        label: 'Expenses',
        href: '/apps/finance/expenses',
        icon: 'tabler-trending-down'
      },
      // Accounting
      {
        label: 'Chart of Accounts',
        href: '/apps/accounting/chart-of-accounts',
        icon: 'tabler-list-details'
      },
      {
        label: 'Journal Entries',
        href: '/apps/accounting/journal-entries',
        icon: 'tabler-notebook'
      },
      {
        label: 'General Ledger',
        href: '/apps/accounting/general-ledger',
        icon: 'tabler-book'
      },
      {
        label: 'Trial Balance',
        href: '/apps/accounting/trial-balance',
        icon: 'tabler-scale'
      }
    ]
  },

  // Inventory & Operations
  {
    label: 'Inventory & Operations',
    icon: 'tabler-package',
    children: [
      {
        label: 'Products',
        href: '/apps/inventory/products',
        icon: 'tabler-box'
      },
      {
        label: 'Categories',
        href: '/apps/inventory/categories',
        icon: 'tabler-category'
      },
      {
        label: 'Stock Management',
        href: '/apps/inventory/stock',
        icon: 'tabler-packages'
      },
      {
        label: 'Purchase Orders',
        href: '/apps/inventory/purchase-orders',
        icon: 'tabler-shopping-cart'
      },
      {
        label: 'Suppliers',
        href: '/apps/inventory/suppliers',
        icon: 'tabler-truck'
      }
    ]
  },

  // HR & Payroll
  {
    label: 'HR & Payroll',
    icon: 'tabler-users',
    children: [
      {
        label: 'Employees',
        href: '/apps/hr/employees',
        icon: 'tabler-users'
      },
      {
        label: 'Attendance',
        href: '/apps/hr/attendance',
        icon: 'tabler-clock'
      },
      {
        label: 'Leave Management',
        href: '/apps/hr/leave',
        icon: 'tabler-calendar'
      },
      {
        label: 'Payroll',
        href: '/apps/hr/payroll',
        icon: 'tabler-cash-banknote'
      },
      {
        label: 'Payslips',
        href: '/apps/hr/payslips',
        icon: 'tabler-file-invoice'
      }
    ]
  },

  // Support
  {
    label: 'Support',
    icon: 'tabler-headset',
    children: [
      {
        label: 'Tickets',
        href: '/apps/support/tickets',
        icon: 'tabler-ticket'
      },
      {
        label: 'Knowledge Base',
        href: '/apps/support/knowledge-base',
        icon: 'tabler-book'
      },
      {
        label: 'FAQs',
        href: '/apps/support/faqs',
        icon: 'tabler-help'
      }
    ]
  },

  // ============================
  // APPS
  // ============================
  {
    label: 'Apps',
    isSection: true
  },

  // Communication
  {
    label: 'Communication',
    icon: 'tabler-message',
    children: [
      {
        label: 'Email',
        href: '/apps/email',
        icon: 'tabler-mail'
      },
      {
        label: 'Chat',
        href: '/apps/chat',
        icon: 'tabler-message-circle'
      },
      {
        label: 'Calendar',
        href: '/apps/calendar',
        icon: 'tabler-calendar'
      }
    ]
  },

  // E-commerce
  {
    label: 'E-commerce',
    icon: 'tabler-shopping-cart',
    children: [
      {
        label: 'Dashboard',
        href: '/apps/ecommerce/dashboard',
        icon: 'tabler-layout-dashboard'
      },
      {
        label: 'Products',
        icon: 'tabler-box',
        children: [
          { 
            label: 'List', 
            href: '/apps/ecommerce/products/list' 
          },
          { 
            label: 'Add', 
            href: '/apps/ecommerce/products/add' 
          },
          { 
            label: 'Categories', 
            href: '/apps/ecommerce/products/categories' 
          }
        ]
      },
      {
        label: 'Orders',
        icon: 'tabler-shopping-bag',
        children: [
          { 
            label: 'List', 
            href: '/apps/ecommerce/orders/list' 
          },
          { 
            label: 'Details', 
            href: '/apps/ecommerce/orders/details/5434',
            exactMatch: false,
            activeUrl: '/apps/ecommerce/orders/details'
          }
        ]
      },
      {
        label: 'Customers',
        icon: 'tabler-users',
        children: [
          { 
            label: 'List', 
            href: '/apps/ecommerce/customers/list' 
          },
          { 
            label: 'Details', 
            href: '/apps/ecommerce/customers/details/879861',
            exactMatch: false,
            activeUrl: '/apps/ecommerce/customers/details'
          }
        ]
      },
      {
        label: 'Marketing',
        icon: 'tabler-bulb',
        children: [
          {
            label: 'Campaigns',
            href: '/apps/ecommerce/marketing/campaigns'
          },
          {
            label: 'Discounts',
            href: '/apps/ecommerce/marketing/discounts'
          },
          {
            label: 'Reviews',
            href: '/apps/ecommerce/marketing/reviews'
          }
        ]
      }
    ]
  },

  // POS System
  {
    label: 'POS System',
    icon: 'tabler-cash-register',
    children: [
      {
        label: 'Point of Sale',
        href: '/apps/pos/checkout',
        icon: 'tabler-shopping-cart'
      },
      {
        label: 'Orders',
        href: '/apps/pos/orders',
        icon: 'tabler-list-check'
      },
      {
        label: 'Products',
        href: '/apps/pos/products',
        icon: 'tabler-box'
      },
      {
        label: 'Customers',
        href: '/apps/pos/customers',
        icon: 'tabler-users'
      },
      {
        label: 'Reports',
        href: '/apps/pos/reports',
        icon: 'tabler-chart-bar'
      },
      {
        label: 'Settings',
        href: '/apps/pos/settings',
        icon: 'tabler-settings'
      }
    ]
  },

  // ============================
  // SETTINGS & ADMIN
  // ============================
  {
    label: 'Settings',
    isSection: true
  },

  // User & Team Management
  {
    label: 'User Management',
    icon: 'tabler-users',
    children: [
      {
        label: 'Users',
        href: '/apps/settings/team/users',
        icon: 'tabler-user'
      },
      {
        label: 'Roles & Permissions',
        href: '/apps/settings/team/roles',
        icon: 'tabler-shield-lock'
      },
      {
        label: 'Departments',
        href: '/apps/settings/team/departments',
        icon: 'tabler-building-community'
      }
    ]
  },

  // System Settings
  {
    label: 'System Settings',
    icon: 'tabler-settings',
    children: [
      // Payment Gateways
      {
        label: 'Payment Gateways',
        href: '/apps/settings/payment-gateways',
        icon: 'tabler-credit-card'
      },
      // Email Settings
      {
        label: 'Email Configuration',
        href: '/apps/settings/email',
        icon: 'tabler-mail'
      },
      // Integration Settings
      {
        label: 'Integrations',
        href: '/apps/settings/integrations',
        icon: 'tabler-plug-connected'
      },
      // Backup & Restore
      {
        label: 'Backup & Restore',
        href: '/apps/settings/backup',
        icon: 'tabler-database-export'
      }
    ]
  },

  // AI & Automation
  {
    label: 'AI & Automation',
    icon: 'tabler-bolt',
    children: [
      {
        label: 'AI Assistants',
        href: '/apps/settings/ai/assistants',
        icon: 'tabler-robot'
      },
      {
        label: 'Workflow Automation',
        href: '/apps/settings/automation/workflows',
        icon: 'tabler-sitemap'
      },
      {
        label: 'API Access',
        href: '/apps/settings/developers/api-keys',
        icon: 'tabler-key'
      }
    ]
  }
];

export default verticalMenuData;
