import { useContext } from 'react'
import { TabsContext } from 'src/context/TabsContext'

const useTabs = () => {
  // const { addTabs, tabs, clearTabs } = useContext(TabsContext)

  return useContext(TabsContext)
}

export default useTabs
