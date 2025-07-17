// Categories Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function CategoriesPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Categories
        </Typography>
        <Typography variant="body1">
          This is the  categories page.
        </Typography>
      </CardContent>
    </Card>
  );
}
