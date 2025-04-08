import * as React from 'react'
import { IMaskInput } from 'react-imask'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'

const CustomInputCurrentcount = React.forwardRef(function TextMaskCustomCount(props, ref) {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask='0000000'
      definitions={{
        '#': /[0-9]/
      }}
      inputRef={ref}
      onAccept={value => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

CustomInputCurrentcount.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default CustomInputCurrentcount
