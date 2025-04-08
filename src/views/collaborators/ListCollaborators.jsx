import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import CollaboratorsColum from './CollaboratorsColum'
import { useGetCollaborators } from 'src/services/collaborators.service'
import useStates from 'src/@core/hooks/useStates'
import useDebounce from 'src/hooks/useDebounce'
import { useGetListCompany } from 'src/services/company.service'
import { useAuth } from 'src/hooks/useAuth'
import { useGetCompaniesUsersSuperviseurInspecteur } from 'src/services/projectVisit.service'

const ListCollaborators = () => {
  const { getStatesByModel } = useStates()
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [role, setrole] = useState('supervisor,inspector')

  const [listTypeCollab, setListTypeCollab] = useState([
    {
      value: 'supervisor',
      entitled: 'Superviseur'
    },
    {
      value: 'inspector',
      entitled: 'Inspecteur'
    }
  ])

  const [arrayStateFilter, setArrayStateFilter] = React.useState([
    {
      title: 'Rôle',
      setState: setrole,
      data: listTypeCollab,
      state: role,
      type: 'select',
      displayOption: 'entitled',
      option: 'value'
    }
  ])
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
    userRole: 'inspector',
    resource: 'users',
    resource_name: 'Utilisateurs',
    recoverPassword: false
  })

  /// **DATA
  const { data, isLoading, isSuccess } = useGetCompaniesUsersSuperviseurInspecteur({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    type: false,
    state,
    profile: 'users',
    role
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
      addNewLink='/collaborators/create'
      resource={`${auth?.user?.profile}::inspectors`}
      resource_name='Utilisateurs'
      titleCrud='Inspecteurs'
      isLoading={isLoading}
      handleChangeState={handleChangeState}
      state={state}
      showFilter={true}
      setState={'supervisor,inspector'}
      filterArray={arrayStateFilter}
      exportList={false}
    />
  )
}

export default ListCollaborators
