import React, { useState } from 'react'
import CreateCollaborators from 'src/views/collaborators/CreateCollaborators'

const Create = () => {
  const [listTypeInspector] = useState([
    {
      value: 'inspector',
      entitled: 'Inspecteur'
    },
    {
      value: 'supervisor',
      entitled: 'Superviseur'
    }
  ])

  return <CreateCollaborators listTypeInspector={listTypeInspector} routerProps={'/collaborators'} />
}

export default Create
