import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'
import Title from './Title'
import SubTitle from './SubTitle'
import LigneTypeOne from './LigneTypeOne'
import LigneTypeFour from './LigneTypeFour'
import LigneTypeSix from './LigneTypeSix'
import LigneTypeThree from './LigneTypeThree'

const LigneTypeNine = ({ blocIndex, ligne, ligneIndex, handleChange, formErrors, setFormErrors, disabled = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', marginLeft: 18, fontSize:'14px' }}>
        {ligne?.content?.data?.question && `${ligne?.content?.data?.question}`}
      </span>
      <FormControl style={{ marginLeft: 30 }}>
        {ligne?.content?.data?.fields?.map((field, fieldIndex) => {
          return (
            <div key={`${field?.id}-${ligne?.id}`}>
              <RadioGroup key={`${field?.id}-${ligne?.id}`} name={ligne?.content?.data?.question}>
                <FormControlLabel
                  onChange={event => {
                    handleChange(event, blocIndex, ligneIndex, fieldIndex)
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
                {field?.value === 1 &&
                  field?.ajout?.map((subLigne, subLigneIndex) => (
                    <div key={subLigneIndex?.id}>
                      {returnInput(
                        subLigne?.type,
                        blocIndex,
                        {
                          content: {
                            data: subLigne
                          }
                        },
                        ligneIndex,
                        handleChange,
                        formErrors,
                        setFormErrors,
                        subLigneIndex,
                        fieldIndex
                      )}
                    </div>
                  ))}
              </RadioGroup>
            </div>
          )
        })}
      </FormControl>
    </div>
  )
}

export default LigneTypeNine

const returnInput = (
  type,
  blocIndex,
  ligne,
  ligneIndex,
  handleChange,
  formErrors,
  setFormErrors,
  subLigneIndex,
  mainFieldIndex
) => {
  switch (type) {
    case 1:
      return (
        <LigneTypeOne
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          subLigneIndex={subLigneIndex}
          mainFieldIndex={mainFieldIndex}
        />
      )

    case 4:
      return (
        <LigneTypeFour
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          subLigneIndex={subLigneIndex}
          mainFieldIndex={mainFieldIndex}
        />
      )
    case 6:
      return (
        <LigneTypeSix
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          subLigneIndex={subLigneIndex}
          mainFieldIndex={mainFieldIndex}
        />
      )
    case 3:
      return (
        <LigneTypeThree
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          subLigneIndex={subLigneIndex}
          mainFieldIndex={mainFieldIndex}
        />
      )

    case 5:
      return <Title blocIndex={blocIndex} ligne={ligne} ligneIndex={ligneIndex} />
    case 10:
      return <SubTitle blocIndex={blocIndex} ligne={ligne} ligneIndex={ligneIndex} />

    default:
      break
  }
}
