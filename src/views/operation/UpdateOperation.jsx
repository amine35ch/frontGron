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
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useDisabledOperation, useGetDetailOperation, useUpdateOperation } from 'src/services/operation.service'
import { useGetUnitType } from 'src/services/settings.service'

// ** Custom Components Imports

// ** Styled Components

const UpdateOperation = () => {
  const router = useRouter()
  const { id } = router.query

  // ** States

  const [formInput, setFormInput] = useState({
    reference: '',
    p_document_id: '',
    document_required: '',
    unit_type: '',
    price_unit_ht: '',
    condition: '',
    type: '',
    intern: '',
    scenario: ''

    // p_document_id: ''
  })
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  // ** Query
  const { data: detailsOperation, isLoading, isSuccess } = useGetDetailOperation({ id })
  const { data: listUnitType } = useGetUnitType()

  const createOperationMutation = useUpdateOperation({ id })
  const disabledOperationMutation = useDisabledOperation()

  // Handle function
  useEffect(() => {
    isSuccess &&
      setFormInput({
        ...detailsOperation,
        unit_type: detailsOperation?.unit_type?.type
      })
  }, [isSuccess, detailsOperation])

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
      await createOperationMutation.mutateAsync(formInput)

      router.push('/operations')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const disabledOperation = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledOperationMutation.mutateAsync({ id: id })
      }
      router.push('/operations')
    } catch (error) {}
  }

  return (
    <div className='h-full pt-6'>
      <Grid className='' container spacing={5}>
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
        {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Intitulé
          </Typography>
          <TextField
            placeholder='Intitulé'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.entitle}
            onChange={e => {
              handleChange('entitle', e.target.value)
            }}
            sx={{ fontSize: '10px !important' }}
            error={formErrors?.entitle}
            helperText={renderArrayMultiline(formErrors?.entitle)}
          />
        </Grid> */}
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Type
          </Typography>
          <CustomeAutoCompleteSelect
            option={'type'}
            value={formInput.unit_type}
            onChange={value => handleChange('unit_type', value)}
            data={listUnitType}
            formError={formErrors}
            error={formErrors?.unit_type}
            displayOption={'entitled'}
            helperText={renderArrayMultiline(formErrors?.unit_type)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Prix unitaire
          </Typography>
          <TextField
            placeholder='Prix unitaire'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.price_unit_ht}
            onChange={e => {
              handleChange('price_unit_ht', e.target.value)
            }}
            error={formErrors?.price_unit_ht}
            helperText={renderArrayMultiline(formErrors?.price_unit_ht)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Condition
          </Typography>
          <TextField
            placeholder='Condition'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.condition}
            onChange={e => {
              handleChange('condition', e.target.value)
            }}
            error={formErrors?.condition}
            helperText={renderArrayMultiline(formErrors?.condition)}
          />
        </Grid>
        {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Document
          </Typography>
          <CustomeAutoCompleteSelect
            value={formInput.p_document_id}
            onChange={value => handleChange('p_document_id', value)}
            data={listDocument}
            option={'id'}
            formError={formErrors}
            error={formErrors?.p_document_id}
            helperText={renderArrayMultiline(formErrors?.p_document_id)}
          />
        </Grid> */}
      </Grid>

      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6}>
          {detailsOperation?.state == 0 ? (
            <LoadingButton
              variant='contained'
              color='warning'
              loading={disabledOperationMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] '
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDelete()}
              startIcon={<IconifyIcon icon='mdi:delete-outline' />}
            >
              Activer
            </LoadingButton>
          ) : (
            <LoadingButton
              variant='contained'
              color='warning'
              loading={disabledOperationMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] '
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDelete()}
              startIcon={<IconifyIcon icon='mdi:delete-outline' />}
            >
              Désactiver
            </LoadingButton>
          )}
        </Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createOperationMutation?.isPending}
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
        title={`Suprimer Opération ${formInput?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledOperation}
      />
    </div>
  )
}

export default UpdateOperation
