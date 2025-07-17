import { ReactNode } from 'react';
import { Typography } from '@mui/material';

type Props = {
  children: ReactNode;
};

const CRMLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2">
        <Typography variant="h4">Customer Relationship Management</Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your customer relationships and interactions
        </Typography>
      </div>
      {children}
    </div>
  );
};

export default CRMLayout;
