// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { useModal } from 'src/context/ModelInfoContext'
import InfoModal from 'src/components/InfoModal'
import axiosClient from 'src/axiosClient'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modelData, setModelData] = useState({})

  useEffect(() => {
    const checkModalStatus = async () => {
      try {
        const response = await axiosClient.get('general-notifications/latest')
        const { display } = response.data

        if (display) {
          setIsModalOpen(true)
          setModelData({ ...response.data })
        }
      } catch (error) {
        console.error('Error fetching modal status:', error)
      }
    }

    checkModalStatus()
  }, [])

  const handleCloseModal = async () => {
    setIsModalOpen(false)
    try {
      await axiosClient.put('/general-notifications/seen')
    } catch (error) {
      console.error('Error updating modal status:', error)
    }
  }

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      if (!auth.loading && auth.user === null && !auth.isLoggedIn) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  // if (process.env.NODE_ENV === 'production') {
  //   const currentPath = router.asPath
  //   const isAllowed = allowedPageUrls.some(path => currentPath.startsWith(path))
  //   if (!isAllowed) {
  //     router.push('/dashboards/analytics')

  //     return fallback
  //   }
  // }
  if (auth.loading || !auth.isLoggedIn) {
    return fallback
  }

  return (
    <>
      {children}
      <InfoModal modelData={modelData} open={isModalOpen} handleClose={handleCloseModal} />
      {/* <InfoModal modelData={modelData} open={isModalOpen} handleClose={handleCloseModal} /> */}
    </>
  )
}

export default AuthGuard
