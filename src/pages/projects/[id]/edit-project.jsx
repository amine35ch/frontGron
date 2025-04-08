import { useRouter } from 'next/router'
import React from 'react'
import { useGetDetailProject } from 'src/services/project.service'
import CreateProject from 'src/views/Projects/CreateProject/CreateProject'

const EditProject = () => {
  const router = useRouter()
  const { id } = router.query

  const {
    data: detailsProject,
    isLoading: getDetailsIsLoading,
    isSuccess: getDetailsIsSuccess,
    isFetching: getDetailsIsFetching,
    isRefetching: getDetailsIsRefetching
  } = useGetDetailProject({ id })

  return <CreateProject update={true} detailsProject={detailsProject} getDetailsIsSuccess={getDetailsIsSuccess} />
}

export default EditProject
