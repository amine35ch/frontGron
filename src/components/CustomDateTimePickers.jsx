import React from 'react'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'

// ** MUI Imports
import Box from '@mui/material/Box'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports

import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import moment from 'moment'

const CustomDateTimePickers = ({
  backendFormat,
  disabled,
  dateFormat,
  dateValue,
  setDate,
  error,
  helperText,
  CustomeInputProps = {},
  minDate,
  maxDate
}) => {
  const theme = useTheme()
  const [time, setTime] = useState(new Date())
  const [dateTime, setDateTime] = useState(new Date())

  return (
    <DatePickerWrapper>
      <DatePicker
        locale={'fr'}
        showTimeSelect
        timeFormat='HH:mm'
        timeCaption='Heure'
        timeIntervals={15}
        customInput={<CustomInput {...CustomeInputProps} error={error} helperText={helperText} />}
        disabled={disabled}
        id='date-time-picker'
        dateFormat={dateFormat}
        selected={dateValue == null ? null : new Date(moment(dateValue, backendFormat))}
        onChange={date => {
          setDate(moment(date).format(backendFormat))
        }}
        minDate={minDate ? new Date() : null}
        maxDate={maxDate ? new Date() : null}
      />
    </DatePickerWrapper>
  )
}

export default CustomDateTimePickers
