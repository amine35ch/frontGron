import React from 'react'
import { useState } from 'react'
import { useGetLogs } from 'src/services/settings.service'
import LogsColum from './LogsColum'
import useDebounce from 'src/hooks/useDebounce'
import CrudDataTable from 'src/components/CrudDataTable'

const Logs = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)
  const debouncedSearchTerm = useDebounce(search, 1000)

  const [arrayStateFilter, setArrayStateFilter] = React.useState([
    {
      title: 'Date',
      setStartDateRange: setStartDateRange,
      setEndDateRange: setEndDateRange,
      startDateRange: startDateRange,
      endDateRange: endDateRange,
      type: 'date'
    }
  ])

  const { data, isLoading } = useGetLogs({
    search,
    paginated: true,
    pageSize,
    page,
    debouncedSearchTerm,
    startDateRange,
    endDateRange
  })

  const logsColumn = LogsColum({
    userRole: 'admin',
    resource: 'Clients'
  })

  const handeleRemoveFilter = () => {
    setStartDateRange(null)
    setEndDateRange(null)
  }

  return (
    <CrudDataTable
      query={data}
      columns={logsColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      titleCrud='Logs'
      total={data?.total}
      showFilter={true}
      resource_name='logs'
      filterArray={arrayStateFilter}
      handeleRemoveFilter={handeleRemoveFilter}
    />
  )
}

export default Logs
