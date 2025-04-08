import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import ProjectVisitColum from './ProjectVisitColum'
import { useGetProjectVisit } from 'src/services/projectVisit.service'

const ListProjectVisit = () => {
  const {user} = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const projectVisitColumn = ProjectVisitColum({
    userRole: user.role.slice(5),
    resource: 'project-visit'
  })
  const { data, isLoading, isSuccess } = useGetProjectVisit({ search, paginated: true, pageSize, page, type: false })

  return (
    <CrudDataTable
      query={data}
      columns={projectVisitColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNewLink='/project-visit/create'
      resource='project-visit'
      resource_name='Projets Visite'
      showFilter={true}
    />
  )
}

export default ListProjectVisit
