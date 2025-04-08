import { useEffect, useState } from 'react'

import { useGetAllMars, useGetRootCompanies } from 'src/services/root-access.service'
import CrudDataTable from 'src/components/CrudDataTable'
import useDebounce from 'src/hooks/useDebounce'

import BusinessListColumns from '../business-list-columns'

function BusinessList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('1')
  const [type, setType] = useState(1)
  const [marId, setMarId] = useState(null)

  const [filterArray, setFilterArray] = useState([])

  const debouncedSearchTerm = useDebounce(search, 1000)

  const handleChangeState = value => setState(value ? '1' : '0')

  const { data, isFetching } = useGetRootCompanies({
    page,
    pageSize,
    search: debouncedSearchTerm,
    paginated: true,
    state,
    type,
    company: marId
  })
  const { data: mars, isLoading: isLoadingMars } = useGetAllMars()

  const businessListColumns = BusinessListColumns()

  useEffect(() => {
    if (mars) {
      setFilterArray([
        {
          title: 'Mars',
          setState: setMarId,
          state: marId,
          value: marId,
          option: 'id',
          displayOption: 'trade_name',
          data: mars
        },
        {
          title: 'Type',
          setState: setType,
          state: type,
          value: type,
          option: 'value',
          displayOption: 'entitled',
          data: [
            {
              entitled: 'Tous',
              value: 1
            },
            {
              entitled: 'Auditeurs',
              value: 2
            },
            {
              entitled: 'Entreprises',
              value: 3
            }
          ]
        }
      ])
    }
  }, [mars, type])

  return (
    <CrudDataTable
      query={data}
      columns={businessListColumns}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isFetching || isLoadingMars}
      resource='installers'
      resource_name='Installateurs'
      titleCrud='Entreprises'
      total={data?.total}
      showFilter
      exportList={false}
      btnImport={false}
      showBtnAdd={false}
      identifier={'installers'}
      state={state}
      handleChangeState={handleChangeState}
      filterArray={filterArray}
      filterEnabled={marId || type}
    />
  )
}

export default BusinessList
