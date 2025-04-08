import { OutlinedInput, TextField, styled } from '@mui/material'
import React, { forwardRef, useRef } from 'react'
import CurrencyFormat from 'react-currency-format'
import { useAuth } from 'src/hooks/useAuth'

export const CustomInput = styled(TextField)(({ theme }) => ({
  // remove the underline
  '& .MuiInputBase-root': {
    '& input': {
      textAlign: 'center',
      border: 'none',
      outline: 'none'
    }
  },
  '& .MuiInput-underline:before': {
    borderBottom: 'none',
    border: 'none',
    outline: 'none'
  },

  // remove focus underline
  '& .MuiInput-underline:after': {
    border: 'none',
    outline: 'none'
  },

  // remove hover underline
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    border: 'none',
    outline: 'none'
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    border: 'none',
    outline: 'none'
  },

  // remove the outline border
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
      outline: 'none'
    },
    '&:hover fieldset': {
      border: 'none',
      outline: 'none'
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      outline: 'none'
    }
  }
}))

const CustomCurrencyInput = forwardRef(
  ({
    disabled = false,
    variant = 'standard',
    value = 0,
    prefix = '',
    thousandSeparator = ' ',
    decimalSeparator = ',',
    suffix = ' €',
    decimalScale = false,
    allowNegative = false,
    name = '',
    label = '0,00 ' + suffix,
    onChange = () => {},
    displayType = 'input',
    custom,
    helperText,
    error,
    placeholder = '0,00 ' + suffix,
    style = {},
    displayOnly = false,
    onBeforeInput = () => {}
  }) => {
    const { user } = useAuth()
    const inputRef = useRef(null)

    return (
      <div>
        <CurrencyFormat
          displayOnly={displayOnly}
          style={style}
          placeholder={placeholder}
          displayType={displayType}
          size={'small'}
          disabled={disabled}
          variant={variant}
          label={''}
          value={value || ''}
          onBeforeInput={onBeforeInput}
          onValueChange={event => {
            const localEvent = {
              floatValue: event.floatValue,
              value: event.value
            }
            if (isNaN(event.floatValue)) {
              localEvent.floatValue = ''
              localEvent.value = ''
            }
            onChange(localEvent)
          }}
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          allowNegative={allowNegative}
          decimalScale={decimalScale !== false ? decimalScale : user.company.decimals}
          fixedDecimalScale={true}
          prefix={prefix}
          suffix={suffix}
          customInput={custom ? CustomInput : TextField}
          fullWidth
          helperText={helperText} // Passer la propriété helperText
          error={error}
        />
      </div>
    )
  }
)

export default CustomCurrencyInput
