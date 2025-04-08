import * as React from 'react'

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'

export default function CustomDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DateTimePicker', 'DateRangePicker']}>
        <DemoItem label='DatePicker'>
          <DatePicker views={['year', 'month', 'day']} />
        </DemoItem>
        <DemoItem label='DateTimePicker'>
          <DateTimePicker
            defaultValue={today}
            minDate={tomorrow}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  )
}
