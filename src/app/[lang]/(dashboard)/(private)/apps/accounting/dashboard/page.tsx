'use client';

// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button, { buttonClasses } from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

// Third-party Imports
import classNames from 'classnames';

// Type Imports
import type { CardStatsVerticalProps } from '@/types/pages/widgetTypes';

// Components Imports
import CardStatVertical from '@/components/card-statistics/Vertical';

// Data
const stats: CardStatsVerticalProps[] = [
  {
    title: 'Total Revenue',
    stats: '$25,840',
    avatarIcon: 'tabler-currency-dollar',
    avatarColor: 'primary',
    chipText: '15%',
    chipColor: 'success',
    chipVariant: 'filled',
    subtitle: 'vs last month',
    avatarSize: 44,
    avatarSkin: 'light'
  },
  {
    title: 'Total Expenses',
    stats: '$12,450',
    avatarIcon: 'tabler-credit-card',
    avatarColor: 'error',
    chipText: '8%',
    chipColor: 'error',
    chipVariant: 'filled',
    subtitle: 'vs last month',
    avatarSize: 44,
    avatarSkin: 'light'
  },
  {
    title: 'Net Profit',
    stats: '$13,390',
    avatarIcon: 'tabler-chart-bar',
    avatarColor: 'success',
    chipText: '12%',
    chipColor: 'success',
    chipVariant: 'filled',
    subtitle: 'vs last month',
    avatarSize: 44,
    avatarSkin: 'light'
  },
  {
    title: 'Invoices',
    stats: '1,524',
    avatarIcon: 'tabler-file-invoice',
    avatarColor: 'info',
    chipText: '5%',
    chipColor: 'error',
    chipVariant: 'filled',
    subtitle: 'vs last month',
    avatarSize: 44,
    avatarSkin: 'light'
  }
];

// Types
type Transaction = {
  id: number;
  type: 'Income' | 'Expense';
  amount: string;
  description: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  avatarColor: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';
  avatarIcon: string;
};

// Recent Transactions Data
const transactions: Transaction[] = [
  {
    id: 1,
    type: 'Income',
    amount: '$1,250',
    description: 'Web Design Project',
    date: '2023-06-15',
    status: 'Completed',
    avatarColor: 'success',
    avatarIcon: 'tabler-arrow-down-left'
  },
  {
    id: 2,
    type: 'Expense',
    amount: '$560',
    description: 'Office Supplies',
    date: '2023-06-14',
    status: 'Completed',
    avatarColor: 'error',
    avatarIcon: 'tabler-arrow-up-right'
  },
  {
    id: 3,
    type: 'Income',
    amount: '$3,400',
    description: 'Mobile App Development',
    date: '2023-06-12',
    status: 'Pending',
    avatarColor: 'warning',
    avatarIcon: 'tabler-arrow-down-left'
  },
  {
    id: 4,
    type: 'Expense',
    amount: '$1,200',
    description: 'Monthly Rent',
    date: '2023-06-10',
    status: 'Completed',
    avatarColor: 'error',
    avatarIcon: 'tabler-arrow-up-right'
  },
  {
    id: 5,
    type: 'Income',
    amount: '$2,500',
    description: 'Consulting Services',
    date: '2023-06-08',
    status: 'Completed',
    avatarColor: 'success',
    avatarIcon: 'tabler-arrow-down-left'
  }
];

// Types
type QuickAction = {
  id: number;
  title: string;
  icon: string;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  link: string;
};

// Quick Actions Data
const quickActions: QuickAction[] = [
  { id: 1, title: 'New Invoice', icon: 'tabler-file-invoice', color: 'primary', link: '/apps/invoice/add' },
  { id: 2, title: 'Record Expense', icon: 'tabler-receipt', color: 'error', link: '/apps/expenses/add' },
  { id: 3, title: 'Receive Payment', icon: 'tabler-wallet', color: 'success', link: '/apps/payments/receive' },
  { id: 4, title: 'Add Vendor', icon: 'tabler-building-store', color: 'info', link: '/apps/vendors/add' }
];

const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <Typography variant='h4' component='h1'>
          Accounting Dashboard
        </Typography>
        <Typography color='text.disabled'>Overview of your financial performance and key metrics</Typography>
      </div>

      {/* Stats Cards */}
      <Grid container spacing={6}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <CardStatVertical
              title={item.title}
              stats={item.stats}
              avatarIcon={item.avatarIcon}
              avatarColor={item.avatarColor}
              chipText={item.chipText}
              chipColor={item.chipColor}
              chipVariant={item.chipVariant}
              subtitle={item.subtitle}
            />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <Typography variant='h5'>Quick Actions</Typography>
            <i className='tabler-zap text-[22px] text-textSecondary' />
          </div>
          <Grid container spacing={4} className='mt-2'>
            {quickActions.map(action => (
              <Grid item xs={6} sm={3} key={action.id}>
                <Button
                  fullWidth
                  variant='outlined'
                  color={action.color}
                  startIcon={<i className={classNames(action.icon, 'text-xl')} />}
                  className='h-24 flex-col gap-2'
                  href={action.link}
                  component='a'
                  sx={{
                    [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem'
                    }
                  }}
                >
                  {action.title}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <Typography variant='h5'>Revenue Overview</Typography>
                <i className='tabler-chart-bar text-[22px] text-textSecondary' />
              </div>
              <div className='h-[300px] flex items-center justify-center bg-actionHover rounded'>
                <Typography color='text.disabled'>Revenue Chart Placeholder</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <Typography variant='h5'>Expense Breakdown</Typography>
                <i className='tabler-chart-pie text-[22px] text-textSecondary' />
              </div>
              <div className='h-[300px] flex items-center justify-center bg-actionHover rounded'>
                <Typography color='text.disabled'>Expense Chart Placeholder</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <Typography variant='h5'>Recent Transactions</Typography>
            <i className='tabler-clock text-[22px] text-textSecondary' />
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(transaction => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant='rounded' color={transaction.avatarColor} className='is-[38px] bs-[38px]'>
                          <i className={classNames(transaction.avatarIcon, 'text-xl')} />
                        </Avatar>
                        <div>
                          <Typography variant='body2' color='text.primary' className='font-medium'>
                            {transaction.description}
                          </Typography>
                          <Typography variant='caption'>{transaction.type}</Typography>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography
                        variant='body2'
                        color={transaction.type === 'Income' ? 'success.main' : 'error.main'}
                        className='font-medium'
                      >
                        {transaction.type === 'Income' ? '+' : '-'} {transaction.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{new Date(transaction.date).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        color={transaction.status === 'Completed' ? 'success' : 'warning'}
                        variant='filled'
                        size='small'
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton size='small'>
                        <i className='tabler-chevron-right text-xl' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
