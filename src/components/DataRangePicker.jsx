// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'
import { dateFormater } from 'src/@core/utils/utilities'
import moment from 'moment/moment'

const DataRangePicker = ({ dateRange, setDateRange, backendFormat, ...rest }) => {
  const startDate = dateRange?.startDate ? new Date(moment(dateRange.startDate, backendFormat)) : null
  const endDate = dateRange?.endDate ? new Date(moment(dateRange.endDate, backendFormat)) : null

  return (
    <DatePicker
      locale={'fr'}
      selectsRange
      slotProps={{ textField: { size: 'small' } }}
      endDate={endDate}
      selected={startDate}
      startDate={startDate}
      id='date-range-picker'
      onChange={dates => {
        const [start, end] = dates
        setDateRange({
          startDate: start ? moment(start).format(backendFormat) : null,
          endDate: end ? moment(end).format(backendFormat) : null
        })
      }}
      shouldCloseOnSelect={false}
      customInput={
        dateRange?.endDate ? (
          <CustomInput fullWidth size='small' label='Selectionner date' start={startDate} end={endDate} />
        ) : (
          <CustomInput fullWidth size='small' label='Selectionner date' />
        )
      }
    />
  )
}

const CustomInput = forwardRef((props, ref) => {
  const { start, end, label, ...rest } = props
  const startDate = start ? dateFormater(start) : ''
  const endDate = end ? dateFormater(end) : null
  const value = endDate ? `du ${startDate} au ${endDate !== null ? endDate : ''}` : ''

  // mui remove border from input
  return (
    <TextField
      inputRef={ref}
      {...rest}
      value={value}
      variant='standard'
      InputProps={{
        disableUnderline: true
      }}
    />
  )
})

export default DataRangePicker
