import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'

import useDebounce from 'src/hooks/useDebounce'
import { useGetListScenario } from 'src/services/scenario.service'
import TraveauxColum from './TraveauxColum'
import { useGetWorks } from 'src/services/work.service'

const ListTraveaux = () => {
  // const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [state, setState] = useState('')
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 1000)
  const [showAll, setShowAll] = useState('1')

  // **LIST COLUMNS
  const traveauxColumn = TraveauxColum({
    userRole: 'admin',
    resource: 'works',
    resource_name: 'Travaux'
  })

  const { data, isLoading, isSuccess } = useGetWorks({
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
      columns={traveauxColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNew={false}
      addNewLink='/works/create'
      handleChangeState={handleChangeState}
      state={state}
      resource='works'
      resource_name='travaux'
      total={data?.total}
      showFilter={true}
      showAllSection={true}
      showAll={showAll}
      setShowAll={setShowAll}
      exportList={false}
      setState={setState}
    />
  )
}

export default ListTraveaux
