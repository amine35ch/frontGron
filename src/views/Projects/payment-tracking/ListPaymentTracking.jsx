import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetListPaymentTracking } from 'src/services/project.service'

import useDebounce from 'src/hooks/useDebounce'
import PaymentTrackingColumn from './PaymentTrackingColumn'

const ListPaymentTracking = ({}) => {
  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const paymentColumn = PaymentTrackingColumn({
    userRole: 'admin',
    resource: 'Projet'
  })
  const debouncedSearchTerm = useDebounce(search, 1000)

  /// **DATA
  const { data, isLoading } = useGetListPaymentTracking({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page
  })

  return (
    <CrudDataTable
      query={data}
      columns={paymentColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      resource='projects'
      resource_name='Projets'
      total={data?.total}
      isLoading={isLoading}
      titleCrud={'Suivi de paiement'}
      exportList={false}
      addNew={false}
      showFilter={false}
    />
  )
}

export default ListPaymentTracking
