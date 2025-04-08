import React, { useState } from 'react'
import TextField from '@mui/material/TextField'

const InputTva = ({ onChange, value }) => {
  // const [value, setValue] = useState('')

  // Fonction de traitement du changement de valeur
  const handleChange = event => {
    let newValue = event.target.value

    // Remplace les virgules par des points pour uniformiser le format des nombres décimaux
    newValue = newValue.replace(/,/g, '.')

    // Utilise une regex pour n'accepter que les chiffres et une virgule
    if (/^\d*\.?\d*$/.test(newValue) || newValue === '') {
      // Convertit la chaîne en nombre et vérifie si elle est inférieure ou égale à 99.99
      const floatValue = parseFloat(newValue)
      if (floatValue <= 99.99 || newValue === '') {
        // Met à jour l'état si la valeur est valide
        onChange(newValue)
      }
    }
  }

  return (
    <TextField
      variant='standard'
      value={value}
      onChange={handleChange}
      InputProps={{
        inputProps: {
          inputMode: 'numeric',
          pattern: '[0-9]*[,.]?[0-9]*' // Permet les chiffres, la virgule et le point
        }
      }}
    />
  )
}

export default InputTva
