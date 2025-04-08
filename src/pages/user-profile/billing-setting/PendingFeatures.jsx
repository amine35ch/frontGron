import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import useStates from 'src/@core/hooks/useStates'
import useDebounce from 'src/hooks/useDebounce'
import { useGetSubscriberFeaturesExtra } from 'src/services/subscription.service'
import PendingFeaturesColumns from './PendingFeaturesColumns'

const PendingFeatures = () => {
  const { getStatesByModel } = useStates()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('0')

  const debouncedSearchTerm = useDebounce(search, 1000)

  //** Query */

  const {
    data: listFeaturesExtra,
    isPending,
    isError
  } = useGetSubscriberFeaturesExtra({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    state
  })

  // **LIST COLUMNS
  const pendingFeatureColumn = PendingFeaturesColumns({
    userRole: 'admin'
  })

  return (
    <>
      <CrudDataTable
        query={listFeaturesExtra?.data}
        columns={pendingFeatureColumn}
        data={listFeaturesExtra?.data?.data}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        search={search}
        searchState={state}
        setSearch={setSearch}
        state={state}
        isLoading={isPending}
        resource_name='Fonctionnalités en attente'
        total={listFeaturesExtra?.data?.length}
        showFilter={false}
        exportList={false}
        addNew={false}
      />
    </>
  )
}

export default PendingFeatures
