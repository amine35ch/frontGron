import { useCallback, useState } from 'react'
import { Dialog, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

import TabsValidationAnah from 'src/components/Tabs'
import { useSetAnahResponse } from 'src/services/project.service'
import { LoadingButton } from '@mui/lab'
import CommentForm from './CommentForm'
import SuspendProjectDialog from './SuspendProjectDialog'

const options = [
  { value: 1, label: 'Réponse favorable', color: '#64C623', icon: <IconifyIcon icon={'ep:check'} /> },
  { value: 3, label: 'Demande de modification', color: '#FFB031', icon: <IconifyIcon icon={'ep:edit-pen'} /> },
  { value: 2, label: 'Demande Refusée', color: '#FF4D49', icon: <IconifyIcon icon={'ep:circle-close'} /> }
]

const StepAnahResponse = ({ id, detailsProject }) => {
  const [selectedChoice, setSelectedChoice] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [showValidationTabs, setShowValidationTabs] = useState(false)
  const [hideSelect, setHideSelect] = useState(false)

  const projectState = detailsProject?.response_anah?.state

  const { mutate, isPending } = useSetAnahResponse({ id })

  const onAccept = value => {
    if (value == 2) {
      setOpenModal(true)

      return
    }

    mutate({ anah_first_depot_response_state: value })
  }

  if (hideSelect) return null

  return (
    <Grid container className='!mt-3' spacing={2}>
      {projectState === 1 || projectState === 3 ? (
        <TabsValidationAnah
          detailsProject={detailsProject}
          selectedValue={projectState}
          options={options.filter(item => item.value === projectState)}
        />
      ) : (
        <>
          <Stack direction='row' spacing={3} alignItems='center' width='100%'>
            <Typography
              className='!font-semibold'
              sx={{
                fontSize: '15px',
                color: '#FF4D49',
                whiteSpace: 'nowrap',
                padding: '5px 10px',
                background: '#FF4D491A',
                marginBottom: '15px'
              }}
            >
              * Veuillez noter que cette action est irréversible une fois la sélection effectuée.
            </Typography>
          </Stack>
          <Stack direction='row' spacing={3} alignItems='center' width='100%'>
            <Typography
              className='!font-semibold'
              sx={{
                fontSize: '15px',
                color: '#2a2e34',
                whiteSpace: 'nowrap',
                paddingLeft: '10px'
              }}
            >
              Merci de choisir la réponse envoyée par l’Anah :
            </Typography>
            <FormControl
              color='secondary'
              sx={{
                flex: 1,
                backgroundColor: '#85A0370A',
                border: '1px solid #85A037',
                borderRadius: '4px',
                padding: '3px'
              }}
            >
              <RadioGroup
                value={selectedChoice}
                onChange={e => {
                  const value = e.target.value
                  setSelectedChoice(value)
                  onAccept(value)
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  gap: '10px'
                }}
              >
                {options.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: '#86A039'
                          }
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: selectedChoice === option.value ? '#86A039' : '#2a2e34',
                          fontWeight: selectedChoice === option.value ? 'bold' : 'normal',
                          fontSize: '14px',
                          '&:hover': {
                            color: '#86A039'
                          }
                        }}
                      >
                        {option.label}
                      </Typography>
                    }
                    sx={{
                      margin: '0',
                      padding: '3px',
                      borderRadius: '4px',
                      backgroundColor: selectedChoice === option.value ? '#F0F9E7' : 'transparent',
                      border: selectedChoice === option.value ? '1px solid #86A039' : 'none',
                      '&:hover': {
                        backgroundColor: '#DAE2C3'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Stack>
        </>
      )}
      <SuspendProjectDialog
        id={id}
        open={openModal}
        selectedChoice={selectedChoice}
        handleClose={() => setOpenModal(false)}
        setHideSelect={setHideSelect}
      />
    </Grid>
  )
}

export default StepAnahResponse
