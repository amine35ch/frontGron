// ** React Imports

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import moment from 'moment/moment'
import { forwardRef, useState } from 'react'
import CustomInputs from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTheme } from '@mui/material/styles'
import IconifyIcon from 'src/@core/components/icon'

const CustomDatePicker = ({
  backendFormat,
  disabled,
  dateFormat,
  dateValue,
  setDate,
  error,
  helperText,
  CustomeInputProps = {},
  minDate,
  maxDate,
  placeholder = ''
}) => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  return (
    <DatePickerWrapper>
      <DatePicker
        locale={'fr'}
        placeholderText={placeholder}
        disabled={disabled}
        id='basic-input'
        dateFormat={dateFormat}
        popperPlacement={popperPlacement}
        customInput={<CustomInputs {...CustomeInputProps} error={error} helperText={helperText} />}
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

export default CustomDatePicker
