import * as React from 'react'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useEffect } from 'react'

export default function CustomeAutoCompleteSelectMultiple({
  data,
  onChange,
  value,
  error,
  helperText,
  optionLabel,
  disabled,
  uniqueOption = 'id'
}) {
  const [filteredOptions, setFilteredOptions] = React.useState([])

  const handleChange = newValue => {
    // Mettez à jour l'ensemble des ID sélectionnés

    onChange(newValue.map(option => option[uniqueOption]))
  }
  useEffect(() => {
    if (value) {
      setFilteredOptions(data ? data.filter(option => value.includes(option[uniqueOption])) : [])
    }
  }, [value, data, uniqueOption])

  return (
    <Autocomplete
      multiple
      limitTags={2}
      size='small'
      fullWidth
      options={data ? data : []}
      disableCloseOnSelect
      error={error}
      disabled={disabled}
      className='!p-0'
      helperText={'helperText'}
      noOptionsText='Aucun data'
      getOptionLabel={option => option[optionLabel]}
      value={filteredOptions} // Utilisez les options filtrées comme valeur initiale
      onChange={(e, newValue) => handleChange(newValue)}
      renderOption={(props, option, { selected }) => (
        <li className='!p-1' sx={{ fontSize: '13px !important' }} {...props}>
          <Checkbox style={{ marginRight: 2 }} checked={selected} />
          {option.entitled ? option.entitled : option[optionLabel]}
        </li>
      )}
      renderInput={params => (
        <TextField
          className='!p-0 '
          sx={{ fontSize: '13px !important' }}
          {...params}
          error={error}
          variant='outlined'
          name='user'
          fullWidth
          size='small'
          helperText={helperText}
        />
      )}
    />
  )
}
