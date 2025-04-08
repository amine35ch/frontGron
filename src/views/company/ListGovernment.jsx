import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetGovernmentUsers } from 'src/services/government.service'
import GovernmentColumn from './GovernmentColumn'
import { useAuth } from 'src/hooks/useAuth'

const ListGovernment = () => {
  const auth = useAuth()

  // ** STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // ** LIST COLUMNS
  const governmentColumns = GovernmentColumn({
    userRole: 'admin',
    resource: 'government'
  })

  const { data, isLoading, isSuccess } = useGetGovernmentUsers({
    search,
    paginated: true,
    pageSize,
    page,
    type: false,
    profile: 'mars',
    id: auth?.user?.userable_id
  })

  return (
    <CrudDataTable
      query={data}
      columns={governmentColumns}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNewLink='/government/create'
      addNew={true}
      resource='governments'
      resource_name='Gouvernement'
      total={data?.total}
      showFilter={false}
    />
  )
}

export default ListGovernment
