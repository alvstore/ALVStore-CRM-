import { Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <Typography variant="h1" className="text-9xl font-bold text-primary">
        404
      </Typography>
      <Typography variant="h4" className="mt-4 mb-2">
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        The page you are looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Button 
        component={Link} 
        href="/dashboards/crm" 
        variant="contained"
      >
        Back to Home
      </Button>
    </div>
  );
}
