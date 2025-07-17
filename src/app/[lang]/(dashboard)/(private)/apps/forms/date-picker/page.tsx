'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import DatePicker from '@/components/forms/DatePicker'

const DatePickerDemo = () => {
  // States
  const [basicDate, setBasicDate] = useState<Date | null>(null)
  const [withTime, setWithTime] = useState<Date | null>(null)
  const [rangeDate, setRangeDate] = useState<{
    startDate: Date | null
    endDate: Date | null
  }>({
    startDate: null,
    endDate: null
  })
  const [monthYear, setMonthYear] = useState<Date | null>(null)
  const [yearOnly, setYearOnly] = useState<Date | null>(null)
  const [disabled, setDisabled] = useState<Date | null>(null)
  const [readOnly, setReadOnly] = useState<Date | null>(null)
  const [minMax, setMinMax] = useState<Date | null>(null)
  const [custom, setCustom] = useState<Date | null>(null)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Basic Date Picker' />
          <CardContent>
            <DatePicker
              label='Basic Date Picker'
              value={basicDate}
              onChange={setBasicDate}
              placeholder='Select date'
              helperText='Select any date'
            />
            <div className='mt-4'>
              <Typography variant='body2'>Selected: {basicDate?.toString() || 'No date selected'}</Typography>
              <Button variant='outlined' onClick={() => setBasicDate(null)} className='mt-2'>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='With Time' />
          <CardContent>
            <DatePicker
              label='With Time'
              value={withTime}
              onChange={setWithTime}
              showTimeSelect
              dateFormat='MM/dd/yyyy hh:mm aa'
              placeholder='Select date and time'
              helperText='Select date and time'
            />
            <div className='mt-4'>
              <Typography variant='body2'>Selected: {withTime?.toString() || 'No date selected'}</Typography>
              <Button variant='outlined' onClick={() => setWithTime(null)} className='mt-2'>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Date Range' />
          <CardContent>
            <DatePicker
              label='Date Range'
              selectsRange
              startDate={rangeDate.startDate}
              endDate={rangeDate.endDate}
              onChange={update => {
                if (Array.isArray(update)) {
                  const [start, end] = update
                  setRangeDate({ startDate: start, endDate: end })
                }
              }}
              placeholderText='Select date range'
              helperText='Select a date range'
            />
            <div className='mt-4'>
              <Typography variant='body2'>
                Selected: {rangeDate.startDate?.toDateString() || 'Start date'} to{' '}
                {rangeDate.endDate?.toDateString() || 'End date'}
              </Typography>
              <Button
                variant='outlined'
                onClick={() => setRangeDate({ startDate: null, endDate: null })}
                className='mt-2'
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Month & Year Picker' />
          <CardContent>
            <DatePicker
              label='Month & Year'
              value={monthYear}
              onChange={setMonthYear}
              showMonthYearPicker
              dateFormat='MM/yyyy'
              placeholder='Select month and year'
              helperText='Select month and year'
              className='mb-4'
            />
            <DatePicker
              label='Year Only'
              value={yearOnly}
              onChange={setYearOnly}
              showYearPicker
              dateFormat='yyyy'
              placeholder='Select year'
              helperText='Select year only'
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Disabled & Readonly' />
          <CardContent>
            <DatePicker
              label='Disabled'
              value={disabled}
              onChange={setDisabled}
              disabled
              helperText='This date picker is disabled'
              className='mb-4'
            />
            <DatePicker
              label='Read Only'
              value={readOnly}
              onChange={setReadOnly}
              readOnly
              helperText='This date picker is read only'
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Min & Max Dates' />
          <CardContent>
            <DatePicker
              label='Select Date'
              value={minMax}
              onChange={setMinMax}
              minDate={new Date()}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              helperText='Only dates within the next year are selectable'
            />
            <div className='mt-4'>
              <Typography variant='body2'>
                Selected: {minMax?.toDateString() || 'No date selected'}
              </Typography>
              <Button variant='outlined' onClick={() => setMinMax(null)} className='mt-2'>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Custom Date Format' />
          <CardContent>
            <DatePicker
              label='Custom Format (dd/MM/yyyy)'
              value={custom}
              onChange={setCustom}
              inputFormat='dd/MM/yyyy'
              placeholder='DD/MM/YYYY'
              helperText='Date format: DD/MM/YYYY'
            />
            <div className='mt-4'>
              <Typography variant='body2'>Selected: {custom?.toDateString() || 'No date selected'}</Typography>
              <Button variant='outlined' onClick={() => setCustom(null)} className='mt-2'>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DatePickerDemo
