import React from 'react'
import { useAuth } from 'src/hooks/useAuth'
import MarDash from 'src/views/dashboards/MarDash/MarDash'
import InstallatorDash from 'src/views/dashboards/InstallatorDash/InstallatorDash'
import AuditDash from 'src/views/dashboards/AuditDash/AuditDash'

const Index = () => {
  const auth = useAuth()

  const renderDashboard = () => {
    switch (auth?.user?.profile) {
      case 'MAR':
      case 'VAE':
        return <MarDash />
      case 'INS':
        return <InstallatorDash />
      case 'AUD':
        return <AuditDash />
      default:
        return <div>Error: Unknown role</div>
    }
  }

  return <div>{renderDashboard()}</div>
}

export default Index
