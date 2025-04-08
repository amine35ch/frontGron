// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography, CardContent } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import { useCreateScenario } from 'src/services/scenario.service'
import CustomAccordian from 'src/components/CustomAccordian'
import { useGetWorks } from 'src/services/work.service'
import CustomReactQuill from 'src/components/CustomReactQuill'

// ** Custom Components Imports

// ** Styled Components

const CreateScenario = () => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    entitled: null,
    description: null,
    works: []
  })
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createScenarioMutation = useCreateScenario()
  const { data: listTraveaux } = useGetWorks({})

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    try {
      await createScenarioMutation.mutateAsync(formInput)

      router.push('/scenario')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <div className='h-full'>
      <CustomAccordian className='' titleAccordian={'Informations'}>
        <CardContent>
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
                Travaux
              </Typography>
              <CustomeAutoCompleteSelectMultiple
                option={'id'}
                value={formInput.works}
                onChange={value => handleChange('works', value)}
                optionLabel='reference'
                data={listTraveaux}
                formError={formErrors}
                error={formErrors?.works}
                helperText={renderArrayMultiline(formErrors?.works)}
              />
            </Grid>
            <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold !mb-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Description
              </Typography>
              <CustomReactQuill
                value={formInput.description}
                height={'250px'}
                handleChange={value => {
                  handleChange('description', value)
                }}
              />
              {/* <TextField
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
            /> */}
            </Grid>
          </Grid>
        </CardContent>
      </CustomAccordian>

      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createScenarioMutation?.isPending}
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

export default CreateScenario
