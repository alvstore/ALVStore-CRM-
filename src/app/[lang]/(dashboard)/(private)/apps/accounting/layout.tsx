import { ReactNode } from 'react';
import { Typography } from '@mui/material';

type Props = {
  children: ReactNode;
};

const AccountingLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2">
        <Typography variant="h4">Accounting</Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your financial records and transactions
        </Typography>
      </div>
      {children}
    </div>
  );
};

export default AccountingLayout;
