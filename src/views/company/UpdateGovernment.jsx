// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import { useGetDetailClient, useUpdateClient } from 'src/services/client.service'

import { useGetDetailGovernmentUser, useUpdateGovernmentUser } from 'src/services/government.service'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'

// import ContentCreateClient from './ContentCreateClient'
import ContentCreateGovernment from './ContentCreateGovernment'
import { useGetTypeDocumentForClient } from 'src/services/document.service'
import { useAuth } from 'src/hooks/useAuth'

// ** Custom Components Imports

// ** Styled Components

const UpdateGovernment = () => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name == 'Clients')

  // ** States

  const [formInput, setFormInput] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: ''
  })

  const [formInputFile, setformInputFile] = useState({
    files: []
  })

  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)

  // ** Query
  const detailsGovernmentQuery = useGetDetailGovernmentUser({ id })
  const detailsGovernment = detailsGovernmentQuery?.data
  const updateGovernmentMutation = useUpdateGovernmentUser({ id })

  // Handle function
  useEffect(() => {
    detailsGovernmentQuery?.isSuccess && setFormInput({ ...detailsGovernment })
  }, [detailsGovernmentQuery?.isSuccess, detailsGovernment])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    delete formInput.documents
    try {
      await updateGovernmentMutation.mutateAsync(formInput)

      router.push('/company')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteClient = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: id })
      }
      router.push('/beneficiaries')
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledClient = async event => {
    setDisabledDialogOpen(false)
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      router.push('/beneficiaries')
    } catch (error) {}
  }

  return (
    <div className=''>
      <ContentCreateGovernment
        formInput={formInput}
        formInputFile={formInputFile}
        setformInputFile={setformInputFile}
        formErrors={formErrors}
        showCompte={showCompte}
        setShowCompte={setShowCompte}
        handleChange={handleChange}
        update={true}
        id={id}
      />

      <Grid className='!mt-2 flex justify-end' container spacing={5}>
        {/* <Grid item xs={6} className=''>
          {listPermissions?.permissions?.find(item => item.name == `delete clients`)?.authorized && (
            <LoadingButton
              variant='contained'
              color='error'
            //   loading={deleteUserMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDelete()}
              startIcon={<IconifyIcon icon='mdi:delete-outline' />}
            >
              Supprimer
            </LoadingButton>
          )}

          {listPermissions?.permissions?.find(item => item.name == `update clients`)?.authorized &&
            (detailsGovernment?.state == 0 ? (
              <LoadingButton
                variant='contained'
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
                variant='contained'
                color='warning'
                // loading={disabledUserMutation?.isPending}
                loadingPosition='start'
                className='h-[29px] w-[115px] !ml-3'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleDisabled()}
                startIcon={<IconifyIcon icon='la:user-alt-slash' />}
              >
                Désactiver
              </LoadingButton>
            ))}
        </Grid> */}

        {listPermissions?.permissions?.find(item => item.name == `update clients`)?.authorized && (
          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={updateGovernmentMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onSubmit()}
            >
              Modifier
            </LoadingButton>
          </Grid>
        )}
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
        title={`${detailsGovernment?.state == 0 ? 'Activer' : 'Désactiver'} Client ${formInput?.first_name} ${
          formInput?.last_name
        } ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledClient}
      />
    </div>
  )
}

export default UpdateGovernment
