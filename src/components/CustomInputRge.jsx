import * as React from 'react'
import PropTypes from 'prop-types'
import { IMaskInput } from 'react-imask'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, maskNumber, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={`AB00 0000 0000 0000 0000 0000 000`}
      definitions={{
        A: 'F',
        B: 'R',
        '#': /[0-9]/
      }}
      inputRef={ref}
      onAccept={value => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  maskNumber: PropTypes.string.isRequired
}

export default function CustomInputRge(props) {
  const { value, setNumber, ...rest } = props

  return (
    <Stack direction='row' spacing={2}>
      <FormControl fullWidth variant='outlined'>
        <TextField
          placeholder='0000000-000'
          className='!mt-1'
          size='small'
          value={value}
          onChange={e => setNumber(e.target.value)}
          name='numberformat'
          id='formatted-numberformat-input'
          InputProps={{
            inputComponent: TextMaskCustom
          }}
          variant='outlined'
          {...rest}
        />
      </FormControl>
    </Stack>
  )
}
