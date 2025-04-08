import { Grid } from '@mui/material'
import StepDocuments from 'src/components/StepDocuments'

const StepStartWorkPlanned = ({ detailsProject }) => {
  return (
    <Grid container className='!mt-3' spacing={4}>
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

export default StepStartWorkPlanned
