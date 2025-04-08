// ** Next Import
import Link from 'next/link'

// ** MUI Components
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useVerifyResetKey } from 'src/services/user-profile.service'
import { useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// import VerificationInputs from './InputCode'
// import VerificationInput from 'react-verification-input'

// Styled Components

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

const VerifyCode = () => {
  // ** Hooks
  const theme = useTheme()
  const auth = useAuth()
  const router = useRouter()
  const [code, setCode] = useState(null)

  // ** Vars

  const verifyResetKeyMutation = useVerifyResetKey()

  const handleSubmit = async e => {
    e.preventDefault()

    const data = {
      code: code
    }

    // auth.verifyResetKey({ code })

    try {
      await verifyResetKeyMutation.mutateAsync(data)
      window.localStorage.setItem('code-verify', code)
      router.push('/confirm-password')
    } catch (error) {}
  }

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

  return (
    <Container>
      {' '}
      <GridContainer container>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ p: theme => `${theme.spacing(20, 7, 20)} !important` }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={'/images/logos/logo-mar.png'} width={180} />
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Mot de passe oublié ? 🔒</TypographyStyled>
              <Typography variant='body2'>
                Pour réinitialiser votre mot de passe, veuillez entrer le code que nous avons envoyé à votre e-mail.
              </Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <TextField
                autoFocus
                type='email'
                label='code'
                size='small'
                value={code}
                onChange={e => setCode(e.target.value)}
                sx={{ display: 'flex', mb: 2 }}
              />
              {/* <VerificationInput onChange={value => setco('valueee', value)} /> */}
              {/* <VerificationInputs setCode={setCode} test={test} /> */}
              <LoadingButton
                loading={verifyResetKeyMutation?.isPending}
                fullWidth
                size='small'
                type='submit'
                variant='contained'
                className='h-[31px] w-full'
                sx={{ mb: 5.25, mt: 2 }}
              >
                Modifier le mot de passe
              </LoadingButton>
            </form>

            <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkStyled href='/login'>
                <Icon icon='mdi:chevron-left' fontSize='2rem' />
                <span>Retour pour se connecter</span>
              </LinkStyled>
            </Typography>
          </CardContent>
          {/*
          <LoadingButton

            fullWidth
            size='small'
            type='submit'
            variant='contained'
            className='h-[45px] w-full !bg-[#d8e4b7]'
            sx={{ borderRadius: 0, color: '#4c4e64de' }}
            onClick={() => router.push('/login')}
          >
            Revenir à l'écran de connexion
          </LoadingButton> */}
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
      <FooterIllustrationsV2 image={`/images/pages/auth-v2-forgot-password-mask-${theme.palette.mode}.png`} />{' '}
    </Container>
  )
}
VerifyCode.guestGuard = true
VerifyCode.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default VerifyCode
