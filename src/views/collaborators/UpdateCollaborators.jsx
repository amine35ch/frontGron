// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, Card, TextField, CardContent, Box, Switch, Typography, FormControlLabel } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import themeConfig from 'src/configs/themeConfig'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
  first_name: yup.string().required('Le nom est obligatoire'),
  last_name: yup.string().required('Le prénom est obligatoire')
})

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import InputPassword from 'src/components/InputPassword'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import { useDeleteCollaborator, useUpdateCollaborators } from 'src/services/collaborators.service'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import {
  useDeleteCompany,
  useDeleteCompanyUser,
  useDisabledCompany,
  useGetDetailCompany,
  useGetListCompany
} from 'src/services/company.service'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'

// ** Custom Components Imports

// ** Styled Components

const UpdateCollaborators = ({ listTypeCollab, routerProps }) => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name == 'Collaborateurs')

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** States

  const [formInput, setFormInput] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    city: '',
    zip_code: '',
    address: '',
    phone_number: '',
    username: '',
    auth: 0

    // role: 'collaborator'
  })
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)

  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  // const detailsCollaboratorsQuery = useGetDetailCollaborators({ id })
  const { data: detailsCollaborateur, isSuccess } = useGetDetailCompany({ id, profile: 'users' })

  const updateCollaborateurMutation = useUpdateCollaborators({ id })
  const disabledUserMutation = useDisabledCompany({ profile: 'users' })
  const deleteUserMutation = useDeleteCompanyUser({ profile: 'users' })

  const { data: listSupervisor } = useGetListCompany({
    state: '1',
    profile: 'users',
    role: 'supervisor'
  })

  // Handle function
  useEffect(() => {
    isSuccess && setFormInput({ ...detailsCollaborateur, role: detailsCollaborateur?.role?.name.slice(5) })
  }, [detailsCollaborateur, isSuccess])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    try {
      await updateCollaborateurMutation.mutateAsync(formInput)
      router.push(routerProps)
    } catch (error) {}
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteCollaborator = async event => {
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: id })
      }
      setSuspendDialogOpen(false)
      router.push(routerProps)
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledCollaborator = async event => {
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      setDisabledDialogOpen(false)
      router.push(routerProps)
    } catch (error) {}
  }

  const handleChangeSwitch = e => {
    setFormInput({ ...formInput, auth: e.target.checked ? 1 : 0 })
  }

  return (
    <div className='h-full'>
      <CustomAccordian titleAccordian={'Informations générales'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Nom <strong className='text-red-500'>*</strong>
            </Typography>
            <FormControl className='w-full !mt-1'>
              <Controller
                name='last_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='Nom'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.last_name}
                    defaultValue={formInput.last_name}
                    onBlur={onBlur}
                    onChange={e => {
                      handleChange('last_name', e.target.value)
                    }}
                    sx={{ fontSize: '10px !important' }}
                  />
                )}
              />
              {errors.last_name && isValid && (
                <FormHelperText sx={{ color: 'error.main' }}>le nom est obligatoire</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prénom <strong className='text-red-500'>*</strong>
            </Typography>
            <FormControl className='w-full !mt-1'>
              <Controller
                name='first_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='Prénom'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.first_name}
                    defaultValue={formInput.first_name}
                    onBlur={onBlur}
                    onChange={e => {
                      handleChange('first_name', e.target.value)
                    }}
                    sx={{ fontSize: '10px !important' }}
                  />
                )}
              />
              {errors.last_name && isValid && (
                <FormHelperText sx={{ color: 'error.main' }}>le prénom est obligatoire</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Rôle <strong className='text-red-500'>*</strong>
            </Typography>
            <CustomeAutoCompleteSelect
              value={formInput?.role}
              onChange={value => handleChange('role', value)}
              data={listTypeCollab}
              option={'value'}
              formError={formErrors}
              error={formErrors?.role}
              displayOption={'entitled'}
              helperText={renderArrayMultiline(formErrors?.role)}
            />
          </Grid>
          {formInput?.role == 'inspector' ? (
            <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Superviseur
              </Typography>

              <CustomeAutoCompleteSelect
                value={formInput?.supervisor_id}
                onChange={value => handleChange('supervisor_id', value)}
                data={listSupervisor}
                option={'id'}
                formError={formErrors}
                error={formErrors?.supervisor_id}
                displayOption={'last_name'}
                helperText={renderArrayMultiline(formErrors?.supervisor_id)}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Ville
            </Typography>
            <TextField
              placeholder='Ville'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.city}
              onChange={e => {
                handleChange('city', e.target.value)
              }}
              error={formErrors?.city}
              helperText={renderArrayMultiline(formErrors?.city)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Adresse
            </Typography>
            <TextField
              placeholder='Adresse'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.address}
              onChange={e => {
                handleChange('address', e.target.value)
              }}
              error={formErrors?.address}
              helperText={renderArrayMultiline(formErrors?.address)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Code postal
            </Typography>

            <OnlyNumbersInput
              max={99999}
              placeholder='code postal'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.zip_code}
              onChange={e => {
                handleChange('zip_code', e.target.value)
              }}
              error={formErrors?.zip_code}
              helperText={renderArrayMultiline(formErrors?.zip_code)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Email
            </Typography>
            <TextField
              placeholder='Email'
              type='email'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.email}
              onChange={e => {
                handleChange('email', e.target.value)
              }}
              error={formErrors?.email}
              helperText={renderArrayMultiline(formErrors?.email)}
            />
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro de téléphone
            </Typography>

            <CustomInputPhoneNumber
              phoneValue={formInput.phone_number}
              setPhoneNumber={value => {
                handleChange('phone_number', value)
              }}
              error={formErrors?.phone_number}
              helperText={renderArrayMultiline(formErrors?.phone_number)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>

      <CustomAccordian
        titleAccordian={'Identifiant plateforme'}
        secondary={
          <FormControlLabel
            onClick={e => handleChangeSwitch(e)}
            control={<Switch checked={formInput?.auth == 1 ? true : false} />}
          />
        }
        open={formInput?.auth == 1 ? true : false}
      >
        <Grid className='!mt-4' container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Identifiant
            </Typography>
            <TextField
              placeholder='Identifiant'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              disabled={formInput?.auth == 1 ? false : true}
              value={formInput.username}
              onChange={e => {
                handleChange('username', e.target.value)
              }}
              error={formErrors?.username}
              helperText={renderArrayMultiline(formErrors?.username)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Mot de passe
            </Typography>
            <InputPassword
              value={formInput.password}
              handleChange={e => {
                handleChange('password', e.target.value)
              }}
              disabled={formInput?.auth == 1 ? false : true}
              error={formErrors?.password}
              helperText={renderArrayMultiline(formErrors?.password)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>

      <Grid container className='mt-5'>
        <Grid item xs={6} mt={2} className='flex'>
          {formInput?.can_delete && (
            <LoadingButton
              variant='outlined'
              color='warning'
              loading={disabledUserMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[120px] !ml-3'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDisabled()}
              startIcon={<IconifyIcon icon='la:user-alt-slash' />}
            >
              {detailsCollaborateur?.state == '0' ? 'Activer' : 'Désactiver'}
            </LoadingButton>
          )}
          {formInput?.can_delete && (
            <LoadingButton
              variant='contained'
              color='error'
              loading={disabledUserMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[120px] !ml-3'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDelete()}
              startIcon={<IconifyIcon icon='la:user-alt-slash' />}
            >
              Supprimer{' '}
            </LoadingButton>
          )}
        </Grid>
        {formInput?.can_update && (
          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={updateCollaborateurMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[120px]'
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
        open={disabledDialogOpen}
        description=''
        setOpen={setDisabledDialogOpen}
        title={`${detailsCollaborateur?.state == 0 ? 'Activer' : 'Désactiver'} Inspecteur ${formInput?.first_name} ${
          formInput?.last_name
        } ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledCollaborator}
      />

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Voulez-vous supprimer utilisateur ${formInput?.first_name} ${formInput?.last_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteCollaborator}
      />
    </div>
  )
}

export default UpdateCollaborators
