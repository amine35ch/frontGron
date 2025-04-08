import { Grid } from '@mui/material'
import StepDocuments from 'src/components/StepDocuments'
import PrevWrokDate from '../../form/PrevWrokDate'

const StepGenerateDocumentsAfterMarValidation = ({ detailsProject }) => {
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
      <Grid item xs={12} mt={3}>
        <PrevWrokDate
          id={detailsProject?.id}
          detailsProject={detailsProject}
          titleBtn={'Enregistrer'}
          variant={'outlined'}
          color='secondary'
        />
      </Grid>
    </Grid>
  )
}

export default StepGenerateDocumentsAfterMarValidation
