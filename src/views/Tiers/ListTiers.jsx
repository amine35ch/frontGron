import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'

import TiersColum from './TiersColum'
import { useGetTiers } from 'src/services/tiers.service'
import { useGetListOperation } from 'src/services/operation.service'
import useDebounce from 'src/hooks/useDebounce'

const ListTiers = () => {
  // const auth = useAuth()

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
  const TiersColumn = TiersColum({
    userRole: 'admin',
    resource: 'Tiers'
  })

  const { data, isLoading, isSuccess } = useGetTiers({
    search,
    paginated: true,
    pageSize,
    page,
    type: 1,
    state,
    operations,
    entreprise,
    debouncedSearchTerm
  })
  const { data: listOperation } = useGetListOperation({ paginated: false })
  const { data: listEntreprise } = useGetTiers({ paginated: false, type: 2 })

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  React.useEffect(() => {
    setArrayStateFilter([
      {
        title: 'Opération',
        setState: setOperations,
        data: listOperation,
        state: operations,
        attribute: 'state',
        type: 'select',
        option: 'type',
        displayOption: 'reference'
      },
      {
        title: 'Enterprise ',
        setState: setEntreprise,
        data: listEntreprise,
        state: entreprise,
        attribute: 'status',
        type: 'select',
        option: 'id',
        displayOption: 'reference'
      }
    ])
  }, [listOperation, listEntreprise])

  return (
    <CrudDataTable
      query={data}
      columns={TiersColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNewLink='/auditor/create'
      resource='auditor'
      resource_name='Auditeur'
      handleChangeState={handleChangeState}
      state={state}
      filterArray={arrayStateFilter}
      showFilter={true}
    />
  )
}

export default ListTiers
