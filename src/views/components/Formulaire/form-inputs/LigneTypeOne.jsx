import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'

const LigneTypeOne = ({
  blocIndex,
  ligne,
  ligneIndex,
  handleChange,
  formErrors,
  setFormErrors,
  mainFieldIndex = false,
  subLigneIndex = false
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', marginLeft: 18 }}>
        {ligne?.content?.data?.question && `${ligne?.content?.data?.question}`}
      </span>
      <FormControl style={{ marginLeft: 30 }}>
        {ligne?.content?.data?.fields?.map((field, fieldIndex) => {
          return (
            <div key={`${field?.id}-${ligne?.id}`}>
              <RadioGroup key={`${field?.id}-${ligne?.id}`} name={ligne?.content?.data?.question}>
                <FormControlLabel
                  onChange={event => {
                    if (mainFieldIndex !== false) {
                      handleChange(event, blocIndex, ligneIndex, mainFieldIndex, subLigneIndex, fieldIndex)
                    } else {
                      handleChange(event, blocIndex, ligneIndex, fieldIndex, subLigneIndex)
                    }
                  }}
                  checked={field?.value === 1 ? true : false}
                  control={
                    <Radio
                      onInvalid={event => {
                        event?.preventDefault()

                        // inputError[ligneIndex] = ;
                        setFormErrors(prev => {
                          return { ...prev, [ligne?.id]: 'Champ requis' }
                        })
                      }}
                    />
                  }
                  label={field?.title}
                />
                <FormHelperText
                  sx={{
                    color: '#f44336'
                  }}
                  hidden={!formErrors[ligne?.id]}
                >
                  {'Champ requis'}
                </FormHelperText>
              </RadioGroup>
            </div>
          )
        })}
      </FormControl>
    </div>
  )
}

export default LigneTypeOne
