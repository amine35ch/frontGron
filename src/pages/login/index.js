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
  username: yup.string().required(),
  password: yup.string().required(),
  company_code: yup.string().required('Le code client est obligatoire')
})

const defaultValues = {
  password: '',
  username: '',
  company_code: ''
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

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

  const onSubmit = data => {
    const { username, password, company_code } = data

    auth.login({ username, password, company_code, rememberMe }, () => {
      setError('username', {
        type: 'manual',
        message: 'Nom or Password is invalid'
      })
    })
  }
  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Container>
      <GridContainer container>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img alt='logo' src={'/images/logos/logo-mar.png'} width={180} />
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h6' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
                {`Bienvenue `}
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='company_code'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      onBlur={onBlur}
                      label='Code Société'
                      size='small'
                      onChange={onChange}
                      error={Boolean(errors.company_code)}
                    />
                  )}
                />
                {errors.company_code && (
                  <FormHelperText sx={{ color: 'error.main' }}>le code client est obligatoire</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label="Nom d'utilisateur"
                      size='small'
                      value={value}
                      onBlur={() => {
                        onBlur()
                        trigger('username')
                      }}
                      onChange={onChange}
                      placeholder='admin'
                      error={Boolean(errors.username)}
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: 'error.main' }}>le nom d'utilisateur est obligatoire</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password'>Mot de passe</InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      size='small'
                      label='Mot de passe'
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

                      // inputProps={{
                      //   startAdornment: (
                      //     <IconButton
                      //       edge='end'
                      //       onMouseDown={e => e.preventDefault()}
                      //       onClick={() => setShowPassword(!showPassword)}
                      //     >
                      //       <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                      //     </IconButton>
                      //   )
                      // }}
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    le champ mot de passe est obligatoire
                  </FormHelperText>
                )}
              </FormControl>
              <Typography color='error' variant='body2' sx={{ fontSize: '14px !important', fontWeight: '500', my: 2 }}>
                {auth?.errMsg}
              </Typography>
              <Box
                sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <Typography
                  variant='body2'
                  component={Link}
                  href='/forgot-password'
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                >
                  Mot de passe oublié ?
                </Typography>
              </Box>
              <Button
                onLoad={true}
                fullWidth
                size='small'
                className='h-[1px]'
                type='submit'
                variant='contained'
                sx={{ visibility: 'hidden' }}
              >
                Connecter
              </Button>
              <LoadingButton
                variant='contained'
                loading={auth?.isPending}
                loadingPosition='start'
                className='h-[29px] w-full'
                sx={{ fontSize: '12px', cursor: 'pointer', mb: 7 }}
                onClick={handleSubmit(onSubmit)}
              >
                Connecter
              </LoadingButton>

              <div className='flex justify-center'>
                {/* <Typography variant='body2' sx={{ fontSize: '14px !important', fontWeight: '500' }}>
                +216 54 000 047
              </Typography> */}
                <Typography variant='body2' sx={{ fontSize: '14px !important', fontWeight: '500' }}>
                  contact@vaerdia.fr
                </Typography>
              </div>
              <Divider
                sx={{
                  '& .MuiDivider-wrapper': { px: 4 },
                  mt: theme => `${theme.spacing(0)} !important`,
                  mb: theme => `${theme.spacing(7.5)} !important`
                }}
              >
                {/* au */}
              </Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  href='https://www.youtube.com/@CRMGRON'
                  component={Link}
                  sx={{ color: 'red' }}
                  target='_blank'

                  // onClick={e => e.preventDefault()}
                >
                  <Icon fontSize={'34px'} icon='mdi:youtube' />
                </IconButton>

                <IconButton
                  href='https://www.linkedin.com/showcase/crm-gron/?viewAsMember=true'
                  component={Link}
                  target='_blank'
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon fontSize={'21px'} icon='skill-icons:linkedin' />
                </IconButton>
                <IconButton
                  href='https://www.facebook.com/profile.php?id=100086580754923'
                  component={Link}
                  sx={{ color: '#db4437' }}
                  target='_blank'
                >
                  <Icon fontSize={'24px'} icon='devicon:facebook' />
                </IconButton>
              </Box>
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
          <Typography>{`V 3.0`}</Typography>
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
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
