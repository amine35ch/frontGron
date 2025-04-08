import { useContext } from 'react'
import { StateContext } from 'src/context/StateContext'

const useStates = () => {
  const { states, loading, getStateByModel, getStatesByModel } = useContext(StateContext)

  return {
    states,
    loading,
    getStateByModel,
    getStatesByModel
  }
}

export default useStates
