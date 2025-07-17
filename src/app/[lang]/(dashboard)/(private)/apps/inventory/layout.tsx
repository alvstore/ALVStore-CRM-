import { ReactNode } from 'react';
import { Typography } from '@mui/material';

type Props = {
  children: ReactNode;
};

const InventoryLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2">
        <Typography variant="h4">Inventory Management</Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your product inventory
        </Typography>
      </div>
      {children}
    </div>
  );
};

export default InventoryLayout;
