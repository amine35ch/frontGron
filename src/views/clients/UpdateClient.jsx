// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import {
  useDeleteClient,
  useDisabledClient,
  useGetDetailClient,
  useGetTypeClients,
  useUpdateClient
} from 'src/services/client.service'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import ContentCreateClient from './ContentCreateClient'
import { useGetTypeDocumentForClient } from 'src/services/document.service'
import { useAuth } from 'src/hooks/useAuth'
import moment from 'moment'

// ** Custom Components Imports

// ** Styled Components

const UpdateClient = () => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name == 'Clients')

  // ** States

  const [formInput, setFormInput] = useState({
    first_name: '',
    last_name: '',
    email_contact: '',
    position: '',
    city: '',
    zip_code: '',

    house_number: '',
    street: '',
    email_anah: '',
    password_anah: '',
    phone_number_1: '',
    phone_number_2: '',
    representative: '',
    type: 1,
    rib: '',
    iban: '',
    year_of_birth: null,
    representative: '',
    representative_contact: '',
    climatic_zone: ''
  })

  const [formInputFile, setformInputFile] = useState({
    files: []
  })

  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)

  // ** Query
  const detailsClientQuery = useGetDetailClient({ id })
  const detailsClient = detailsClientQuery?.data
  const updateClientMutation = useUpdateClient({ id })
  const deleteUserMutation = useDeleteClient()
  const disabledUserMutation = useDisabledClient()
  const { data: listTypeClient } = useGetTypeClients()

  // Handle function
  useEffect(() => {
    detailsClientQuery?.isSuccess &&
      setFormInput({
        ...detailsClient,
        type: detailsClient?.type?.type
      })
  }, [detailsClientQuery?.isSuccess, detailsClient])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    delete formInput.documents
    try {
      await updateClientMutation.mutateAsync(formInput)

      router.push('/beneficiaries')
    } catch (error) {
      const errorsObject = error?.response

      setFormErrors(errorsObject)
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteClient = async event => {
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: id })
      }
      setSuspendDialogOpen(false)
      router.push('/beneficiaries')
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledClient = async event => {
    setDisabledDialogOpen(false)
    if (event) {
      try {
        await disabledUserMutation.mutateAsync({ id: id })
        router.push('/beneficiaries')
      } catch (error) {
        const errorsObject = error?.response?.data?.message
        setFormErrors(errorsObject)
      }
    }
  }

  return (
    <div className=''>
      <ContentCreateClient
        formInput={formInput}
        formInputFile={formInputFile}
        setformInputFile={setformInputFile}
        formErrors={formErrors}
        showCompte={showCompte}
        listTypeClient={listTypeClient}
        setShowCompte={setShowCompte}
        handleChange={handleChange}
        update={true}
        id={id}
      />

      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6} className='flex '>
          {formInput?.can_delete &&
            (detailsClient?.state == 0 ? (
              <LoadingButton
                variant='outlined'
                color='warning'
                loading={disabledUserMutation?.isPending}
                loadingPosition='start'
                className='h-[29px] w-[115px] !ml-3'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleDisabled()}
                startIcon={<IconifyIcon icon='la:user-alt-slash' />}
              >
                Activer
              </LoadingButton>
            ) : (
              <LoadingButton
                variant='outlined'
                color='warning'
                loading={disabledUserMutation?.isPending}
                loadingPosition='start'
                className='h-[29px] w-[115px] !ml-3'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleDisabled()}
                startIcon={<IconifyIcon icon='la:user-alt-slash' />}
              >
                Désactiver
              </LoadingButton>
            ))}
          {formInput?.can_delete && (
            <LoadingButton
              variant='contained'
              color='error'
              loading={deleteUserMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[130px] !ml-4'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDelete()}
              startIcon={<IconifyIcon icon='mdi:delete-outline' />}
            >
              Supprimer
            </LoadingButton>
          )}
        </Grid>
        {formInput?.can_update && (
          <Grid item xs={5} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={updateClientMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[130px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              startIcon={<IconifyIcon icon='mdi:pencil-outline' />}
              onClick={() => onSubmit()}
            >
              Modifier
            </LoadingButton>
          </Grid>
        )}
        <Grid item xs={12} mt={2} className='flex justify-end'></Grid>
      </Grid>

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer Client ${formInput?.first_name} ${formInput?.last_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClient}
      />

      <DialogAlert
        open={disabledDialogOpen}
        description=''
        setOpen={setDisabledDialogOpen}
        title={`${detailsClient?.state == 0 ? 'Activer' : 'Désactiver'} Client ${formInput?.first_name} ${
          formInput?.last_name
        } ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledClient}
      />
    </div>
  )
}

export default UpdateClient
