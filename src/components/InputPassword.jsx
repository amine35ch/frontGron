// ** React Imports
import React, { useState } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const InputPassword = ({ value, handleChange, disabled, error, helperText }) => {
  const [showValues, setShowValues] = useState(false)

  const handleTogglePasswordView = () => {
    setShowValues(!showValues)
  }

  const handleMousePasswordView = event => {
    event.preventDefault()
  }

  return (
    <TextField
      fullWidth
      size='small'
      variant='outlined'
      className='w-full !mt-1'
      type={showValues ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              edge='end'
              onClick={handleTogglePasswordView}
              aria-label='toggle password visibility'
              onMouseDown={handleMousePasswordView}
            >
              <Icon fontSize='19px' icon={showValues ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
            </IconButton>
          </InputAdornment>
        )
      }}
      error={error}
      helperText={helperText}
      disabled={disabled}
      value={value}
      onChange={handleChange}
    />
  )
}

export default InputPassword
