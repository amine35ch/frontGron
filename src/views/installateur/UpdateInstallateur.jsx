// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import moment from 'moment'
import { useAuth } from 'src/hooks/useAuth'
import {
  useDeleteCompany,
  useDisabledCompany,
  useGetDetailCompany,
  useGetListQualification,
  useUpdateCompany
} from 'src/services/company.service'
import ContentCreateTiers from '../Tiers/ContentCreateTiers'

// ** Custom Components Imports

// ** Styled Components

const UpdateInstallateur = ({ path }) => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name == 'Installateurs')
  const { data: listQualifications, isLoading: loadingQualification } = useGetListQualification({ type: '2' })

  // ** States
  const [formInput, setFormInput] = useState({
    representative_last_name: '',
    representative_first_name: '',
    representative_gender: '',
    email: '',
    files: [],
    city: '',
    zip_code: '',
    address: '',
    phone_number_1: '',
    phone_number_2: '',
    representative: '',
    num_rge: '',
    siren: '',
    operations: [],
    date_expiration_rge: moment(new Date()).format('YYYY-MM-DD'),
    email_two: '',
    siret: '',
    trade_name: '',
    identifiant_tva: '',
    logo: [],
    signature: [],
    profile: 'INS',
    assurance_type: '',
    position: '',
    trade_name: '',
    type_raison_sociale: '',
    website: '',
    insurance_rcs: '',
    insurance_address: '',
    insurance_capital: 0,
    insurance_police: '',
    insurance_name: '',
    insurance_siret: '',
    rges: [
      {
        rge: '',
        qualifications: [],
        start_date: moment(new Date()).format('YYYY-MM-DD'),
        end_date: moment(new Date()).add(1, 'year').format('YYYY-MM-DD')
      }
    ],
    num_ape: '',
    capital: '',
    approval_number: '',
    num_decennale: '',
    emissions_date_assurance: moment(new Date()).format('YYYY-MM-DD'),
    end_date_assurance: moment(new Date()).format('YYYY-MM-DD'),
    tva: null,
    max_projects_per_month: 250,
    signature_interne: 0
  })

  const [formInputFile, setformInputFile] = useState({
    files: []
  })

  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)

  // ** Query
  const { data: detailsInstallateur, isSuccess } = useGetDetailCompany({ id, profile: 'installers' })

  const updateTiersMutation = useUpdateCompany({ id, profile: 'installers' })
  const disabledUserMutation = useDisabledCompany({ profile: 'installers' })
  const deleteUserMutation = useDeleteCompany({ profile: 'installers' })

  // Handle function
  useEffect(() => {
    isSuccess &&
      detailsInstallateur &&
      setFormInput({
        ...detailsInstallateur,
        logo: [],
        signature: [],
        operations: detailsInstallateur?.operations?.map(item => item.id),
        type_raison_sociale: detailsInstallateur?.type_raison_sociale?.type,
        rges: detailsInstallateur?.rges?.map(item => ({
          id: item.id,
          rge: item.rge,
          qualifications: item.qualifications,
          start_date: moment(item.start_date).format('YYYY-MM-DD'),
          end_date: moment(item.end_date).format('YYYY-MM-DD')
        })),
        signature_interne: detailsInstallateur?.signature_interne === 1 ? 0 : 1
      })
  }, [isSuccess, detailsInstallateur])

  const handleChange = (key, value, subKey = '', index = 0) => {
    if (key === 'rges') {
      const rges = formInput.rges
      rges[index][subKey] = value
      setFormInput({
        ...formInput,
        rges
      })

      return
    }
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const handleAddRemoveRge = (action, index) => {
    if (action === 'add') {
      const rges = formInput.rges
      rges.push({
        rge: '',
        qualifications: [],
        start_date: moment(new Date()).format('YYYY-MM-DD'),
        end_date: moment(new Date()).add(1, 'year').format('YYYY-MM-DD')
      })
      setFormInput({
        ...formInput,
        rges
      })
    } else {
      const rges = formInput.rges
      rges.splice(index, 1)
      setFormInput({
        ...formInput,
        rges
      })
    }
  }

  const onSubmit = async () => {
    delete formInput.documents
    delete formInput.download_signature
    delete formInput.download_logo
    const formData = new FormData()
    for (let key in formInput) {
      if (key === 'logo') {
        formInput?.logo?.forEach((file, index) => {
          formData.append(`logo`, file)
        })
      } else if (key === 'signature') {
        formInput?.signature?.forEach((file, index) => {
          formData.append(`signature`, file)
        })
      } else if (key === 'signature_interne') {
        formData.append(`signature_interne`, formInput.signature_interne === 1 ? 0 : 1)
      } else if (key === 'rges') {
        formInput?.rges?.map((rge, index) => {
          if (rge?.id) {
            formData.append(`rges[${index}][id]`, rge?.id ?? '')
          }

          formData.append(`rges[${index}][rge]`, rge?.rge)
          rge?.qualifications?.map((work, workindex) => {
            formData.append(`rges[${index}][qualifications][${workindex}]`, work)
          })
          formData.append(`rges[${index}][start_date]`, rge?.start_date)
          formData.append(`rges[${index}][end_date]`, rge?.end_date)
        })
      } else formData.append(key, formInput[key] == null ? '' : formInput[key])
    }

    try {
      await updateTiersMutation.mutateAsync(formData)

      router.push('/entreprise')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject ?? {})
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
      router.push('/entreprise')
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledTiers = async event => {
    setDisabledDialogOpen(false)
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      router.push('/entreprise')
    } catch (error) {}
  }

  return (
    <div>
      <ContentCreateTiers
        path={path}
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        showCompte={showCompte}
        addTiersWithModal={false}
        setShowCompte={setShowCompte}
        onSubmit={onSubmit}
        handleChange={handleChange}
        updateTiersMutation={updateTiersMutation}
        update={true}
        id={id}
        formInputFile={formInputFile}
        setformInputFile={setformInputFile}
        handleAddRemoveRge={handleAddRemoveRge}
        listQualifications={listQualifications}
      />

      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6} className='flex '>
          {formInput?.can_delete &&
            (detailsInstallateur?.state == 0 ? (
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
                className='h-[29px] w-[130px] !ml-3'
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
              loading={updateTiersMutation?.isPending}
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
      </Grid>

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Supprimer Entreprise retenue ${formInput?.trade_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteTiers}
      />

      <DialogAlert
        open={disabledDialogOpen}
        description=''
        setOpen={setDisabledDialogOpen}
        title={`${detailsInstallateur?.state == 0 ? 'Activer' : 'Désactiver'} Entreprise retenue ${
          formInput?.trade_name
        } ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledTiers}
      />
    </div>
  )
}

export default UpdateInstallateur
