import React, { useEffect, useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'

import useStates from 'src/@core/hooks/useStates'
import useDebounce from 'src/hooks/useDebounce'
import { useGetListCompany } from 'src/services/company.service'
import CollaboratorsColum from 'src/views/collaborators/CollaboratorsColum'
import { useAuth } from 'src/hooks/useAuth'

const ListUserCollab = () => {
  const { getStatesByModel } = useStates()
  const { user } = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [role, setrole] = useState('')
  const [identifiant, setIdentifiant] = useState('1')

  const [listTypeCollab, setListTypeCollab] = useState([
    {
      value: 'admin',
      entitled: 'Admin'
    },
    {
      value: 'collaborator',
      entitled: 'Collaborateur'
    },

    // {
    //   value: 'installers',
    //   entitled: 'Entreprise retenue'
    // },
    {
      value: 'inspector',
      entitled: 'Inspecteur'
    },
    {
      value: 'supervisor',
      entitled: 'Superviseur'
    }
  ])

  const [arrayStateFilter, setArrayStateFilter] = React.useState([
    {
      title: 'Role',
      setState: setrole,
      data: listTypeCollab,
      state: role,
      type: 'select',
      displayOption: 'entitled',
      option: 'value',
      value: role
    }
  ])


  useEffect(() => {
    setArrayStateFilter([
      {
        title: 'Rôle',
        setState: setrole,
        data: listTypeCollab,
        state: role,
        type: 'select',
        displayOption: 'entitled',
        option: 'value',
        value: role
      },
      {
        title: 'Identifiant',
        setState: setIdentifiant,
        state: identifiant,
        type: 'switch',
        value: identifiant
      }
    ])
  }, [role, identifiant])

  const [state, setState] = useState('1')

  const debouncedSearchTerm = useDebounce(search, 1000)

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  // **LIST COLUMNS
  const CollaboratorsColumn = CollaboratorsColum({
    userRole: 'admin',
    resource: 'MAR::admins',
    resource_name: 'Utilisateurs',
    recoverPassword: true,

    identifiant
  })

  /// **DATA
  const { data, isLoading, isSuccess } = useGetListCompany({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    type: false,
    state,
    profile: 'users',
    role,
    identifiant
  })


  return (
    <CrudDataTable
      query={data}
      columns={CollaboratorsColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={true}
      addNewLink='/company/users/create'
      resource={`${user.profile}::admins`}
      resource_name='Utilisateurs'
      isLoading={isLoading}
      handleChangeState={handleChangeState}
      state={state}
      showFilter={true}
      setState={''}
      filterArray={arrayStateFilter}
    />
  )
}

export default ListUserCollab
