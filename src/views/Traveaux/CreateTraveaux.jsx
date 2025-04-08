// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid, Card, TextField, CardContent, Box, Switch, Typography } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import { useCreateWorks } from 'src/services/work.service'

// ** Custom Components Imports

// ** Styled Components

const CreateTraveaux = () => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    description: null,
    reference: null,
    unit: null,
    pricing_list: []
  })
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createWorkMutation = useCreateWorks()

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    try {
      await createWorkMutation.mutateAsync(formInput)

      router.push('/works/')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <div className='h-full pt-6'>
      <Grid className='' container spacing={5}>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Référence
          </Typography>
          <TextField
            placeholder='Titre'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.reference}
            onChange={e => {
              handleChange('reference', e.target.value)
            }}
            sx={{ fontSize: '10px !important' }}
            error={formErrors?.reference}
            helperText={renderArrayMultiline(formErrors?.reference)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Titre
          </Typography>
          <TextField
            placeholder='Titre'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.entitled}
            onChange={e => {
              handleChange('entitled', e.target.value)
            }}
            sx={{ fontSize: '10px !important' }}
            error={formErrors?.entitled}
            helperText={renderArrayMultiline(formErrors?.entitled)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Description
          </Typography>
          <TextField
            placeholder='Description'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.description}
            onChange={e => {
              handleChange('description', e.target.value)
            }}
            error={formErrors?.description}
            helperText={renderArrayMultiline(formErrors?.description)}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createWorkMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Créer
          </LoadingButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateTraveaux
