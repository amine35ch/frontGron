import React from 'react'
import { Grid, Typography, Divider, Box } from '@mui/material'
import { useGenerateDocument } from 'src/services/project.service'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { useGetDocumentTypes } from 'src/services/settings.service'
import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import { useFinishForm, useGenerateForm } from 'src/services/formulaire.service'
import StepDocuments from 'src/components/StepDocuments'
import CustomAccordian from 'src/components/CustomAccordian'
import ProjectVisitColum from 'src/views/project-visit/ProjectVisitColum'
import ProjectVisiteTable from '../../components/ProjectVisiteTable'
import { useAuth } from 'src/hooks/useAuth'

const StepFillShuttleCard = ({ id, detailsProject }) => {
  const { user } = useAuth()
  const router = useRouter()
  const generateDocumentMutation = useGenerateDocument({ id })
  const useFinishFormMutation = useFinishForm({ id })
  const useGenerateFormMutation = useGenerateForm({ id })

  const remplirFormulaire = p_document_id => {
    const idDocument = p_document_id
    router.push(`/projects/${id}/${idDocument}/formulaire`)
  }

  const remplirFicheNavette = p_document_id => {
    const idDocument = p_document_id
    router.push(`/projects/${id}/${idDocument}/fiche-navette`)
  }

  const finishFormulaire = async p_document_id => {
    const idDocument = p_document_id
    try {
      await useFinishFormMutation.mutateAsync(idDocument)
    } catch (error) {}
  }

  const generateFormulaire = async p_document_id => {
    const idDocument = p_document_id
    try {
      await useGenerateFormMutation.mutateAsync(idDocument)
    } catch (error) {}
  }

  const projectVisitColumn = ProjectVisitColum({
    userRole: user.role.slice(5),
    resource: 'project-visit'
  })

  return (
    <Grid container spacing={5} className='!mt-5 '>
      <Grid item xs={12}>
        <CustomAccordian open={true} titleAccordian={'Liste des Visites'}>
          <Box mt={5} />
          <ProjectVisiteTable projectVisitColumn={projectVisitColumn} listProjectVisit={detailsProject?.visits} />
        </CustomAccordian>
      </Grid>
      <Grid item xs={12}>
        <CustomAccordian open={true} titleAccordian={'Liste des Documents'}>
          <StepDocuments
            typeProject={detailsProject?.type}
            stepDocuments={detailsProject?.step_documents}
            id={detailsProject?.id}
            detailsProject={detailsProject}
          />
        </CustomAccordian>
      </Grid>
    </Grid>
  )
}

export default StepFillShuttleCard
