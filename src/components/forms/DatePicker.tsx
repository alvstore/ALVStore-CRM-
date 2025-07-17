'use client'

// React Imports
import { forwardRef, useState } from 'react'
import { format } from 'date-fns'

// MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import DatePickerComponent from 'react-datepicker'
import type { ReactDatePickerProps } from 'react-datepicker'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Types
type DatePickerProps = {
  label?: string
  helperText?: string
  error?: boolean
  fullWidth?: boolean
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  value?: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  showTimeSelect?: boolean
  dateFormat?: string
  showMonthYearPicker?: boolean
  showYearPicker?: boolean
  selectsRange?: boolean
  startDate?: Date | null
  endDate?: Date | null
  customInput?: React.ReactNode
  popperPlacement?: 'top' | 'bottom' | 'auto'
  popperClassName?: string
  className?: string
  boxProps?: any
  inputFormat?: string
  disableFuture?: boolean
  disablePast?: boolean
  shouldCloseOnSelect?: boolean
  showDisabledMonthNavigation?: boolean
}

// Custom input component to handle MUI TextField integration
const CustomInput = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { value, onClick, placeholder, error, helperText, label, fullWidth, required, disabled, readOnly, ...rest } = props

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      value={value}
      onClick={onClick}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      inputRef={ref}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position='end'>
            <i className='tabler-calendar' />
          </InputAdornment>
        )
      }}
      {...rest}
    />
  )
})

CustomInput.displayName = 'CustomInput'

const DatePicker = (props: DatePickerProps) => {
  // Props
  const {
    label,
    helperText,
    error,
    fullWidth = true,
    required,
    disabled,
    readOnly,
    placeholder = 'Select date',
    value,
    onChange,
    minDate,
    maxDate,
    showTimeSelect = false,
    dateFormat = showTimeSelect ? 'MM/dd/yyyy hh:mm aa' : 'MM/dd/yyyy',
    showMonthYearPicker = false,
    showYearPicker = false,
    selectsRange = false,
    startDate,
    endDate,
    customInput,
    popperPlacement = 'bottom',
    popperClassName,
    className,
    boxProps,
    inputFormat = 'MM/dd/yyyy',
    disableFuture = false,
    disablePast = false,
    shouldCloseOnSelect = true,
    showDisabledMonthNavigation = false
  } = props

  // States
  const [open, setOpen] = useState(false)

  // Handle date change
  const handleChange = (date: Date | null) => {
    onChange(date)
    if (shouldCloseOnSelect) {
      setOpen(false)
    }
  }

  // Format display value
  const formatDisplayValue = (date: Date | null) => {
    if (!date) return ''
    return format(date, inputFormat)
  }

  return (
    <AppReactDatepicker
      selected={value}
      onChange={handleChange}
      minDate={minDate || (disablePast ? new Date() : undefined)}
      maxDate={maxDate || (disableFuture ? new Date() : undefined)}
      showTimeSelect={showTimeSelect}
      dateFormat={dateFormat}
      showMonthYearPicker={showMonthYearPicker}
      showYearPicker={showYearPicker}
      selectsRange={selectsRange}
      startDate={startDate}
      endDate={endDate}
      open={open}
      onCalendarOpen={() => !readOnly && setOpen(true)}
      onCalendarClose={() => setOpen(false)}
      popperPlacement={popperPlacement}
      popperClassName={popperClassName}
      className={className}
      boxProps={boxProps}
      showDisabledMonthNavigation={showDisabledMonthNavigation}
      customInput={
        customInput || (
          <CustomInput
            label={label}
            value={formatDisplayValue(value as Date | null)}
            placeholder={placeholder}
            onClick={() => !disabled && !readOnly && setOpen(true)}
            error={error}
            helperText={helperText}
            fullWidth={fullWidth}
            required={required}
            disabled={disabled || readOnly}
          />
        )
      }
    />
  )
}

export default DatePicker
