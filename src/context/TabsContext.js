import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'

const TabsContext = createContext()

const TabsProvider = ({ children }) => {
  const router = useRouter()
  const [tabs, setTabs] = useState([])
  const [activeTab, setActiveTab] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [baseEndPoint, setBaseEndPoint] = useState(null)

  useEffect(() => {
    const clearTabs = () => {
      setTabs([])
      setActiveTab(null)
      setEndPoint(null)
    }

    if (!router.pathname.includes(baseEndPoint)) {
      clearTabs()
    }
  }, [router.pathname])

  const addTabs = newTabs => {
    setTabs([...newTabs])
  }

  const updateTab = (tabIndex, tabContent) => {
    setTabs(prev =>
      prev.map((tab, index) => {
        if (index === tabIndex) {
          return { ...tabContent }
        }

        return { ...tab }
      })
    )
  }

  const navigateAndSetActiveTab = async tabKey => {
    if (router.pathname !== endPoint) await router.push(endPoint)
    setActiveTab(tabKey)
  }

  const initTabs = async (newTabs, tabKey, newEndPoint, newBaseEndPoint) => {

    setTabs(newTabs)
    setActiveTab(tabKey)
    setBaseEndPoint(newBaseEndPoint)
    setEndPoint(newEndPoint)
  }


  return (
    <TabsContext.Provider
      value={{ navigateAndSetActiveTab, initTabs, setEndPoint, setActiveTab, activeTab, addTabs, tabs, updateTab }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export { TabsContext, TabsProvider }
