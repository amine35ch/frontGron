import React, { useState } from 'react'
import PaymentsMethode from './PaymentsMethode'
import ListFactures from './ListFactures'
import CustomCurrentPlan from './CustomCurrentPlan'
import TabsFacturations from './TabsFacturations'
import { useAuth } from 'src/hooks/useAuth'

const Billingsetting = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Factures')

  const [tabs] = useState([
    {
      name: 'Factures',
      icon: 'mdi:credit-card-outline'
    },
    { name: 'Dossiers', icon: 'ph:folder-bold' }

    // { name: 'Fonctionnalités en attente', icon: 'entypo:circular-graph' }
  ])

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }
  const listPermissions = user?.permissions?.find(item => item.resource_name === 'Abonnement').authorized

  // const authorizedList = listPermissions?.permissions.find(item => item.name == `store subscription invoice`)

  return (
    <div>
      <CustomCurrentPlan />
      {listPermissions && <PaymentsMethode />}

      {listPermissions && <TabsFacturations tabs={tabs} activeTab={activeTab} handleChange={handleChange} />}
    </div>
  )
}

export default Billingsetting
