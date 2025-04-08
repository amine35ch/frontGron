// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTheme } from '@mui/material/styles'
import moment from 'moment'

const CustomComponentDateRange = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** States

  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(new Date())

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)

    setStartDate(moment(start).format('DD-MM-YYYY'))
    if (end !== null) {
      setEndDate(moment(end).format('DD-MM-YYYY'))
    } else {
      setEndDate(null)
    }
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = format(props.start, 'dd/MM/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

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
        endDate={endDateRange}
        selected={startDateRange}
        startDate={startDateRange}
        shouldCloseOnSelect={false}
        id='date-range-picker-months'
        onChange={handleOnChangeRange}
        popperPlacement={popperPlacement}
        customInput={<CustomInput end={endDateRange} start={startDateRange} />}
      />{' '}
    </DatePickerWrapper>
  )
}

export default CustomComponentDateRange
