import React, { useEffect, useMemo, useState } from 'react'
import Grid from '@mui/material/Grid'
import CustomVerticalTabs from 'src/components/CustomVerticalTabs'
import { useGetDetailProject, useGetProjectVisitForProjects } from 'src/services/project.service'
import { useRouter } from 'next/router'
import StepDocuments from 'src/components/StepDocuments'
import { Box, Card, CardContent, Divider } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { TabContext, TabPanel } from '@mui/lab'
import CardDetailsProject from '../../components/Cards/CardDetailsProject'
import CrudDataTable from 'src/components/CrudDataTable'
import ProjectVisitColum from '../../project-visit/ProjectVisitColum'
import useTabs from 'src/hooks/useTabs'
import CustomAccordian from 'src/components/CustomAccordian'
import ProjectVisiteTable from '../components/ProjectVisiteTable'
import DetailsProject from '../detailsProject/DetailsProject'
import DetailsClientProject from '../detailsProject/DetailsClientProject'
import DetailsMenageProject from '../detailsProject/DetailsMenageProject'
import DetailsVisiteProject from '../detailsProject/DetailsVisiteProject'
import { useAuth } from 'src/hooks/useAuth'
import Simulator from 'src/views/simulator'

const StepProjectCollaborator = ({}) => {
  // ** Router **
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()

  const { data: listProjectVisit } = useGetProjectVisitForProjects({ id })

  const {
    data: detailsProject,
    isLoading: getDetailsIsLoading,
    isSuccess: getDetailsIsSuccess,
    isFetching: getDetailsIsFetching,
    isRefetching: getDetailsIsRefetching
  } = useGetDetailProject({ id })

  const projectVisitColumn = ProjectVisitColum({
    userRole: user.role.slice(5),
    resource: 'project-visit'
  })

  const hideSimulatorButton = useMemo(() => {
    return detailsProject?.documents?.find(item => item?.p_document_id === 4 && item?.status === 3)?.status
      ? true
      : false
  }, [getDetailsIsSuccess])

  return (
    <>
      <CustomAccordian titleAccordian={'Attachement Documents'}>
        <StepDocuments stepDocuments={detailsProject?.documents} id={detailsProject?.id}  detailsProject={detailsProject} />
      </CustomAccordian>

      <DetailsVisiteProject detailsProject={detailsProject} />
      <DetailsMenageProject detailsProject={detailsProject} />
      <DetailsClientProject detailsProject={detailsProject} />
    </>
  )
}

export default StepProjectCollaborator
