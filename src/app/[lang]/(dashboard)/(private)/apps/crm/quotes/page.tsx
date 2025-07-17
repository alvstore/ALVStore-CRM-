// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Link from 'next/link'

type QuotesPageProps = {
  params: {
    lang: string;
  };
};

const QuotesPage = ({ params: { lang } }: QuotesPageProps) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col sm:flex-row justify-between gap-4'>
          <div>
            <Typography variant='h4'>Quotes</Typography>
            <Typography>Create and manage your quotes</Typography>
          </div>
          <Button 
            component={Link}
            href={`/${lang}/apps/crm/quotes/add`}
            variant='contained'
            className='gap-2'
            startIcon={<i className='ri-add-line' />}
          >
            Add Quote
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <Typography variant='h5'>Quotes List</Typography>
            <Typography color='text.secondary'>No quotes found</Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuotesPage
