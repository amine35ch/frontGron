// ** React Imports
import { createContext, useEffect, useState, useContext } from 'react'
import { AbilityBuilder, Ability } from '@casl/ability'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import toast from 'react-hot-toast'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import axiosClient from 'src/axiosClient'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  detailsSubscriberSubscription: null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  verifyResetKey: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [isLoggedIn, setIsloggedIn] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [detailsSubscriberSubscription, setDetailsSubscriberSubscription] = useState(null)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      // const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      await axiosClient
        .get('/logged-user')
        .then(async response => {
          setUser({ ...response.data?.result })
          setLoading(false)
          setIsloggedIn(true)
        })
        .catch(() => {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
          setIsloggedIn(false)

          router.replace('/login')

          // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
          // }
        })
    }
    initAuth()

    // getSubscriberSubscription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, guard, errorCallback) => {
    setIsPending(true)
    axiosClient
      .post(`/login`, { ...params })
      .then(async response => {
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.result })
        window.localStorage.setItem('userData', JSON.stringify(response.data.result))
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.result)
        setIsloggedIn(true)
        setIsPending(false)
        setErrMsg('')

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)

        if (err?.response?.status == '404') {
          setErrMsg(err?.response?.data?.result)
        } else {
          toast.error(err?.response?.data?.result)
        }

        setIsPending(false)
      })
  }

  const handleLogout = async () => {
    await axiosClient
      .put('/logout')
      .then(async response => {
        setUser(null)
        setIsloggedIn(false)
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)

        router.push('/login')
      })
      .catch(() => {})
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const handleVerifyResetKey = (params, guard, errorCallback) => {
    setIsPending(true)
    axiosClient
      .post(`/verify-reset-key`, { ...params })
      .then(async response => {
        window.localStorage.setItem('code-verify', JSON.stringify(params.code))
        setIsloggedIn(true)
        setIsPending(false)
        setErrMsg('')

        // // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.push('/confirm-password')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)

        setErrMsg(err?.response?.data?.errors)

        toast.error(err?.response?.data?.message)

        setIsPending(false)
      })
  }

  const handleResetPassword = (params, guard, errorCallback) => {
    setIsPending(true)
    axiosClient
      .post(`/reset-password`, { ...params })
      .then(async response => {
        // setUser({ ...response.data.result })
        // window.localStorage.setItem('userData', JSON.stringify(response.data.result))
        // window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.result)
        // setIsloggedIn(true)
        // setIsPending(false)
        // setErrMsg('')
        // // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        // router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)

        setErrMsg(err?.response?.data?.errors)

        toast.error(err?.response?.data?.message)

        setIsPending(false)
      })
  }

  const getSubscriberSubscription = async () => {
    setLoading(true)
    await axiosClient
      .get('/subscription/subscriber-subscription')
      .then(async response => {
        setDetailsSubscriberSubscription(response?.data?.data)
        setLoading(false)
        setIsloggedIn(true)
      })
      .catch(() => {})
  }

  const getAutorizedActionByModel = (model, action) => {
    const listPermissionsByModal = user?.permissions?.find(item => item.resource_name_en === model)
    if (!listPermissionsByModal) return false

    return listPermissionsByModal.permissions.find(item => item.name == `${action} ${model}`)?.authorized ?? false
  }

  // const getAllMarsForCompanie = async () => {
  //   await axiosClient
  //     .get('/companies/getMars')
  //     .then(async response => {
  //       console.log('response', response)
  //     })
  //     .catch(() => {})
  // }

  const values = {
    user,
    isLoggedIn,
    isPending,
    loading,
    errMsg,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    verifyResetKey: handleVerifyResetKey,
    resetPassword: handleResetPassword,
    detailsSubscriberSubscription: detailsSubscriberSubscription,
    getAutorizedActionByModel
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
