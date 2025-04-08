import React from 'react'
import { LoadingButton } from '@mui/lab'

import { Grid, Card, CardContent, CardHeader, Typography, Box } from '@mui/material'
import { useGenerateDocument } from 'src/services/project.service'
import ListItemsFiles from 'src/components/ListItemsFiles'
import StepDocuments from 'src/components/StepDocuments'
import ProjectMarInvoice from '../../form/InvoiceMar'
import CustomAccordian from 'src/components/CustomAccordian'

const StepThreeGenerateDocument = ({ id, detailsProject }) => {
  return (
    <Grid container className='!mt-3' spacing={4}>
      <Grid item xs={12}>
        <CustomAccordian open={false} titleAccordian={'Liste des documents'}>
          <StepDocuments
            detailsProject={detailsProject}
            typeProject={detailsProject?.type}
            stepDocuments={detailsProject?.step_documents}
            id={detailsProject?.id}
          />
        </CustomAccordian>
      </Grid>
      <Grid item xs={12}>
        <CustomAccordian open={true} titleAccordian={'Devis Accompagnateur rénov'}>
          <Box mt={5}>
            <ProjectMarInvoice id={id} detailsProject={detailsProject} />
          </Box>
        </CustomAccordian>
      </Grid>
    </Grid>
  )
}

export default StepThreeGenerateDocument
