import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Box } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

export default function CustomeAutoCompleteSelect({
  data,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  option,
  displayOption,
  label = '',
  withIcon = false,
  custome,
  variant = 'outlined',
  marginProps,
  backgroundColorLi,
  getOptionDisabled = null,
  colorProps=""
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
    <div className={`${marginProps ? '' : ''}`}>
      <Autocomplete
        size='small'
        fullWidth
        disabled={disabled}
        value={data?.find(item => item[option] === value) || null}
        onChange={changeAutoComplete}
        options={data || []}
        noOptionsText='Aucun data'
        getOptionLabel={option => option[displayOption] || ''}
        renderOption={(props, option) => (
          <li style={{ color: option?.color }} {...props}>
            <div
              style={{
                width: '.5rem',
                height: '.55rem',
                backgroundColor: option?.color,
                borderRadius: '50%',
                marginRight: '1rem'
              }}
            ></div>
            {renderOption(option)}
          </li>
        )}
        renderInput={params => (
          <TextField
            label={label}
            {...params}
            helperText={helperText}
            error={error}
            variant={variant}
            InputProps={{
              ...params.InputProps,
              style: { color:colorProps , borderColor:colorProps  } // Change text color and border color
            }}
            InputLabelProps={{
              style: { color:colorProps  } // Change label color tcolorPropso(optional)
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor:colorProps  // Border color
                },
                '&:hover fieldset': {
                  borderColor:colorProps  // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor:colorProps  // Border color when focused
                }
              },
              '& .MuiSvgIcon-root': {
                color:colorProps  // Change color of the dropdown icon
              }
            }}
          />
        )}
        getOptionDisabled={getOptionDisabled}
      />
    </div>
  )
}
