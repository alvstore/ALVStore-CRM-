// Deals Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function DealsPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Deals
        </Typography>
        <Typography variant="body1">
          This is the  deals page.
        </Typography>
      </CardContent>
    </Card>
  );
}
