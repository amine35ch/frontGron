// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker, { registerLocale } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTheme } from '@mui/material/styles'
import moment from 'moment'
import { createPortal } from 'react-dom'

const CustomComponentDateRangeNoWrapper = ({ startDate, setStartDate, endDate, setEndDate, fixedPosition = false }) => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** States

  const handleOnChangeRange = dates => {
    const [start, end] = dates

    setStartDate(moment(start).format('YYYY-MM-DD'))
    if (end !== null) {
      setEndDate(moment(end).format('YYYY-MM-DD'))
    } else {
      setEndDate(null)
    }
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start !== null ? format(props.start, 'dd/MM/yyyy') : null
    const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : null
    const value = startDate && endDate ? `${startDate}${endDate !== null ? endDate : ''}` : ''

    return (
      <TextField
        inputRef={ref}
        label={props.label || ''}
        sx={{ backgroundColor: 'white' }}
        size='small'
        {...props}
        value={value}
      />
    )
  })

  return (
    <DatePickerWrapper>
      <DatePicker
        locale={'fr'}
        selectsRange
        monthsShown={2}
        endDate={endDate == null ? null : new Date(moment(endDate, 'YYYY-MM-DD'))}
        selected={startDate == null ? null : new Date(moment(startDate, 'YYYY-MM-DD'))}
        startDate={startDate == null ? null : new Date(moment(startDate, 'YYYY-MM-DD'))}
        shouldCloseOnSelect={false}
        id='date-range-picker-months'
        onChange={handleOnChangeRange}
        popperPlacement={popperPlacement}
        popperClassName={fixedPosition ? 'fixed-position' : ''}
        customInput={
          <CustomInput
            end={endDate == null ? null : new Date(moment(endDate, 'YYYY-MM-DD'))}
            start={startDate == null ? null : new Date(moment(startDate, 'YYYY-MM-DD'))}
          />
        }
      />
    </DatePickerWrapper>
  )
}

export default CustomComponentDateRangeNoWrapper
