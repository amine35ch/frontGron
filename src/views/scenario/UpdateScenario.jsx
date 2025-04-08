// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useDisabledScenario, useGetDetailScenario, useUpdateScenario } from 'src/services/scenario.service'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import CustomAccordian from 'src/components/CustomAccordian'
import { useGetWorks } from 'src/services/work.service'
import CustomReactQuill from 'src/components/CustomReactQuill'

// ** Custom Components Imports

// ** Styled Components

const UpdateScenario = () => {
  const router = useRouter()
  const { id } = router.query

  // ** States

  const [formInput, setFormInput] = useState({
    entitled: null,
    description: null,

    // reference: null,
    works: []
  })
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  // ** Query
  const { data: detailsScenario, isLoading, isSuccess } = useGetDetailScenario({ id })
  const { data: listTraveaux } = useGetWorks({})

  const updateSceanrioMutation = useUpdateScenario({ id })
  const disabledScenarioMutation = useDisabledScenario({ id })

  // Handle function
  useEffect(() => {
    isSuccess &&
      setFormInput({
        ...detailsScenario,
        works: detailsScenario?.works?.map(work => work.id),
        unit_type: detailsScenario?.unit_type?.type
      })
  }, [isSuccess, detailsScenario])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    try {
      await updateSceanrioMutation.mutateAsync(formInput)

      router.push('/scenario')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const disabledScenario = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledScenarioMutation.mutateAsync({ id: id })
      }
      router.push('/scenario')
    } catch (error) {}
  }

  return (
    <div className='h-full '>
      <CustomAccordian titleAccordian={'Informations'}>
        <Grid className='!mt-4' container spacing={5}>
          {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Référence
            </Typography>
            <TextField
              placeholder='Titre'
              size='small'
              variant='contained'
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
      </CustomAccordian>

      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6}>
          <LoadingButton
            variant='contained'
            color='warning'
            loading={disabledScenarioMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] '
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => handleDelete()}
            startIcon={<IconifyIcon icon='mdi:delete-outline' />}
          >
            {detailsScenario?.state == '0' ? 'Activer' : 'Désactiver'}
          </LoadingButton>
        </Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={updateSceanrioMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Modifier
          </LoadingButton>
        </Grid>
      </Grid>

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer Scénario ${formInput?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledScenario}
      />
    </div>
  )
}

export default UpdateScenario
