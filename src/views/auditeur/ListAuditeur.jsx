import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'

import useDebounce from 'src/hooks/useDebounce'
import AuditeurColumn from './AuditeurColumn'
import { useGetListCompany } from 'src/services/company.service'
import { useAuth } from 'src/hooks/useAuth'

const ListAuditeur = () => {
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState(1)
  const [operations, setOperations] = useState(null)
  const [entreprise, setEntreprise] = useState(null)
  const [arrayStateFilter, setArrayStateFilter] = React.useState([])
  const debouncedSearchTerm = useDebounce(search, 1000)

  // **LIST COLUMNS
  const auditeurColumn = AuditeurColumn({
    userRole: 'admin',
    resource: 'auditors',
    resource_name: 'Auditeurs'
  })

  const { data, isLoading, isSuccess } = useGetListCompany({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    type: 'aud',
    profile: 'auditors',
    id: auth?.user?.userable_id,
    state
  })

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  return (
    <CrudDataTable
      query={data}
      columns={auditeurColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNewLink='/auditor/create'
      resource='auditors'
      resource_name='Auditeurs'
      handleChangeState={handleChangeState}
      state={state}
      total={data?.total}
      showFilter={true}
      exportList={false}
      btnImport={true}
      identifier={'auditors'}
    />
  )
}

export default ListAuditeur
