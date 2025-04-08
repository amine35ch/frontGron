import { LoadingButton } from '@mui/lab'
import { Grid, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import CustomDatePicker from 'src/components/CustomDatePicker'
import { useAddProjectEventMutation } from 'src/services/project.service'

const StepSetWorkDate = ({ id, detailsProject }) => {
  const [formInput, setFormInput] = useState({
    d_project_id: 1,
    entitled: 'Date Début Travaux Prévue',
    start_date: moment(new Date())?.format('YYYY-MM-DD hh:mm'),
    type: 1
  })
  const addProjectEvent = useAddProjectEventMutation({ id })

  const handleSubmit = async () => {
    try {
      await addProjectEvent.mutateAsync(formInput)
    } catch (error) {}
  }
  useEffect(() => {
    const event = detailsProject?.events.find(event => event.type === 1)
    if (event) {
      setFormInput({ ...formInput, ...event })
    }
  }, [])

  return (
    <Grid container className='!mt-3' spacing={4}>
      <Grid
        container
        item
        sx={{
          borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
          padding: '3px'
        }}
        justifyItems={'center'}
      >
        <Grid item className='flex items-center text-center' xs={5}>
          <Typography className='!font-semibold  !mt-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            {detailsProject?.scenario}
          </Typography>
          <Typography className='!font-medium  !mt-2 !ml-1' sx={{ fontSize: '13px', color: 'red' }}>
            {/* {stepDoc?.required_document == 1 ? '(Obligatoire)' : '(Facultatif)'} */}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <TextField
            variant='standard'
            sx={{
              '& .MuiInputBase-root': {
                '& input': {
                  textAlign: 'center'
                }
              },
              '& .MuiInput-underline:before': {
                borderBottom: 'none'
              },

              // remove focus underline
              '& .MuiInput-underline:after': {
                borderBottom: 'none'
              },

              // remove hover underline
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 'none'
              }
            }}
            value={formInput.entitled}
            onChange={e => setFormInput({ ...formInput, entitled: e.target.value })}
          />
        </Grid>
        <Grid item xs={5} className='flex items-center justify-end'>
          <CustomDatePicker
            CustomeInputProps={{
              variant: 'standard',
              sx: {
                '& .MuiInputBase-root': {
                  '& input': {
                    textAlign: 'center'
                  }
                },
                '& .MuiInput-underline:before': {
                  borderBottom: 'none'
                },

                // remove focus underline
                '& .MuiInput-underline:after': {
                  borderBottom: 'none'
                },

                // remove hover underline
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none'
                }
              }
            }}
            dateFormat={'dd/MM/yyyy'}
            backendFormat={'YYYY-MM-DD'}
            dateValue={formInput.start_date}
            setDate={date => setFormInput({ ...formInput, start_date: date })}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} display={'flex'} justifyContent={'flex-end'}>
        <LoadingButton loading={addProjectEvent.isLoading} onClick={handleSubmit} variant='outlined'>
          Enregistrer
        </LoadingButton>
      </Grid>
    </Grid>
  )
}

export default StepSetWorkDate
