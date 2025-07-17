// Invoices Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function InvoicesPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Invoices
        </Typography>
        <Typography variant="body1">
          This is the  invoices page.
        </Typography>
      </CardContent>
    </Card>
  );
}
