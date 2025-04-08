import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetClients } from 'src/services/client.service'
import CLientColum from './CLientColum'
import { Card, CardContent } from '@mui/material'

const ListMenage = () => {
  // const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const clientColumn = CLientColum({
    userRole: 'admin',
    resource: 'Clients'
  })

  /// **DATA
  const get_client_query = null

  //  useGetClients({ search, paginated: true, pageSize, page, type: false })
  const dataClient = []


  return (
    <CrudDataTable
      query={get_client_query}
      columns={clientColumn}
      data={dataClient}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNewLink='/project/create'
      resource='Ménage'
      resource_name='Projets'
      showFilter={true}
    />
  )
}

export default ListMenage
