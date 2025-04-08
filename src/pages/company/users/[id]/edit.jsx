import React, { useState } from 'react'
import UpdateCollaborators from 'src/views/collaborators/UpdateCollaborators'
import UpdateCompany from 'src/views/company/UpdateCompany'

const Edit = () => {
  const [listTypeCollab] = useState([
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
  ])

  return <UpdateCollaborators listTypeCollab={listTypeCollab} routerProps={'/company/'} />
}

export default Edit
