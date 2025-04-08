import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetListCompany } from 'src/services/company.service'
import CompanyColum from './CompanyColum'
import { useAuth } from 'src/hooks/useAuth'

const ListCompany = () => {
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const companyColum = CompanyColum({
    userRole: 'admin',
    resource: 'company'
  })

  const { data, isLoading, isSuccess } = useGetListCompany({
    search,
    paginated: true,
    pageSize,
    page,
    type: false,
    profile: 'mars', id: auth?.user?.userable_id
  })

  return (
    <CrudDataTable
      query={data}
      columns={companyColum}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNewLink='/company/create'
      resource='company'
      resource_name='Société'
      total={data?.total}
      showFilter={true}
    />
  )
}

export default ListCompany
