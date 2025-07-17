// Expenses Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function ExpensesPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Expenses
        </Typography>
        <Typography variant="body1">
          This is the  expenses page.
        </Typography>
      </CardContent>
    </Card>
  );
}
