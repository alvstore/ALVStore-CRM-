import { ReactNode } from 'react';
import { Typography } from '@mui/material';

type Props = {
  children: ReactNode;
};

const SupportLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2">
        <Typography variant="h4">Support Center</Typography>
        <Typography variant="body1" color="text.secondary">
          Get help and support for any issues
        </Typography>
      </div>
      {children}
    </div>
  );
};

export default SupportLayout;
