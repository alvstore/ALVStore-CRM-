// Contacts Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function ContactsPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Contacts
        </Typography>
        <Typography variant="body1">
          This is the  contacts page.
        </Typography>
      </CardContent>
    </Card>
  );
}
