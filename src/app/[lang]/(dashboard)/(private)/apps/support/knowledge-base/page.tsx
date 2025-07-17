// KnowledgeBase Page Component
'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function KnowledgeBasePage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Knowledge Base
        </Typography>
        <Typography variant="body1">
          This is the  knowledge base page.
        </Typography>
      </CardContent>
    </Card>
  );
}
