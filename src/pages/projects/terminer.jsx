import React from 'react'
import { useAuth } from 'src/hooks/useAuth'
import ListProject from 'src/views/Projects/ListProject'

const Terminé = () => {
  const { user } = useAuth()

  const listPermissions = user?.permissions?.find(item => item.resource_name === 'Abonnement')

  const authorizedList = listPermissions?.permissions.find(item => item.name == `store subscription invoice`)

  return <ListProject state={2} withCheckbox={false} showAllColumn={true} />
}

export default Terminé
