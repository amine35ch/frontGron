import { LoadingButton } from '@mui/lab'
import { Box, Grid, TextField, Typography } from '@mui/material'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import CustomDatePicker from 'src/components/CustomDatePicker'
import { useAddProjectEventMutation, useUpdateProjectPrevWorkDate } from 'src/services/project.service'

const PrevWrokDate = ({ id, detailsProject, titleBtn, variant, color, disabled = false }) => {
  const [formInput, setFormInput] = useState({
    work_planned_start: moment(new Date()).format('YYYY-MM-DD hh:mm'),
    work_planned_end: moment(new Date()).format('YYYY-MM-DD hh:mm')
  })
  const projectWorkDateMutation = useUpdateProjectPrevWorkDate({ id })

  const handleSubmit = async () => {
    try {
      await projectWorkDateMutation.mutateAsync(formInput)
    } catch (error) {}
  }
  useEffect(() => {
    setFormInput(prev => {
      return {
        ...prev,
        work_planned_start: detailsProject.work_planned_start || moment(new Date()).format('YYYY-MM-DD hh:mm'),
        work_planned_end: detailsProject.work_planned_end || moment(new Date()).format('YYYY-MM-DD hh:mm')
      }
    })
  }, [])

  return (
    <Grid container spacing={5}>
      <Grid
        container
        item
        sx={{
          borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
          padding: '3px'
        }}
        justifyItems={'center'}
        justifyContent={'space-evenly'}
      >
        <Box display={'flex'} justifyItems={'center'}>
          <Typography className='!font-semibold  !mt-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Date Début Travaux Prévue
          </Typography>
          <CustomDatePicker
            CustomeInputProps={{
              variant: 'standard',
              sx: {
                pt: 2,
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
            dateValue={formInput.work_planned_start}
            setDate={date => setFormInput({ ...formInput, work_planned_start: date })}
          />
        </Box>

        <Box display={'flex'} justifyItems={'center'}>
          <Typography className='!font-semibold  !mt-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Date Fin Travaux Prévue
          </Typography>
          <CustomDatePicker
            CustomeInputProps={{
              variant: 'standard',
              sx: {
                pt: 2,
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
            dateValue={formInput.work_planned_end}
            setDate={date => setFormInput({ ...formInput, work_planned_end: date })}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={12} display={'flex'} justifyContent={'flex-end'}>
        <LoadingButton
          size='small'
          color={color}
          loading={projectWorkDateMutation?.isPending}
          onClick={handleSubmit}
          variant={variant}
          disabled={disabled}
        >
          {titleBtn}
        </LoadingButton>
      </Grid>
    </Grid>
  )
}

export default PrevWrokDate
