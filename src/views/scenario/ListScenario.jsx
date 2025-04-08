import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import OperationColum from './ScenarioColum'
import useDebounce from 'src/hooks/useDebounce'
import { useGetListScenario } from 'src/services/scenario.service'

const ListScenario = () => {
  // const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [state, setState] = useState('1')
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 1000)

  // **LIST COLUMNS
  const operationColumn = OperationColum({
    userRole: 'admin',
    resource: 'operations'
  })

  const { data, isLoading, isSuccess } = useGetListScenario({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
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
      columns={operationColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNew={true}
      addNewLink='/scenario/create'
      handleChangeState={handleChangeState}
      state={state}
      resource='scenarios'
      resource_name='Scénarios'
      total={data?.total}
      showFilter={true}
    />
  )
}

export default ListScenario
