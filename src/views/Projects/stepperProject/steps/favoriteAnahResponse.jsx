import { Box, Divider, Grid, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import CustomDatePicker from 'src/components/CustomDatePicker'
import StepDocuments from 'src/components/StepDocuments'

const datePickerSx = {
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

const FavoriteAnahResponse = ({ detailsProject = {} }) => {
  const [anahResponse, setAnahResponse] = useState(1)
  const [anaResponseComment, setAnaResponseComment] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
    work_planned_start: moment(new Date()).format('YYYY-MM-DD hh:mm'),
    work_planned_end: moment(new Date()).format('YYYY-MM-DD hh:mm')
  })

  useEffect(() => {
    setFormInput(prev => {
      return {
        ...prev,
        work_planned_start: detailsProject?.work_planned_start || moment(new Date()).format('YYYY-MM-DD hh:mm'),
        work_planned_end: detailsProject?.work_planned_end || moment(new Date()).format('YYYY-MM-DD hh:mm')
      }
    })
    setAnahResponse(detailsProject?.response_anah?.state)
    setAnaResponseComment(detailsProject?.response_anah?.response)
  }, [])

  return (
    <Grid container spacing={5}>
      <Grid
        container
        item
        sx={{
          padding: '3px'
        }}
        justifyItems={'center'}
        justifyContent={'space-evenly'}
      >
        <Grid item xs={12} md={5}>
          <Box display={'flex'} justifyItems={'center'}>
            <Typography className='!font-semibold  !mt-2 text-nowrap' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Date Début Travaux Prévue :
            </Typography>
            <CustomDatePicker
              CustomeInputProps={{
                variant: 'standard',
                sx: { ...datePickerSx }
              }}
              dateFormat={'dd/MM/yyyy'}
              backendFormat={'YYYY-MM-DD'}
              dateValue={formInput.work_planned_start}
              setDate={date => setFormInput({ ...formInput, work_planned_start: date })}
              error={formErrors?.work_planned_start}
              helperText={formErrors?.work_planned_start}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box display={'flex'} justifyItems={'center'}>
            <Typography className='!font-semibold  !mt-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Date Fin Travaux Prévue
            </Typography>
            <CustomDatePicker
              CustomeInputProps={{
                variant: 'standard',
                sx: { ...datePickerSx }
              }}
              dateFormat={'dd/MM/yyyy'}
              backendFormat={'YYYY-MM-DD'}
              dateValue={formInput.work_planned_end}
              setDate={date => setFormInput({ ...formInput, work_planned_end: date })}
              error={formErrors?.work_planned_end}
              helperText={formErrors?.work_planned_end}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        <Box mt={5} />
        <StepDocuments
          typeProject={detailsProject?.type}
          stepDocuments={detailsProject?.step_documents}
          id={detailsProject?.id}

          // detailsProject={detailsProject}
        />
        <Divider />
      </Grid>
    </Grid>
  )
}

export default FavoriteAnahResponse
