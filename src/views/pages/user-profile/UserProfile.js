import React, { useState, useEffect } from 'react'
import { Grid, Card, TextField, CardContent, Box, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'
import CustomAccordian from 'src/components/CustomAccordian'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetUserProfile, useUpdateUserCoordinates } from 'src/services/user-profile.service'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import InputPassword from 'src/components/InputPassword'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'

const schema = yup.object().shape({
  username: yup.string().required("Le champ nom d'utilisateur est obligatoire")

  // password: yup.string().required('Le champ mot de passe est obligatoire')
})

const UserProfile = () => {
  const [showPassword, setShowPassword] = useState(false)

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema)
  })

  const userProfileQuery = useGetUserProfile()
  const { data: userProfile, isLoading, isError, isSuccess } = useGetUserProfile()
  const updateUserCoordinatesMutation = useUpdateUserCoordinates()

  const [openModalFile, setopenModalFile] = useState(false)

  const [formInput, setFormInput] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    city: '',
    zip_code: '',
    address: '',
    phone_number: '',
    username: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (field, value) => {
    setFormInput(prevInput => ({ ...prevInput, [field]: value }))
    setFormErrors(prevErrors => ({ ...prevErrors, [field]: undefined }))
  }

  useEffect(() => {
    // isSuccess && setFormInput({ ...userProfile })
    if (isSuccess && userProfile) {
      setFormInput(prevFormInput => ({
        ...prevFormInput,
        password: prevFormInput.password || userProfile.password || '',
        username: userProfile.username || '',
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        city: userProfile.city || '',
        address: userProfile.address || '',
        zip_code: userProfile.zip_code || '',
        phone_number: userProfile.phone_number || ''
      }))
    }
  }, [userProfile, isSuccess])

  const handleUpdateCoordinates = async () => {
    const formData = { ...formInput }
    try {
      await updateUserCoordinatesMutation.mutateAsync(formData)
    } catch (error) {
      setFormErrors(error?.response?.data?.errors)
    }
  }

  return (
    <div className='h-full'>
      <CustomAccordian titleAccordian={'Informations générales'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Nom
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
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prénom
            </Typography>
            <TextField
              placeholder='Prénom'
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
              Email
            </Typography>
            <TextField
              placeholder='Email (1)'
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
              Numéro de téléphone
            </Typography>

            <CustomInputPhoneNumber
              error={formErrors?.phone_number}
              helperText={renderArrayMultiline(formErrors?.phone_number)}
              phoneValue={formInput.phone_number}
              setPhoneNumber={value => handleChange('phone_number', value)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      <CustomAccordian titleAccordian={'Identifiant plateforme'}>
        <Grid className='!mt-4' container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Identifiant <strong className='text-red-500'>*</strong>
            </Typography>
            <FormControl fullWidth>
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='Identifiant'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.username}
                    onChange={e => handleChange('username', e.target.value)}
                    onBlur={onBlur}
                    error={formErrors?.username}
                    helperText={renderArrayMultiline(formErrors?.username)}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Mot de passe <strong className='text-red-500'>*</strong>
            </Typography>
            <InputPassword
              value={formInput.password}
              handleChange={e => {
                handleChange('password', e.target.value)
              }}
              error={formErrors?.password}
              helperText={renderArrayMultiline(formErrors?.password)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      <Grid item xs={12} className='flex justify-end'>
        <LoadingButton
          className='h-[29px] w-[105px]'
          sx={{ fontSize: '12px', cursor: 'pointer' }}
          variant='contained'
          color='secondary'
          loading={updateUserCoordinatesMutation?.isPending}
          onClick={handleUpdateCoordinates}
        >
          Modifier
        </LoadingButton>
      </Grid>
    </div>
  )
}

export default UserProfile
