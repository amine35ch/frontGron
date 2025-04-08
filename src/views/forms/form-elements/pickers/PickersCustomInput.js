// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly, error,helperText } = props

  return (
    <>
    <TextField
      inputRef={ref}
      {...props}
      fullWidth
      size='small'
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
      error={error}
      helperText={helperText}
    />
    
    </>
  )
})

export default PickersComponent
