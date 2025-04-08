import { TextField } from '@mui/material'
import React from 'react'
import CurrencyFormat from 'react-currency-format'

const CustomeCurrencyDisplay = ({
  disabled = false,
  variant = 'standard',
  value = 0,
  prefix = '',
  thousandSeparator = ' ',
  decimalSeparator = '.',
  suffix = '',
  decimalScale = 3,
  allowNegative = false,
  name = '',
  label = '',
  type = 'text',
  onChange = () => {}
}) => {
  return (
    <div>
      <CurrencyFormat
        value={value}
        displayType={type}
        thousandSeparator={thousandSeparator}
        suffix={' €'}
        decimalSeparator={decimalSeparator} // Keep this as a fallback
        decimalScale={3}
        allowNegative={allowNegative}
        style={{ width: 200, padding: 10 }}
      />
    </div>
  )
}

export default CustomeCurrencyDisplay
