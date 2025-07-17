'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// Icons
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'

// Types
interface ChartOfAccount {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  category: string
  description?: string
  parentId?: string
  isActive: boolean
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

interface ChartOfAccountsFilters {
  search: string
  status: 'all' | 'active' | 'inactive'
  type: 'all' | 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  category: string
}

// Mock data - replace with API calls
const mockChartOfAccounts: ChartOfAccount[] = [
  {
    id: '1',
    code: '1000',
    name: 'Cash and Cash Equivalents',
    type: 'asset',
    category: 'Current Assets',
    description: 'Cash and cash equivalents',
    parentId: undefined,
    isActive: true,
    balance: 50000,
    currency: 'USD',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    code: '1100',
    name: 'Accounts Receivable',
    type: 'asset',
    category: 'Current Assets',
    description: 'Amounts owed by customers',
    parentId: undefined,
    isActive: true,
    balance: 25000,
    currency: 'USD',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '3',
    code: '1200',
    name: 'Inventory',
    type: 'asset',
    category: 'Current Assets',
    description: 'Goods available for sale',
    parentId: undefined,
    isActive: true,
    balance: 75000,
    currency: 'USD',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '4',
    code: '2000',
    name: 'Accounts Payable',
    type: 'liability',
    category: 'Current Liabilities',
    description: 'Amounts owed to suppliers',
    parentId: undefined,
    isActive: true,
    balance: 30000,
    currency: 'USD',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '5',
    code: '3000',
    name: 'Common Stock',
    type: 'equity',
    category: 'Equity',
    description: 'Common stock at par value',
    parentId: undefined,
    isActive: true,
    balance: 100000,
    currency: 'USD',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '6',
    code: '4000',
    name: 'Sales Revenue',
    type: 'revenue',
    category: 'Operating Revenue',
    description: 'Revenue from product sales',
    parentId: undefined,
    isActive: true,
    balance: 200000,
    currency: 'USD',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '7',
    code: '5000',
    name: 'Cost of Goods Sold',
    type: 'expense',
    category: 'Cost of Sales',
    description: 'Direct costs of producing goods',
    parentId: undefined,
    isActive: true,
    balance: 120000,
    currency: 'USD',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
]

// Column definition
interface ColumnDef<TData> {
  accessorKey: keyof TData | string
  header: string
}

// Helper functions
const getAccountTypeColor = (type: string) => {
  const colors: Record<string, 'primary' | 'error' | 'success' | 'info' | 'warning' | 'default'> = {
    'asset': 'primary',
    'liability': 'error',
    'equity': 'success',
    'revenue': 'info',
    'expense': 'warning'
  }
  return colors[type] || 'default'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

// Table columns
const ChartOfAccountsTable = ({ 
  data, 
  onEdit, 
  onDelete 
}: { 
  data: ChartOfAccount[]; 
  onEdit: (account: ChartOfAccount) => void; 
  onDelete: (account: ChartOfAccount) => void;
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, account: ChartOfAccount) => {
    setSelectedAccount(account);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    if (selectedAccount) {
      onEdit(selectedAccount);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedAccount) {
      onDelete(selectedAccount);
    }
    handleMenuClose();
  };

  return (
    <div className="overflow-x-auto">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.code}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    color={getAccountTypeColor(account.type) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{formatCurrency(account.balance)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, account)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

const ChartOfAccountsPage = () => {
  // States
  const router = useRouter()
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>(mockChartOfAccounts)
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ChartOfAccountsFilters>({
    search: '',
    status: 'all',
    type: 'all',
    category: 'all',
  })

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  // Handlers
  const handleAddAccount = (newAccount: ChartOfAccount) => {
    const newAccountWithId = { 
      ...newAccount, 
      id: Date.now().toString(),
      isActive: true,
      balance: 0,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setChartOfAccounts([...chartOfAccounts, newAccountWithId])
    setIsAddDialogOpen(false)
  }

  const handleUpdateAccount = (updatedAccount: ChartOfAccount) => {
    setChartOfAccounts(chartOfAccounts.map(account => 
      account.id === updatedAccount.id 
        ? { ...updatedAccount, updatedAt: new Date().toISOString() } 
        : account
    ))
    setIsEditDialogOpen(false)
    setSelectedAccount(null)
  }

  const handleDeleteAccount = (account: ChartOfAccount) => {
    setChartOfAccounts(chartOfAccounts.filter(a => a.id !== account.id))
    setIsDeleteDialogOpen(false)
    setSelectedAccount(null)
  }

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return chartOfAccounts.filter((account: ChartOfAccount) => {
      const matchesSearch = !filters.search ||
        account.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.code.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = filters.status === 'all' ||
        (filters.status === 'active' && account.isActive) ||
        (filters.status === 'inactive' && !account.isActive)

      const matchesType = filters.type === 'all' || account.type === filters.type
      const matchesCategory = filters.category === 'all' || account.category === filters.category

      return matchesSearch && matchesStatus && matchesType && matchesCategory
    })
  }, [chartOfAccounts, filters])

  // Dialog state aliases for consistency
  const addDialogOpen = isAddDialogOpen
  const editDialogOpen = isEditDialogOpen
  const deleteDialogOpen = isDeleteDialogOpen
  const setAddDialogOpen = setIsAddDialogOpen
  const setEditDialogOpen = setIsEditDialogOpen
  const setDeleteDialogOpen = setIsDeleteDialogOpen

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant="h5" component="h1">
            Chart of Accounts
          </Typography>
          <Typography variant="body2">Manage your chart of accounts</Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Account
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <TextField
              fullWidth
              size="small"
              placeholder="Search accounts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="asset">Asset</MenuItem>
                <MenuItem value="liability">Liability</MenuItem>
                <MenuItem value="equity">Equity</MenuItem>
                <MenuItem value="revenue">Revenue</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Code
                </th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Name
                </th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Type
                </th>
                <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Balance
                </th>
                <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  style={{
                    borderBottom: '1px solid #f5f5f5',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <td style={{ padding: '12px' }}>{account.code}</td>
                  <td style={{ padding: '12px' }}>{account.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        backgroundColor:
                          account.type === 'asset'
                            ? 'primary'
                            : account.type === 'liability'
                            ? 'error'
                            : account.type === 'equity'
                            ? 'success'
                            : account.type === 'revenue'
                            ? 'info'
                            : account.type === 'expense'
                            ? 'warning'
                            : 'default',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(account.balance)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccount(account);
                        setEditDialogOpen(true);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Account Code"
              margin="normal"
              size="small"
            />
            <TextField
              fullWidth
              label="Account Name"
              margin="normal"
              size="small"
            />
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Account Type</InputLabel>
              <Select label="Account Type">
                <MenuItem value="asset">Asset</MenuItem>
                <MenuItem value="liability">Liability</MenuItem>
                <MenuItem value="equity">Equity</MenuItem>
                <MenuItem value="revenue">Revenue</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Handle add account
              setAddDialogOpen(false);
            }}
          >
            Add Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Account</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Account Code"
                margin="normal"
                size="small"
                defaultValue={selectedAccount.code}
              />
              <TextField
                fullWidth
                label="Account Name"
                margin="normal"
                size="small"
                defaultValue={selectedAccount.name}
              />
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Account Type</InputLabel>
                <Select
                  label="Account Type"
                  defaultValue={selectedAccount.type}
                >
                  <MenuItem value="asset">Asset</MenuItem>
                  <MenuItem value="liability">Liability</MenuItem>
                  <MenuItem value="equity">Equity</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                margin="normal"
                multiline
                rows={3}
                size="small"
                defaultValue={selectedAccount.description || ''}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Handle update account
              setEditDialogOpen(false);
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs">
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (selectedAccount) {
                handleDeleteAccount(selectedAccount);
              }
              setDeleteDialogOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChartOfAccountsPage;