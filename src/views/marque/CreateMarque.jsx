// ** React Imports
import { useState } from 'react'

import 'react-quill/dist/quill.snow.css'

// ** MUI Imports
import { Grid, TextField, Typography } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import renderArrayMultiline from 'src/@core/utils/utilities'

import { useRouter } from 'next/router'

import { useCreateBrand } from 'src/services/brand.service'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomReactQuill from 'src/components/CustomReactQuill'

const CreateMarque = () => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    entitled: null,
    description: null

    // reference: null
  })
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createBrandMutation = useCreateBrand()

  const modules = {
    toolbar: [['bold'], [{ color: [] }, { background: [] }], ['clean']]
  }

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    try {
      await createBrandMutation.mutateAsync(formInput)

      router.push('/Catalog/brands/')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <div className='!h-full '>
      <CustomAccordian className='' titleAccordian={'Informations'}>
        <Grid className='!mt-4' container spacing={5}>
          {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
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
          </Grid> */}
          <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
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
          <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold !mb-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Description
            </Typography>
            <CustomReactQuill
              value={formInput.description}
              height={'1rem'}
              handleChange={e => handleChange('description', e)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>

      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createBrandMutation?.isPending}
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

export default CreateMarque
