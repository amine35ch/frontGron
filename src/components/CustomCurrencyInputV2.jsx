import { useTheme } from '@emotion/react'
import React, { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useAuth } from 'src/hooks/useAuth'

const CustomCurrencyInputV2 = ({ value, onChange, decimalScale = false, custome = false }) => {
  const { user } = useAuth()
  const theme = useTheme()

  const handleInp = (value, name, values) => {
    onChange(values.value)
  }

  return (
    <div>
      <CurrencyInput
        id='input-example'
        name='input-name'
        value={value}
        decimalsLimit={decimalScale !== false ? decimalScale : user.company.decimals}
        suffix={`  €`}
        style={{
          border: custome ? '1px solid #4c4e6438' : 'none',

          // outline: 'none',
          color: '#4c4e64de',
          textAlign: custome ? 'left' : 'center',
          padding: custome ? '8.5px 14px' : '0',
          width: custome ? '99%' : '',
          borderRadius: custome ? '6px' : '0',
          outline: custome ? theme.palette.primary.main : 'none',
          backgroundColor: 'transparent'
        }}
        onValueChange={(value, name, values) => handleInp(value, name, values)}
      />
    </div>
  )
}

export default CustomCurrencyInputV2
