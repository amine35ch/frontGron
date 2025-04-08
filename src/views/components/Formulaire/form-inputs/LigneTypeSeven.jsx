import { Button, Divider, FormControl, Input, InputLabel, TextField } from '@mui/material'

const LigneTypeSeven = ({
  blocIndex,
  ligne,
  ligneIndex,
  handleChange,
  formErrors,
  setFormErrors,
  calulateInputSeven,
  subFieldIndex = false,
  disabled = false
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', marginLeft: 18 }}>
        {ligne?.content?.data?.question && ` ${ligne?.content?.data?.question}`}
      </span>
      <FormControl style={{ marginLeft: 30, marginBottom: 10 }}>
        {ligne?.content?.data?.fields?.map((field, fieldIndex) => {
          return (
            <div key={field?.id}>
              <FormControl fullWidth sx={{ mt: 2, display: 'flex' }}>
                <InputLabel htmlFor={`${field?.id}-${ligne?.id}`} shrink>
                  {field?.title}
                </InputLabel>
                <div className='!flex gap-20'>
                  <TextField
                    onInvalid={event => {
                      event?.preventDefault()

                      // inputError[ligneIndex] = ;
                      setFormErrors(prev => {
                        return { ...prev, [ligne?.id]: 'Champ requis' }
                      })
                    }}
                    size='small'
                    id={`${field?.id} - ${ligne?.id}`}
                    value={field?.value}
                  />

                  <Button
                    disabled={disabled}
                    className='!text-white'
                    sx={{ backgroundColor: 'red  !important' }}
                    onClick={() => calulateInputSeven(blocIndex, ligneIndex, fieldIndex, field)}
                  >
                    Calculer
                  </Button>
                </div>
              </FormControl>
            </div>
          )
        })}
        <Divider
          style={{
            marginBottom: 20,
            marginTop: 10
          }}
        />
      </FormControl>
    </div>
  )
}

export default LigneTypeSeven
