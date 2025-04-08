// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import CardContent from '@mui/material/CardContent'
import MuiCard from '@mui/material/Card'
import { LoadingButton } from '@mui/lab'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'
import { useResetPassword } from 'src/services/user-profile.service'
import { useRouter } from 'next/router'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.secondary.beigeBared
}))

const GridContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('sm')]: { width: 450 }

  // marginTop: '2rem'
}))

const schema = yup.object().shape({
  confirm_password: yup.string().required(),
  password: yup.string().required(),
  code: yup.string().required('Le code client est obligatoire')
})

const ConfirmPassword = () => {
  const codeVerify = window.localStorage.getItem('code-verify')

  const [code, setCode] = useState(codeVerify)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const router = useRouter()

  const { settings } = useSettings()
  const resetPasswordMutation = useResetPassword()

  // ** Vars
  const { skin } = settings

  const defaultValues = {
    password: '',
    confirm_password: '',
    code: codeVerify
  }

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    const { confirm_password, password, code } = data
    try {
      await resetPasswordMutation.mutateAsync(data)
      router.push('/login')
    } catch (error) {
      setFormErrors(error?.response?.data?.message)
    }
  }

  return (
    <Container>
      <GridContainer container>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={'/images/logos/logo-mar.png'} width={180} />
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h6' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
                Réinitialiser votre mot de passe
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel error={Boolean(errors.code)}>Code Société </InputLabel>

                <Controller
                  name='code'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Code Société'
                      size='small'
                      onChange={onChange}
                      error={Boolean(errors.code)}
                    />
                  )}
                />
                {errors.code && (
                  <FormHelperText sx={{ color: 'error.main' }}>le code client est obligatoire</FormHelperText>
                )}
              </FormControl> */}

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Nouveau Mot de passe
                </InputLabel>

                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      size='small'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    le champ mot de passe est obligatoire
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Confirmer Mot de passe
                </InputLabel>

                <Controller
                  name='confirm_password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='confirm_password'
                      size='small'
                      onChange={onChange}
                      id='auth-login-v2-confirmPassword'
                      error={Boolean(errors.confirm_password)}
                      type={showConfirmPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <Icon
                              icon={showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                              fontSize={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirm_password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    le champ confirmer mot de passe est obligatoire
                  </FormHelperText>
                )}
              </FormControl>
              <Typography color='error' variant='body2' sx={{ fontSize: '14px !important', fontWeight: '400', my: 2 }}>
                {formErrors}
              </Typography>

              <LoadingButton
                variant='contained'
                loading={auth?.isPending}
                loadingPosition='start'
                className='h-[29px] w-full'
                sx={{ fontSize: '12px', cursor: 'pointer', mb: 7 }}
                onClick={handleSubmit(onSubmit)}
              >
                Modifier
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
        <Box
          mt={2}
          display='flex'
          flexDirection='column'
          alignContent='center'
          alignItems='center'
          justifyContent='center'
        >
          <Typography>{`V 2.0`}</Typography>
          <Typography>
            {`© 2024,  `}
            {` by `}
            <Link target='_blank' href={process.env.NEXT_PUBLIC_WEBSITE}>
              VAERDIA
            </Link>
          </Typography>
        </Box>
      </GridContainer>
      <FooterIllustrationsV1 />
    </Container>
  )
}
ConfirmPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ConfirmPassword.guestGuard = true

export default ConfirmPassword
