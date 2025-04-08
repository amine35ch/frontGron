import React from 'react'

import { Grid } from '@mui/material'

import StepDocuments from 'src/components/StepDocuments'

const StepGenerateBonTravail = ({ id, detailsProject }) => {
  return (
    <Grid container className='!mt-3' spacing={4}>
      <Grid item xs={12}>
        <StepDocuments
          typeProject={detailsProject?.type}
          stepDocuments={detailsProject?.step_documents}
          id={detailsProject?.id}
          detailsProject={detailsProject}
        />
      </Grid>
    </Grid>
  )
}

export default StepGenerateBonTravail
