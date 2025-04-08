// ** React Imports
// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
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
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'
import { useSendResetLinkEmailByUser } from 'src/services/user-profile.service'
import { useRouter } from 'next/router'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  '& svg': { mr: 1.5 },
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
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
  company_code: yup.string().required('Le code client est obligatoire')
})

const defaultValues = {
  username: '',
  company_code: ''
}

const ForgotPassword = () => {
  // ** Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const sendResetLinkEmailByUserMutation = useSendResetLinkEmailByUser()

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

  const onSubmit = async data => {
    try {
      await sendResetLinkEmailByUserMutation.mutateAsync(data)
      router.push('/verify-code')
    } catch (error) {}
  }

  return (
    <Container>
      <GridContainer container>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 0)} !important` }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={'/images/logos/logo-mar.png'} alt='logo' width={180} />
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Mot de passe oublié ? 🔒</TypographyStyled>
              <Typography variant='body2'>
                Entrez votre code Client et votre nom d’utilisateur, et nous vous enverrons un lien pour récupérer votre
                compte sur votre email.{' '}
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel error={Boolean(errors.company_code)}>Code Société</InputLabel>

                <Controller
                  name='company_code'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
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
                      autoFocus
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

              <LoadingButton
                loading={sendResetLinkEmailByUserMutation?.isPending}
                fullWidth
                size='small'
                type='submit'
                variant='contained'
                className='h-[31px] w-full'
                sx={{ mb: 5.25, mt: 2 }}
              >
                Envoyer le lien de réinitialisation
              </LoadingButton>
            </form>

            <Divider>OU</Divider>

            <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 13 }}>
              <LinkStyled href='/verify-code'>
                <span>Vous avez déjà le code ?</span>
                <Icon icon='mdi:chevron-right' fontSize='2rem' />
              </LinkStyled>
            </Typography>
          </CardContent>
          <LoadingButton
            fullWidth
            size='small'
            type='submit'
            variant='contained'
            className='h-[50px] w-full'
            sx={{ borderRadius: 0, color: '#4c4e64de', backgroundColor: '#f5f7ed' }}
            onClick={() => router.push('/login')}
          >
            Revenir à l'écran de connexion
          </LoadingButton>
          {/* <div className='h-[55px] w-full !bg-[#fafafa] br border-[#dbdbdb] border-t-2 flex items-center justify-center'>
            <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkStyled href='/login'>
                <span>Revenir à l'écran de connexion</span>
              </LinkStyled>
            </Typography>
          </div> */}
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
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
