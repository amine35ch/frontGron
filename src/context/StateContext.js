import { createContext, useEffect, useState } from 'react'
import axiosClient from 'src/axiosClient'
import { useAuth } from 'src/hooks/useAuth'

const StateContext = createContext()

const StateProvider = ({ children }) => {
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true)
  const auth = useAuth()

  useEffect(() => {
    const initState = async () => {
      await axiosClient
        .get('/states')
        .then(async response => {
          setStates([...response.data])
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
    auth.isLoggedIn && initState()
  }, [auth.isLoggedIn])

  const getStateByModel = (model, state) => {
    return states.find(item => item.state === state && item.model === model)
  }

  const getStatesByModel = model => {
    return states.filter(item => item.model === model)
  }

  // const getPreferences = () => {
  //   return getPreferencesQuery?.data
  // }

  return (
    <StateContext.Provider value={{ states, loading, getStateByModel, getStatesByModel }}>
      {children}
    </StateContext.Provider>
  )
}

export { StateContext, StateProvider }
