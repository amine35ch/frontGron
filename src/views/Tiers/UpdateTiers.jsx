// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import { useRouter } from 'next/router'
import {
  useDeleteTiers,
  useDisabledTiers,
  useGetDetailTiers,
  useGetTiers,
  useGetTypeTiers,
  useUpdateTiers
} from 'src/services/tiers.service'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import moment from 'moment'
import ContentCreateTiers from './ContentCreateTiers'
import { useAuth } from 'src/hooks/useAuth'

// ** Custom Components Imports

// ** Styled Components

const UpdateTiers = ({ path }) => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name == 'Tiers')

  // ** States
  const [formInput, setFormInput] = useState({
    representative_last_name: '',
    representative_first_name: '',
    representative_gender: '',
    email: '',
    password: '',
    files: [],
    city: '',
    zip_code: '',
    address: '',
    username: '',
    phone_number_1: '',
    phone_number_2: '',
    num_rge: '',
    siren: '',
    operations: [],
    third_party_parent_id: '',
    date_expiration_rge: moment(new Date()).format('YYYY-MM-DD'),
    email_two: '',
    siret: '',
    trade_name: '',
    tva: '',
    logo: [],
    signature: [],
    profile: path == '/entreprise' ? 'INS' : '',
    position: '',
    trade_name: '',
    type_raison_sociale: '',
    website: '',
    fiche_navette_interne: 1,
    quotation_interne: 1
  })

  const [formInputFile, setformInputFile] = useState({
    files: []
  })

  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)

  // ** Query
  const detailsTiersQuery = useGetDetailTiers({ id })
  const detailsTiers = detailsTiersQuery?.data
  const updateTiersMutation = useUpdateTiers({ id })
  const { data } = useGetTypeTiers()

  const { data: listEntreprise } = useGetTiers({ type: 2 })
  const deleteUserMutation = useDeleteTiers()
  const disabledTiersMutation = useDisabledTiers()

  // Handle function
  useEffect(() => {
    detailsTiersQuery?.isSuccess &&
      setFormInput({
        ...detailsTiers,
        logo: [],
        type: detailsTiers?.type_third_party?.type,
        operations: detailsTiers?.operations.map(item => item.id)
      })
  }, [detailsTiersQuery?.isSuccess, detailsTiers])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    delete formInput.documents
    try {
      await updateTiersMutation.mutateAsync(formInput)

      router.push(path)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteTiers = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: id })
      }
      router.push('/Tiers')
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledTiers = async event => {
    setDisabledDialogOpen(false)
    if (event) {
      await disabledTiersMutation.mutateAsync({ id: id })
    }
    if (path == '/entreprise') {
      router.push('/entreprise')
    } else {
      router.push('/Tiers')
    }
  }

  return (
    <div>
      <ContentCreateTiers
        path={path}
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        showCompte={showCompte}
        listEntreprise={listEntreprise}
        addTiersWithModal={false}
        setShowCompte={setShowCompte}
        onSubmit={onSubmit}
        handleChange={handleChange}
        updateTiersMutation={updateTiersMutation}
        update={true}
        id={id}
        formInputFile={formInputFile}
        setformInputFile={setformInputFile}
      />

      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6} className=''>
          {listPermissions?.permissions?.find(item => item.name == `delete third_parties`)?.authorized && (
            <LoadingButton
              variant='contained'
              color='error'
              loading={deleteUserMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDelete()}
              startIcon={<IconifyIcon icon='mdi:delete-outline' />}
            >
              Supprimer
            </LoadingButton>
          )}
          {listPermissions?.permissions?.find(item => item.name == `delete third_parties`)?.authorized &&
            (detailsTiers?.state == 0 ? (
              <LoadingButton
                variant='contained'
                color='warning'
                loading={deleteUserMutation?.isPending}
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
                loading={deleteUserMutation?.isPending}
                loadingPosition='start'
                className='h-[29px] w-[115px] !ml-3'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleDisabled()}
                startIcon={<IconifyIcon icon='la:user-alt-slash' />}
              >
                Désactiver
              </LoadingButton>
            ))}
        </Grid>

        {listPermissions?.permissions?.find(item => item.name == `update third_parties`)?.authorized && (
          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={updateTiersMutation?.isPending}
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
        title={`Suprimer Tiers ${formInput?.trade_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteTiers}
      />

      <DialogAlert
        open={disabledDialogOpen}
        description=''
        setOpen={setDisabledDialogOpen}
        title={`${detailsTiers?.state == 0 ? 'Activer' : 'Désactiver'} ${
          path == '/entreprise' ? 'Entreprise retenue' : 'Technicien'
        } ${formInput?.trade_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledTiers}
      />
    </div>
  )
}

export default UpdateTiers
