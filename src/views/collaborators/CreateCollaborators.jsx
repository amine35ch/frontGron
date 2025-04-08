// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { FormControlLabel, Grid, IconButton, Switch, TextField, Typography } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'
import InputPassword from 'src/components/InputPassword'
import renderArrayMultiline from 'src/@core/utils/utilities'

import { useRouter } from 'next/router'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'
import CustomAccordian from 'src/components/CustomAccordian'

import { useCreateCompany, useGetListCompany } from 'src/services/company.service'
import { useAuth } from 'src/hooks/useAuth'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'
import IconifyIcon from 'src/@core/components/icon'

// ** Custom Components Imports

// ** Styled Components

const CreateCollaborators = ({ defaultRole = 'inspector', listTypeInspector, routerProps }) => {
  const router = useRouter()
  const auth = useAuth()

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
    supervisor_id: '',

    role: defaultRole,
    auth: 0
  })

  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createCollaboratorsMutation = useCreateCompany({ profile: 'users', id: auth?.user?.userable_id })

  const { data: listSupervisor } = useGetListCompany({
    state: '1',
    profile: 'users',
    role: 'supervisor'
  })

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    try {
      await createCollaboratorsMutation.mutateAsync(formInput)
      router.push(routerProps)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleChangeSwitch = e => {
    setFormInput({ ...formInput, auth: e.target.checked ? 1 : 0 })
  }

  return (
    <div className='h-full'>
      <IconButton
        color='primary'
        onClick={() => {
          router.push(routerProps)
        }}
      >
        <IconifyIcon icon='icon-park-outline:arrow-left' width={20} height={20} />
      </IconButton>
      <CustomAccordian titleAccordian={'Informations générales'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Nom <strong className='text-red-500'>*</strong>
            </Typography>
            <TextField
              placeholder='Nom'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.last_name}
              onChange={e => {
                handleChange('last_name', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.last_name}
              helperText={renderArrayMultiline(formErrors?.last_name)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prénom <strong className='text-red-500'>*</strong>
            </Typography>
            <TextField
              placeholder='Nom'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.first_name}
              onChange={e => {
                handleChange('first_name', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.first_name}
              helperText={renderArrayMultiline(formErrors?.first_name)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Rôle <strong className='text-red-500'>*</strong>
            </Typography>

            <CustomeAutoCompleteSelect
              value={formInput?.role}
              onChange={value => handleChange('role', value)}
              data={listTypeInspector ?? []}
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
              value={formInput.username}
              onChange={e => {
                handleChange('username', e.target.value)
              }}
              disabled={formInput?.auth == 1 ? false : true}
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
        <Grid item xs={6} className='flex justify-end'></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createCollaboratorsMutation?.isPending}
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

export default CreateCollaborators
