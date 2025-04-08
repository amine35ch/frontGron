import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Box } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

export default function CustomeAutoCompleteSelectChip({
  data,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  option,
  displayOption,
  label = '',
  withIcon = false
}) {
  const changeAutoComplete = (event, value) => {
    value ? onChange(value[option]) : onChange('')
  }

  const renderOption = option => {
    if (withIcon) {
      return (
        <Box display={'flex'}>
          <IconifyIcon icon={`${option?.icon}`} className='!text-2xl' />
          <span className='!ml-2'>{option[displayOption]}</span>
        </Box>
      )
    }

    return <div>{option[displayOption]}</div>
  }

  return (
    <div className='mt-1'>
      <Autocomplete
        size='small'
        fullWidth
        disabled={disabled}
        value={data?.find(item => item[option] === value) || null}
        onChange={changeAutoComplete}
        options={data || []}
        noOptionsText='Aucun data'
        getOptionLabel={option => option[displayOption] || ''}
        renderOption={(props, option) => <li {...props}>{renderOption(option)}</li>}
        renderInput={params => (
          <TextField label={label} {...params} helperText={helperText} variant='standard' error={error} />
        )}
      />
    </div>
  )
}
