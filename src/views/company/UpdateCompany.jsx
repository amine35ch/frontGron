// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, Card, TextField, CardContent, Box, Switch, Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import { useDeleteClient, useGetDetailClient, useGetTypeClients, useUpdateClient } from 'src/services/client.service'
import InputPassword from 'src/components/InputPassword'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import DialogAlert from '../components/dialogs/DialogAlert'
import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'

// ** Custom Components Imports

// ** Styled Components

const UpdateCompany = () => {
  const router = useRouter()
  const { id } = router.query

  // ** States

  const [formInput, setFormInput] = useState({
    name: '',
    email: '',
    password: '',
    signature: '',
    position: '',
    city: '',
    zip_code: '',
    address: '',
    user_name: '',
    email: '',
    phone_number_1: '',
    phone_number_2: '',
    representative: '',
    p_type_client_id: ''
  })
  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [openModalFile, setopenModalFile] = useState(false)

  // ** Query
  const detailsClientQuery = useGetDetailClient({ id })
  const detailsClient = detailsClientQuery?.data
  const createClientMutation = useUpdateClient({ id })
  const deleteUserMutation = useDeleteClient()
  const { data } = useGetTypeClients()

  // Handle function
  useEffect(() => {
    detailsClientQuery?.isSuccess && setFormInput(detailsClient)
  }, [detailsClientQuery?.isSuccess, detailsClient])

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
      await createClientMutation.mutateAsync(formInput)

      router.push('/beneficiaries')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
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

  return (
    <div className='h-full pt-6'>
      <Grid className='' container spacing={5}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createClientMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Modifier
          </LoadingButton>
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Nom
          </Typography>
          <TextField
            placeholder='Nom'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.name}
            onChange={e => {
              handleChange('name', e.target.value)
            }}
            sx={{ fontSize: '10px !important' }}
            error={formErrors?.name}
            helperText={renderArrayMultiline(formErrors?.name)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Email du contact
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
            Numéro de téléphone (1)
          </Typography>
          <CustomInputPhoneNumber
            phoneValue={formInput.phone_number_2}
            setPhoneNumber={value => {
              handleChange('phone_number_2', value)
            }}
            error={formErrors?.phone_number_2}
            helperText={renderArrayMultiline(formErrors?.phone_number_2)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Numéro de téléphone (2)
          </Typography>
          <CustomInputPhoneNumber
            phoneValue={formInput.phone_number_2}
            setPhoneNumber={value => {
              handleChange('phone_number_2', value)
            }}
            error={formErrors?.phone_number_2}
            helperText={renderArrayMultiline(formErrors?.phone_number_2)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Type Client
          </Typography>
          <CustomeAutoCompleteSelect
            value={formInput.p_type_client_id}
            onChange={value => handleChange('p_type_client_id', value)}
            data={data}
            formError={formErrors}
            option={'id'}
            error={formErrors?.p_type_client_id}
            helperText={renderArrayMultiline(formErrors?.p_type_client_id)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AttachFileModalWithTable
            openModalFile={openModalFile}
            setopenModalFile={setopenModalFile}
            setFormInput={setFormInput}
            arrayDocuments={formInput?.documents || []}
            authorizeDelete={true}
            showInputName={true}
            detailsProject={detailsProject}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className='!h-[235px]' sx={{ backgroundColor: showCompte ? 'white' : '#F5F5F7' }}>
            <CardContent>
              <Box className='mb-3' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  {...((themeConfig.menuTextTruncate ||
                    (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                    noWrap: true
                  })}
                  sx={{ fontSize: '14px' }}
                >
                  <Translations text=' Identifiant du compte' />
                </Typography>
                <Switch name='navHidden' size='small' checked={showCompte} onChange={e => setShowCompte(!showCompte)} />
              </Box>

              <Grid className='mt-2' container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Typography
                    className='!font-semibold'
                    sx={{ fontSize: '15px', color: showCompte ? '#2a2e34' : '#cccfd3' }}
                  >
                    Email
                  </Typography>
                  <TextField
                    placeholder='Email'
                    size='small'
                    disabled={!showCompte}
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
                <Grid item xs={12} md={12}>
                  <Typography
                    className='!font-semibold'
                    sx={{ fontSize: '15px', color: showCompte ? '#2a2e34' : '#cccfd3' }}
                  >
                    Mot de passe
                  </Typography>
                  <InputPassword
                    value={formInput.password}
                    disabled={!showCompte}
                    handleChange={e => {
                      handleChange('password', e.target.value)
                    }}
                    error={formErrors?.password}
                    helperText={renderArrayMultiline(formErrors?.password)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='outlined'
            color='error'
            loading={deleteUserMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => handleDelete()}
            startIcon={<IconifyIcon icon='mdi:delete-outline' />}
          >
            Suprimer
          </LoadingButton>
        </Grid>
      </Grid>

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer Client ${formInput?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClient}
      />
    </div>
  )
}

export default UpdateCompany
