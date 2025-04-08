import { useState } from 'react'

import useDebounce from 'src/hooks/useDebounce'
import { useGetEmails } from 'src/services/company.service'
import EmailsTableColumns from '../emails-table-columns'
import CrudDataTable from 'src/components/CrudDataTable'

function EmailsTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  const debouncedSearchTerm = useDebounce(search, 1000)

  const { data, isFetching } = useGetEmails({
    page,
    pageSize,
    search: debouncedSearchTerm,
    paginated: true
  })

  const emailsTableColumns = EmailsTableColumns()

  return (
    <CrudDataTable
      query={data}
      columns={emailsTableColumns}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isFetching}
      resource='emails'
      resource_name='emails'
      titleCrud='notifications'
      total={data?.total}
      showFilter={false}
      exportList={false}
      btnImport={false}
      showBtnAdd={false}
      identifier='emails'
    />
  )
}

export default EmailsTable
