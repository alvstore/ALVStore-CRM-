// Stock Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function StockPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Stock
        </Typography>
        <Typography variant="body1">
          This is the  stock page.
        </Typography>
      </CardContent>
    </Card>
  );
}
