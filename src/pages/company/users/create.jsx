import React, { useState } from 'react'
import { useGetCompanyAvailableRoles } from 'src/services/settings.service'
import CreateCollaborators from 'src/views/collaborators/CreateCollaborators'

const Create = () => {
  const { data: companyAvailabelRolesData } = useGetCompanyAvailableRoles()

  const listTypeInspector = [
    {
      value: 'admin',
      entitled: 'Admin'
    },
    {
      value: 'collaborator',
      entitled: 'Collaborateur'
    },
    {
      value: 'inspector',
      entitled: 'Inspecteur'
    },
    {
      value: 'supervisor',
      entitled: 'Superviseur'
    }
  ]

  return (
    <CreateCollaborators
      defaultRole={'collaborator'}
      listTypeInspector={companyAvailabelRolesData ?? []}
      routerProps={'/company'}
    />
  )
}

export default Create
