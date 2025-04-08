import React, { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useAuth } from 'src/hooks/useAuth'

const InputNumberWithComma = ({ value, onChange, decimalScale = false }) => {
  const { user } = useAuth()
  const [first, setfirst] = useState(1)

  const handleInp = (value, name, values) => {
    setfirst(values.value)

    onChange(values.value)
  }
  

  return (
    <div>
      <CurrencyInput
        id='input-example'
        name='input-name'
        value={value}
        decimalsLimit={decimalScale !== false ? decimalScale : user.company.decimals}
        style={{
          border: 'none',
          outline: 'none',
          color: '#4c4e64de',
          textAlign: 'center',
          backgroundColor: 'transparent'
        }}
        onValueChange={(value, name, values) => handleInp(value, name, values)}
      />
    </div>
  )
}

export default InputNumberWithComma
