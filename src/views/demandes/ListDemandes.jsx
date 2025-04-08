import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetListProject } from 'src/services/project.service'
import DemandesColumn from './DemandesColumn'
import useDebounce from 'src/hooks/useDebounce'

const ListDemandes = () => {
  // const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 1000)

  // **LIST COLUMNS
  const demandeColumn = DemandesColumn({
    userRole: 'admin',
    resource: 'Demandes'
  })

  /// **DATA
  const { data, isLoading } = useGetListProject({ debouncedSearchTerm, paginated: true, pageSize, page, type: '0' })

  return (
    <CrudDataTable
      query={data}
      columns={demandeColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={true}
      addNewLink='/demandes/create'
      resource='Demandes'
      resource_name='Demandes'
      showFilter={true}
    />
  )
}

export default ListDemandes
