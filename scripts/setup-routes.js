const fs = require('fs');
const path = require('path');

const basePath = './src/app/[lang]/(dashboard)/(private)/apps';

const routes = [
  // Accounting
  'accounting/dashboard',
  'accounting/invoices',
  'accounting/expenses',
  'accounting/reports',
  
  // CRM
  'crm/contacts',
  'crm/leads',
  'crm/deals',
  
  // Inventory
  'inventory/products',
  'inventory/categories',
  'inventory/stock',
  
  // HR & Payroll
  'hr/employees',
  'hr/attendance',
  'hr/payroll',
  
  // Support
  'support/tickets',
  'support/knowledge-base'
];

// Create route directories and page files
routes.forEach(route => {
  const fullPath = path.join(basePath, route, 'page.tsx');
  const dirPath = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
  
  // Create page file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    const componentName = route.split('/').pop().replace(/\b\w/g, l => l.toUpperCase()).replace(/-/g, '');
    const content = `// ${componentName} Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function ${componentName}Page() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          ${componentName.replace(/([A-Z])/g, ' $1').trim()}
        </Typography>
        <Typography variant="body1">
          This is the ${componentName.replace(/([A-Z])/g, ' $1').toLowerCase()} page.
        </Typography>
      </CardContent>
    </Card>
  );
}
`;
    fs.writeFileSync(fullPath, content);
    console.log(`Created file: ${fullPath}`);
  }
});

console.log('Route setup completed!');
