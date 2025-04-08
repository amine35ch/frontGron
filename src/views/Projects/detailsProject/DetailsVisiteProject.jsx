import React from 'react'
import CustomAccordian from 'src/components/CustomAccordian'

import SimpleCrudDataTable from 'src/components/SimpleCrudDataTable'

import VisitesColumn from '../VisitesColumn'
import ProjectVisiteTable from '../components/ProjectVisiteTable'
import ProjectVisitColum from 'src/views/project-visit/ProjectVisitColum'
import { useGetProjectVisitForProjects } from 'src/services/project.service'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

const DetailsVisiteProject = ({ detailsProject }) => {
  const router = useRouter()
  const { user } = useAuth()
  const { id } = router.query
  const { data: listProjectVisit } = useGetProjectVisitForProjects({ id })

  const projectVisitColumn = ProjectVisitColum({
    userRole: user.role.slice(5),
    resource: 'project-visit'
  })

  return listProjectVisit?.length === 0 ? (
    <></>
  ) : (
    <CustomAccordian titleAccordian={'Liste des visites '}>
      <div className='p-5'>
        <ProjectVisiteTable projectVisitColumn={projectVisitColumn} listProjectVisit={listProjectVisit} />

        {/* <SimpleCrudDataTable
          query={null}
          columns={visitesColumn}
          data={detailsProject?.visits}
          page={1}
          total={detailsProject?.visits?.length}
          titleCrud={'visites'}
        /> */}
      </div>
    </CustomAccordian>
  )
}

export default DetailsVisiteProject
