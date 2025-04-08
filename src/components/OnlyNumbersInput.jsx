import { TextField } from '@mui/material'

const OnlyNumbersInput = ({ value, onChange, min, max, ...rest }) => {
  const handleChange = event => {
    const value = event.target.value
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      if ((min && Number(value) < min) || (max && Number(value) > max)) {
        return
      }
      onChange(event)
    }
  }

  return <TextField {...rest} value={value} onChange={handleChange} />
}

export default OnlyNumbersInput
