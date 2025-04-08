import { Box, Grid } from '@mui/material'
import CustomAccordian from 'src/components/CustomAccordian'
import StepDocuments from 'src/components/StepDocuments'
import SyntheseAudit from '../../form/SyntheseAudit'

const StepAuditRapport = ({ id, detailsProject }) => {
  return (
    <Grid container className='!mt-3' spacing={4}>
      <Grid item xs={12}>
        <CustomAccordian open={false} titleAccordian={'Liste des Documents'}>
          <Box mt={5}>
            <StepDocuments
              typeProject={detailsProject?.type}
              stepDocuments={detailsProject?.step_documents}
              id={detailsProject?.id}
              detailsProject={detailsProject}
            />
          </Box>
        </CustomAccordian>
      </Grid>
      <Grid container spacing={2} p={5}>
        <Grid item xs={12}>
          <CustomAccordian open={true} titleAccordian={'Synthèse Audit'}>
            <Box mt={5}>
              <SyntheseAudit
                noBorder={true}
                redirect={false}
                idProject={detailsProject?.id}
                detailsProject={detailsProject}
              />
            </Box>
          </CustomAccordian>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default StepAuditRapport
