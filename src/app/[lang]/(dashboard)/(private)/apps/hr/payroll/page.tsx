// Payroll Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function PayrollPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Payroll
        </Typography>
        <Typography variant="body1">
          This is the  payroll page.
        </Typography>
      </CardContent>
    </Card>
  );
}
