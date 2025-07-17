'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import QuoteForm from '../components/QuoteForm';

type AddQuotePageProps = {
  params: {
    lang: string;
  };
};

const AddQuotePage = ({ params }: AddQuotePageProps) => {
  const router = useRouter();
  const { lang } = params;

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement API call to create quote
      console.log('Creating quote:', data);
      // Redirect to quotes list after successful creation
      router.push(`/${lang}/apps/crm/quotes`);
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  return (
    <Box className="space-y-6 p-4 lg:p-6">
      <Box className="flex items-center justify-between mb-6">
        <Box className="flex items-center gap-4">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Typography variant="h4">Create New Quote</Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <QuoteForm 
            onSubmit={handleSubmit} 
            onCancel={() => router.push(`/${lang}/apps/crm/quotes`)}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddQuotePage;
