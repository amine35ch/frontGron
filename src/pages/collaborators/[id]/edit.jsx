import React, { useState } from 'react'
import UpdateCollaborators from 'src/views/collaborators/UpdateCollaborators'

const Edit = () => {
  const [listTypeCollab] = useState([
    {
      value: 'inspector',
      entitled: 'Inspecteur'
    },
    {
      value: 'supervisor',
      entitled: 'Superviseur'
    }
  ])

  return <UpdateCollaborators listTypeCollab={listTypeCollab} routerProps={'/collaborators'} />
}

export default Edit
