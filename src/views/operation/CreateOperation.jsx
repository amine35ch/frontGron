// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid, Card, TextField, CardContent, Box, Switch, Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'

import InputPassword from 'src/components/InputPassword'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useRouter } from 'next/router'
import { useCreateOperation, useGetListDocument } from 'src/services/operation.service'

// ** Custom Components Imports

// ** Styled Components

const CreateOperation = () => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    reference: '',
    price_min: '',
    price_max: ''

    // p_document_id: ''
  })
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createOperationMutation = useCreateOperation()
  const { data } = useGetListDocument()

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const formData = new FormData()

    for (let key in formInput) {
      formData.append(key, formInput[key])
    }
    try {
      await createOperationMutation.mutateAsync(formData)

      router.push('/operations')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <div className='h-full pt-6'>
      <Grid className='' container spacing={5}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createOperationMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Créer
          </LoadingButton>
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Référence
          </Typography>
          <TextField
            placeholder='Référence'
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
            Prix minimum
          </Typography>
          <TextField
            placeholder='Prix minimum'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.price_min}
            onChange={e => {
              handleChange('price_min', e.target.value)
            }}
            error={formErrors?.price_min}
            helperText={renderArrayMultiline(formErrors?.price_min)}
          />
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Prix maximum
          </Typography>
          <TextField
            placeholder='Prix maximum'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.price_max}
            onChange={e => {
              handleChange('price_max', e.target.value)
            }}
            error={formErrors?.price_max}
            helperText={renderArrayMultiline(formErrors?.price_max)}
          />
        </Grid>
        {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Document
          </Typography>
          <CustomeAutoCompleteSelect
            value={formInput.p_document_id}
            onChange={value => handleChange('p_document_id', value)}
            data={data}
            option={'id'}
            formError={formErrors}
            error={formErrors?.p_document_id}
            helperText={renderArrayMultiline(formErrors?.p_document_id)}
          />
        </Grid> */}
      </Grid>
    </div>
  )
}

export default CreateOperation
