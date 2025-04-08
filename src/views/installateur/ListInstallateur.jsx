import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetEntreprise, useGetTiers } from 'src/services/tiers.service'
import EntrepriseColum from './EntrepriseColum'
import useDebounce from 'src/hooks/useDebounce'
import { useGetListCompany } from 'src/services/company.service'
import { useAuth } from 'src/hooks/useAuth'

const ListEntreprise = () => {
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState(1)
  const [arrayStateFilter, setArrayStateFilter] = React.useState([])
  const [operations, setOperations] = useState(null)
  const debouncedSearchTerm = useDebounce(search, 1000)

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  // **LIST COLUMNS
  const entrepriseColumn = EntrepriseColum({
    userRole: 'admin',
    resource: 'installers',
    resource_name: 'Installateurs'
  })

  const { data, isLoading, isSuccess } = useGetListCompany({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    type: 'ins',
    profile: 'installers',
    id: auth?.user?.userable_id,
    state
  })

  return (
    <CrudDataTable
      query={data}
      columns={entrepriseColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNewLink='/entreprise/create'
      resource='installers'
      resource_name='Installateurs'
      titleCrud='Entreprises retenue '
      handleChangeState={handleChangeState}
      state={state}
      total={data?.total}
      showFilter={true}
      exportList={false}
      btnImport={true}
      identifier={"installers"}
    />
  )
}

export default ListEntreprise
