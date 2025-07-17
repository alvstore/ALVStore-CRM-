// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const horizontalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): HorizontalMenuDataType[] => [

  // POS System
  {
    label: 'POS System',
    icon: 'tabler-shopping-cart',
    children: [
      {
        label: 'Dashboard',
        href: '/apps/pos/dashboard',
        icon: 'tabler-layout-dashboard'
      },
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
  // Dashboards
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
  // Accounting
  {
    label: 'Accounting',
    icon: 'tabler-calculator',
    children: [
      {
        label: 'Dashboard',
        href: '/apps/accounting/dashboard',
        icon: 'tabler-layout-dashboard'
      },
      {
        label: 'Invoices',
        href: '/apps/accounting/invoices',
        icon: 'tabler-file-invoice'
      },
      {
        label: 'Expenses',
        href: '/apps/accounting/expenses',
        icon: 'tabler-cash-banknote'
      },
      {
        label: 'Reports',
        href: '/apps/accounting/reports',
        icon: 'tabler-report'
      }
    ]
  },
  // CRM
  {
    label: 'CRM',
    icon: 'tabler-users',
    children: [
      {
        label: 'Contacts',
        href: '/apps/crm/contacts',
        icon: 'tabler-address-book'
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
      }
    ]
  },
  // Inventory
  {
    label: 'Inventory',
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
        label: 'Stock',
        href: '/apps/inventory/stock',
        icon: 'tabler-packages'
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
        label: 'Payroll',
        href: '/apps/hr/payroll',
        icon: 'tabler-cash-banknote'
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
      }
    ]
  },
  // Accounting App
  {
    label: 'Accounting',
    icon: 'tabler-calculator',
    children: [
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
  // E-commerce App
  {
    label: 'E-commerce',
    icon: 'tabler-shopping-cart',
    children: [
      {
        label: 'Dashboard',
        href: '/apps/ecommerce/dashboard'
      },
      {
        label: 'Products',
        children: [
          { label: 'List', href: '/apps/ecommerce/products/list' },
          { label: 'Add', href: '/apps/ecommerce/products/add' },
          { label: 'Category', href: '/apps/ecommerce/products/category' }
        ]
      },
      {
        label: 'Orders',
        children: [
          { label: 'List', href: '/apps/ecommerce/orders/list' },
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
        children: [
          { label: 'List', href: '/apps/ecommerce/customers/list' },
          { 
            label: 'Details', 
            href: '/apps/ecommerce/customers/details/879861',
            exactMatch: false,
            activeUrl: '/apps/ecommerce/customers/details'
          }
        ]
      },
      {
        label: 'Manage Reviews',
        href: '/apps/ecommerce/manage-reviews'
      },
      {
        label: 'Referrals',
        href: '/apps/ecommerce/referrals'
      },
      {
        label: 'Settings',
        href: '/apps/ecommerce/settings'
      }
    ]
  },
  // Email
  {
    label: 'Email',
    icon: 'tabler-mail',
    href: '/apps/email'
  },
  // Chats
  {
    label: 'Chats',
    icon: 'tabler-message-circle',
    href: '/apps/chat'
  },
  // Calendar
  {
    label: 'Calendar',
    icon: 'tabler-calendar',
    href: '/apps/calendar'
  },
  // Finance Section
  {
    label: 'Finance',
    icon: 'tabler-cash',
    children: [
      {
        label: 'Invoice',
        icon: 'tabler-file-text',
        href: '/apps/invoice/list'
      }
    ]
  },
  // User Management
  {
    label: 'User',
    icon: 'tabler-users',
    href: '/apps/user/list'
  },
  // Settings Section
  {
    label: 'Settings',
    icon: 'tabler-settings',
    children: [
      {
        label: 'Roles & Permissions',
        icon: 'tabler-shield-lock',
        href: '/apps/roles'
      }
    ]
  }
];

export default horizontalMenuData;
