import { Checkbox, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField } from '@mui/material'

const LigneTypeThree = ({
  blocIndex,
  ligne,
  ligneIndex,
  handleChange,
  formErrors,
  setFormErrors,
  subLigneIndex = false,
  mainFieldIndex = false,
  disabled = false
}) => {


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', marginLeft: 18, marginTop: 10, fontSize:'14px' , marginBottom:0}}>
        {ligne?.content?.data?.question && `${ligne?.content?.data?.question}`}
      </span>
      <FormControl style={{ marginLeft: 20, marginBottom: 10, marginTop: 2 }}>
        {ligne?.content?.data?.fields?.map((field, fieldIndex) => {
          return (
            <div key={field?.id}>
              <TextField
                InputProps={{
                  readOnly: disabled
                }}
                type={field?.format !== 'date' ? field?.format : 'text'}
                onInvalid={event => {
                  event?.preventDefault()

                  // inputError[ligneIndex] = ;
                  setFormErrors(prev => {
                    return { ...prev, [ligne?.id]: 'Champ requis' }
                  })
                }}
                error={!!formErrors[ligne?.id]}
                helperText={formErrors[ligne?.id]}
                onChange={event => {
                  if (mainFieldIndex !== false) {
                    handleChange(event, blocIndex, ligneIndex, mainFieldIndex, subLigneIndex, fieldIndex)
                  } else {
                    handleChange(event, blocIndex, ligneIndex, fieldIndex, subLigneIndex)
                  }

                  // handleChange(event, blocIndex, ligneIndex, fieldIndex, subFieldIndex);
                }}
                style={{
                  width: '100%'
                }}
                size='small'
                label={field?.title}
                defaultValue={field?.value}
                value={field?.value}
              />
            </div>
          )
        })}
      </FormControl>
    </div>
  )
}

export default LigneTypeThree
