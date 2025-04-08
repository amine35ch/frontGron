import { Grid } from '@mui/material'
import StepDocuments from 'src/components/StepDocuments'
import ProjectStatus from '../../components/ProjectStatus'

const StepWorkOrder = ({ detailsProject }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ProjectStatus projectId={detailsProject?.id} />
      </Grid>
      <Grid item xs={12}>
        <StepDocuments
          detailsProject={detailsProject}
          typeProject={detailsProject?.type}
          stepDocuments={detailsProject?.step_documents}
          id={detailsProject?.id}

        />
      </Grid>
    </Grid>
  )
}

export default StepWorkOrder
