import React, { useState, useRef, useEffect } from 'react'

const VerificationInputs = ({ setCode, test }) => {
  const [inputs, setInputs] = useState([null, null, null, null, null, null])
  const [inputsTw, setInputsTw] = useState(null)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0].focus()
  }, [])

  const handleInputChange = (index, event) => {
    const value = event.target.value
    const newInputs = [...inputs]
    newInputs[index] = value

    setInputsTw(newInputs)
    setInputs(newInputs)
    if (value !== '') {
      if (index < inputs.length - 1) {
        inputRefs.current[index + 1].focus()
      }

      const sixcham = newInputs.join('')
      setInputsTw(sixcham)

      // setCode(sixcham)
    } else {
      if (index > 0) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  return (
    <div className='flex justify-between'>
      {inputs.map((value, index) => (
        <input
          key={index}
          ref={ref => (inputRefs.current[index] = ref)}
          type='text'
          value={value}
          maxLength={1}
          onChange={e => handleInputChange(index, e)}
          style={{
            width: '50px',
            height: '55px',
            marginRight: '5px',
            backgroundColor: '#f0e6d05e',
            border: '1px solid #f0e6d0',
            borderRadius: '15px',
            textAlign: 'center'
          }}
          disabled={index > 0 && inputs[index - 1] === ''}
        />
      ))}
    </div>
  )
}

export default VerificationInputs
