import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetListOperation } from 'src/services/operation.service'
import OperationColum from './OperationColum'
import useDebounce from 'src/hooks/useDebounce'

const ListOperation = () => {
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

  const { data, isLoading, isSuccess } = useGetListOperation({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    intern: '',
    scenario: '',
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
      addNew={false}
      handleChangeState={handleChangeState}
      state={state}
      resource='operations'
      resource_name='operations'
      showFilter={true}
    />
  )
}

export default ListOperation
