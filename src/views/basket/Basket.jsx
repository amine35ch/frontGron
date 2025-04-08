import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetBasket } from 'src/services/basket.service'
import BasketColumn from './BasketColumn'
import useDebounce from 'src/hooks/useDebounce'

const Basket = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  const debouncedSearchTerm = useDebounce(search, 1000)

  const { data, isLoading } = useGetBasket({ search, paginated: true, pageSize, page, debouncedSearchTerm })
  

  const basketColumn = BasketColumn({
    userRole: 'admin'
  })

  return (
    <CrudDataTable
      query={data}
      columns={basketColumn}
      data={data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      titleCrud='Corbeilles'
      total={data?.total}
      showFilter={false}
    />
  )
}

export default Basket
