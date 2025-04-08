// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Components
import AppBar from './components/vertical/appBar'
import Customizer from 'src/@core/components/customizer'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import AppBarLocation from './components/horizontal/app-bar-location/AppBarLocation'
import { Alert, AlertTitle, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'

const VerticalLayoutWrapper = styled('div')({
  display: 'flex',
  minHeight: '100vh'
})

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(3),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = props => {
  //* define theme
  const theme = useTheme()

  const { user, detailsSubscriberSubscription } = useAuth()

  // ** Props
  const { hidden, settings, children, scrollToTop, footerProps, contentHeightFixed, verticalLayoutProps } = props

  // ** Vars
  const { skin, navHidden, contentWidth } = settings
  const { navigationSize, disableCustomizer, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = collapsedNavigationSize

  // ** States
  const [navVisible, setNavVisible] = useState(false)

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  return (
    <>
      {/* {user?.subscription_status == 2 ? (
        <Box
          sx={{ backgroundColor: '#FFE2E3', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}
        >
          <IconifyIcon icon={'mdi:error'} fontSize={23} color={'red'} />
          <Typography ml={3} fontWeight={'600'} fontSize={'14px'} sx={{ color: 'red' }}>
            Votre abonnement est expiré
          </Typography>
        </Box>
      ) : user?.subscription_status == 0 ? (
        <Box
          sx={{ backgroundColor: '#FFE2E3', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}
        >
          <IconifyIcon icon={'mdi:error'} fontSize={23} color={'red'} />
          <Typography ml={3} fontWeight={'600'} fontSize={'14px'} sx={{ color: 'red' }}>
            Votre abonnement est désactivé
          </Typography>
        </Box>
      ) : detailsSubscriberSubscription?.alert === true ? (
        <Box
          sx={{ backgroundColor: '#FFF3D6', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}
        >
          <IconifyIcon icon={'ph:warning-duotone'} fontSize={23} color={'#FDB528'} />
          <Typography ml={3} fontWeight={'600'} fontSize={'14px'} sx={{ color: '#FDB528' }}>
            Votre abonnement expirera dans {detailsSubscriberSubscription?.number_days_before_end} jours
          </Typography>
        </Box>
      ) : null} */}

      <AppBar
        toggleNavVisibility={toggleNavVisibility}
        appBarContent={verticalLayoutProps.appBar?.content}
        appBarProps={verticalLayoutProps.appBar?.componentProps}
        {...props}
      />
      <VerticalLayoutWrapper className='layout-wrapper'>
        {navHidden && !(navHidden && settings.lastLayout === 'horizontal') ? null : (
          <Navigation
            navWidth={'255px'}
            navVisible={navVisible}
            setNavVisible={setNavVisible}
            collapsedNavWidth={collapsedNavWidth}
            toggleNavVisibility={toggleNavVisibility}
            navigationBorderWidth={navigationBorderWidth}
            navMenuContent={verticalLayoutProps.navMenu.content}
            navMenuBranding={verticalLayoutProps.navMenu.branding}
            menuLockedIcon={verticalLayoutProps.navMenu.lockedIcon}
            verticalNavItems={verticalLayoutProps.navMenu.navItems}
            navMenuProps={verticalLayoutProps.navMenu.componentProps}
            menuUnlockedIcon={verticalLayoutProps.navMenu.unlockedIcon}
            afterNavMenuContent={verticalLayoutProps.navMenu.afterContent}
            beforeNavMenuContent={verticalLayoutProps.navMenu.beforeContent}
            {...props}
          />
        )}

        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{
            ...(contentHeightFixed && { maxHeight: '100vh' }),
            '&.MuiBox-root': {
              backgroundColor: theme.palette.secondary.beigeBared
            }
          }}
        >
          <AppBarLocation />
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' }
              }),
              ...(contentWidth === 'boxed' && {
                mx: 'auto',

                // '@media (min-width:1440px)': { maxWidth: 1640 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

          <Footer footerStyles={footerProps?.sx} footerContent={footerProps?.content} {...props} />
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {disableCustomizer || hidden ? null : <Customizer />}

      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <Icon icon='mdi:arrow-up' />
          </Fab>
        </ScrollToTop>
      )}
    </>
  )
}

export default VerticalLayout
