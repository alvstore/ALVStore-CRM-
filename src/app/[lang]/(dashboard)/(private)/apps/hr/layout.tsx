'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HRLayoutParams = {
  lang: string;
};

type Props = {
  children: ReactNode;
  params: Promise<HRLayoutParams>;
};

const HRLayout = ({ children, params }: Props) => {
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop() || 'employees';
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState('en'); // Default language

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        setLang(resolvedParams.lang);
        setMounted(true);
      } catch (error) {
        console.error('Error loading params:', error);
        setMounted(true); // Still render the component even if params fail
      }
    };

    loadParams();
  }, [params]);

  // Show loading state while params are being loaded
  if (!mounted) {
    return (
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <div className="flex flex-col gap-2">
          <Typography variant="h4">Loading HR Dashboard...</Typography>
        </div>
      </div>
    );
  }
  
  const tabs = [
    { value: 'employees', label: 'Employees' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'leave-requests', label: 'Leave' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'payslips', label: 'Payslips' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2">
        <Typography variant="h4">Human Resources</Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your workforce and payroll
        </Typography>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentPath} 
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map(tab => (
            <Tab 
              key={tab.value} 
              value={tab.value} 
              label={tab.label}
              component={Link}
              href={`/${lang}/apps/hr/${tab.value}`}
              sx={{
                minHeight: '48px',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: '600',
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      <Box>
        {children}
      </Box>
    </div>
  );
};

export default HRLayout;
