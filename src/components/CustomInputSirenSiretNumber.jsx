import * as React from 'react'
import PropTypes from 'prop-types'
import { IMaskInput } from 'react-imask'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask='000 000 000 00000'
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={value => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default function CustomInputSirenSiretNumber(props) {
  const { value, setNumber, ...rest } = props

  return (
    <Stack direction='row' spacing={2}>
      <FormControl fullWidth variant='outlined'>
        <TextField
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
