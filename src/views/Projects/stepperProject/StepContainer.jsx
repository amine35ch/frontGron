import React from 'react'
import { Grid, Typography } from '@mui/material'
import StepTwo from './steps/StepTwo'
import StepThreeGenerateDocument from './steps/StepThreeGenerateDocument'
import StepAppointmentMarAndTech from './steps/StepAppointmentMarAndTech'
import StepFillShuttleCard from './steps/StepFillShuttleCard'
import PriceOfferAndContract from './steps/PriceOfferAndContract'
import StepValidationDocumentsBeforeVisit from './steps/StepValidationDocumentsBeforeVisit'
import StepDesignationAgent from './steps/StepDesignationAgent'
import StepFinaleSetupWork from './steps/StepFinaleSetupWork'
import DevisTravaux from 'src/views/DevisTravaux/DevisTravaux'
import StepGenerateDocumentsAfterMarValidation from './steps/StepGenerateDocumentsAfterMarValidation'
import StepWorkOrder from './steps/StepWorkOrder'
import StepStartWorkPlanned from './steps/StepStartWorkPlanned'
import StepGenerateReceptionSiteInspection from './steps/StepGenerateReceptionSiteInspection'
import StepGenerateAccompaniementInvoice from './steps/StepGenerateAccompaniementInvoice'
import StepKeyDocuments from './steps/StepKeyDocuments'
import StepTrackPayments from './steps/StepTrackPayments'
import StepAuditRapport from './steps/StepAuditRapport'
import StepAnahResponse from './steps/StepAnahResponse'

const steps = {
  StepSimulator: {
    component: detailsProject => <StepTwo detailsProject={detailsProject} />
  },

  StepGenerateInitialDocument: {
    component: detailsProject => <StepThreeGenerateDocument id={detailsProject?.id} detailsProject={detailsProject} />
  },

  StepDesignationAgent: {
    component: detailsProject => <StepDesignationAgent id={detailsProject?.id} detailsProject={detailsProject} />
  },

  StepAppointmentMarAndTech: {
    component: detailsProject => <StepAppointmentMarAndTech id={detailsProject?.id} detailsProject={detailsProject} />
  },

  StepOfferPriceAndContract: {
    component: detailsProject => <PriceOfferAndContract id={detailsProject?.id} detailsProject={detailsProject} />
  },

  StepFillShuttleCard: {
    component: detailsProject => <StepFillShuttleCard id={detailsProject?.id} detailsProject={detailsProject} />
  },
  StepValidationDocumentsBeforeVisit: {
    component: detailsProject => (
      <StepValidationDocumentsBeforeVisit id={detailsProject?.id} detailsProject={detailsProject} />
    )
  },

  StepAuditRapport: {
    component: detailsProject => <StepAuditRapport id={detailsProject?.id} detailsProject={detailsProject} />
  },

  StepAttachmentsOfVerifications: {
    component: detailsProject => <StepFinaleSetupWork id={detailsProject?.id} detailsProject={detailsProject} />
  },
  StepInstallerQuotationVerification: {
    component: (detailsProject, refetchProject) => (
      <DevisTravaux
        id={detailsProject?.id}
        detailsProject={detailsProject}
        editableUser={true}
        refetchProject={refetchProject}
      />
    )
  },
  StepDepotAnnah: {
    component: detailsProject => <StepKeyDocuments depot={1} id={detailsProject?.id} detailsProject={detailsProject} />
  },
  StepGenerateDocumentsAfterMarValidation: {
    component: detailsProject => (
      <StepGenerateDocumentsAfterMarValidation id={detailsProject?.id} detailsProject={detailsProject} />
    )
  },
  StepWorkOrder: {
    component: detailsProject => <StepWorkOrder id={detailsProject?.id} detailsProject={detailsProject} />
  },
  StepStartWorkPlanned: {
    component: detailsProject => <StepStartWorkPlanned id={detailsProject?.id} detailsProject={detailsProject} />
  },

  StepGenerateReceptionSiteInspection: {
    component: detailsProject => (
      <StepGenerateReceptionSiteInspection id={detailsProject?.id} detailsProject={detailsProject} />
    )
  },
  StepGenerateAccompaniementInvoice: {
    component: detailsProject => (
      <StepGenerateAccompaniementInvoice id={detailsProject?.id} detailsProject={detailsProject} />
    )
  },

  StepKeyDocuments: {
    component: detailsProject => <StepKeyDocuments depot={2} id={detailsProject?.id} detailsProject={detailsProject} />
  },
  StepTrackPayment: {
    component: detailsProject => <StepTrackPayments id={detailsProject?.id} detailsProject={detailsProject} />
  },

  StepAnahResponse: {
    component: detailsProject => <StepAnahResponse id={detailsProject?.id} detailsProject={detailsProject} />
  }
}

const StepContainer = ({ listSteps, isSuccess, nameActiveStep, detailsProject, refetchProject = () => {} }) => {
  const step = steps[detailsProject?.step?.reference]

  if (!step) {
    console.error(`Step ${detailsProject?.step?.reference} does not exist`)

    return null
  }

  const { component } = step

  if (typeof component !== 'function') {
    console.error(`Component for step ${detailsProject?.step?.reference} is not a function`)

    return null
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {listSteps && isSuccess && (
          <Typography textTransform={'uppercase'} variant='h5' sx={{ color: 'primary.main', mt: 4, mb: 4 }}>
            {nameActiveStep}
          </Typography>
        )}
      </Grid>
      {component(detailsProject, refetchProject)}
    </Grid>
  )
}

export default StepContainer
