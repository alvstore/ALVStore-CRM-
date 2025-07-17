// Products Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function ProductsPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1">
          This is the  products page.
        </Typography>
      </CardContent>
    </Card>
  );
}
