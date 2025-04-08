import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'

const PostiveIntegerInput = forwardRef((props, ref) => {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask='000'
      type='tel'
      definitions={{
        '#': /[1-9]/,
        0: /\d/
      }}
      onAccept={value => onChange({ target: { name: props.name, value } })}
      inputRef={ref}
      overwrite
    />
  )
})

export default PostiveIntegerInput
