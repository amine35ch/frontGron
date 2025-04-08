import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import useDebounce from 'src/hooks/useDebounce'
import { useGetBrands } from 'src/services/brand.service'
import MarqueColum from './MarqueColum'

const ListMarque = () => {
  // const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [state, setState] = useState('')
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 1000)

  // **LIST COLUMNS
  const marqueColumns = MarqueColum({
    userRole: 'admin',
    resource: 'brands',
    resource_name: 'marques'
  })

  const { data, isLoading, isSuccess } = useGetBrands({
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
      columns={marqueColumns}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNew={true}
      addNewLink='/Catalog/brands/create'
      handleChangeState={handleChangeState}
      state={state}
      resource='brands'
      resource_name='Marques'
      total={data?.total}
      showFilter={true}
    />
  )
}

export default ListMarque
