// ** Global FullCalendar styles (importés proprement via fichier CSS dédié)
import '../../styles/fullcalendar.css'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'

// ** react query p
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StateProvider } from 'src/context/StateContext'
import { TabsProvider } from 'src/context/TabsContext'
import fr from 'date-fns/locale/fr'
import { registerLocale } from 'react-datepicker'
import InfoModal from 'src/components/InfoModal'
import { ModalProvider } from 'src/context/ModelInfoContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

registerLocale('fr', fr)

const clientSideEmotionCache = createEmotionCache()

if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  if (!guestGuard && !authGuard) return <>{children}</>
  return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
}

// ! Remove before prod
if (process.env.NODE_ENV === 'production') {
  console.error = () => {}
  console.log = () => {}
  console.warn = () => {}
}

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{`${themeConfig.templateName} `}</title>
          </Head>
          <AuthProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <StateProvider>
                <TabsProvider>
                  <SettingsConsumer>
                    {({ settings }) => (
                      <ThemeComponent settings={settings}>
                        <WindowWrapper>
                          <Guard authGuard={authGuard} guestGuard={guestGuard}>
                            <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                              {getLayout(<Component {...pageProps} />)}
                            </AclGuard>
                          </Guard>
                        </WindowWrapper>
                        <ReactHotToast>
                          <Toaster
                            position={settings.toastPosition}
                            toastOptions={{ className: 'react-hot-toast' }}
                          />
                        </ReactHotToast>
                      </ThemeComponent>
                    )}
                  </SettingsConsumer>
                </TabsProvider>
              </StateProvider>
            </SettingsProvider>
          </AuthProvider>
        </CacheProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  )
}

export default App
