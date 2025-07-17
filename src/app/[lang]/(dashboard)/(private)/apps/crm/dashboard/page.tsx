// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant='h4'>CRM Dashboard</Typography>
        <Typography>Overview of your CRM activities and metrics</Typography>
      </div>
      
      <Grid container spacing={6}>
        {/* Stats Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent className='flex flex-col gap-2'>
              <Typography color='text.secondary'>Total Leads</Typography>
              <Typography variant='h4'>0</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent className='flex flex-col gap-2'>
              <Typography color='text.secondary'>Active Customers</Typography>
              <Typography variant='h4'>0</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <div className='flex flex-col gap-4'>
                <div>
                  <Typography variant='h5'>Recent Activities</Typography>
                  <Typography>Track and manage your recent CRM activities</Typography>
                </div>
                <Typography color='text.secondary'>No recent activities</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default DashboardPage
