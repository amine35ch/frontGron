// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import MuiAppBar from '@mui/material/AppBar'
import MuiToolbar from '@mui/material/Toolbar'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Box, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  transition: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '111',

  // backgroundColor: '#323452',
  backgroundColor: theme.palette.primary.main,

  color: theme.palette.text.primary,

  // minHeight: theme.mixins.toolbar.minHeight,
  minHeight: '40px !important'

  // [theme.breakpoints.down('sm')]: {
  //   paddingLeft: theme.spacing(4),
  //   paddingRight: theme.spacing(4)
  // },
  // px: 5,
}))

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  width: '100%',

  // padding: '0 !important',
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  minHeight: '40px !important',

  // minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
  transition: 'padding .25s ease-in-out, box-shadow .25s ease-in-out, backdrop-filter .25s ease-in-out'
}))

const LayoutAppBar = props => {
  // ** Props
  const { settings, appBarProps, appBarContent: userAppBarContent } = props
  const { user, detailsSubscriberSubscription } = useAuth()

  // ** Hooks
  const theme = useTheme()
  const scrollTrigger = useScrollTrigger({ threshold: 0, disableHysteresis: true })

  // ** Vars
  const { skin, appBar, appBarBlur, contentWidth } = settings

  const appBarFixedStyles = () => {
    return {
      boxShadow: skin === 'bordered' ? 0 : 3,
      ...(appBarBlur && { backdropFilter: 'blur(8px)' }),

      // backgroundColor: hexToRGBA(theme.palette.background.paper, appBarBlur ? 0.9 : 1),
      ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}`, borderTopWidth: 0 })
    }
  }
  if (appBar === 'hidden') {
    return null
  }
  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  return (
    <>
      <AppBar
        elevation={0}
        color='default'
        className='layout-navbar'
        sx={{ ...userAppBarStyle }}
        position={appBar === 'fixed' ? 'sticky' : 'static'}
        {...userAppBarProps}
      >
        <div className='w-full d-flex flex-wrap'>
          {user?.subscription_status == 2 ? (
            <Box
              sx={{
                backgroundColor: '#FFE2E3',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 2
              }}
            >
              <IconifyIcon icon={'mdi:error'} fontSize={23} color={'red'} />
              <Typography ml={3} fontWeight={'600'} fontSize={'14px'} sx={{ color: 'red' }}>
                Votre abonnement est expiré
              </Typography>
            </Box>
          ) : user?.subscription_status == 0 ? (
            <Box
              sx={{
                backgroundColor: '#FFE2E3',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 2
              }}
            >
              <IconifyIcon icon={'mdi:error'} fontSize={23} color={'red'} />
              <Typography ml={3} fontWeight={'600'} fontSize={'14px'} sx={{ color: 'red' }}>
                Votre abonnement est désactivé
              </Typography>
            </Box>
          ) : detailsSubscriberSubscription?.alert === true ? (
            <Box
              sx={{
                backgroundColor: '#FFF3D6',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 2
              }}
            >
              <IconifyIcon icon={'ph:warning-duotone'} fontSize={23} color={'#FDB528'} />
              <Typography ml={3} fontWeight={'600'} fontSize={'14px'} sx={{ color: '#FDB528' }}>
                Votre abonnement expirera dans {detailsSubscriberSubscription?.number_days_before_end} jours
              </Typography>
            </Box>
          ) : null}
          <Toolbar
            className='navbar-content-container'
            sx={{
              ...(appBar === 'fixed' && scrollTrigger && { ...appBarFixedStyles() })

              // ...(contentWidth === 'boxed' && {
              //   '@media (min-width:1440px)': { maxWidth: `calc(1440px - ${theme.spacing(6)} * 2)` }
              // })
            }}
          >
            {(userAppBarContent && userAppBarContent(props)) || null}
          </Toolbar>
        </div>
      </AppBar>
    </>
  )
}

export default LayoutAppBar
