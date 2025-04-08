import React from 'react'
import { Card, CardContent, Button, Grid } from '@mui/material'
import { useUpdateProjectState } from 'src/services/project.service'
import { LoadingButton } from '@mui/lab'

const ProjectStatus = ({ projectId }) => {
  const { mutateAsync: updateProjectStateMutation, isPending: updateProejctStateIsPending } = useUpdateProjectState()

  const handleReport = async () => {
    await updateProjectStateMutation({ id: projectId, state: 4 })
  }

  const handleSuspend = async () => {
    await updateProjectStateMutation({ id: projectId, state: 3 })
  }

  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <LoadingButton
        loading={updateProejctStateIsPending}
        size='small'
        variant='contained'
        color='warning'
        onClick={handleReport}
      >
        Rapporter
      </LoadingButton>
      <LoadingButton
        loading={updateProejctStateIsPending}
        size='small'
        variant='contained'
        color='error'
        onClick={handleSuspend}
      >
        Suspendre
      </LoadingButton>
    </Grid>
  )
}

export default ProjectStatus
