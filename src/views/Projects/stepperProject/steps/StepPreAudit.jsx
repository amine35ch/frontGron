import React from 'react'
import { Grid, Typography, Divider } from '@mui/material'
import { useGenerateDocument } from 'src/services/project.service'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { useGetDocumentTypes } from 'src/services/settings.service'
import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import { useFinishForm, useGenerateForm } from 'src/services/formulaire.service'
import StepDocuments from 'src/components/StepDocuments'
import OperationsForm from '../../form/OperationsForm'
import WorkCompany from '../../form/WorkCompany'
import Simulator from 'src/views/simulator'
import SetProjectInstaller from '../../form/SetProjectInstaller'

const StepPreAudit = ({ id, detailsProject }) => {
  const router = useRouter()

  // const generateDocumentMutation = useGenerateDocument({ id })
  // const useFinishFormMutation = useFinishForm({ id })
  // const useGenerateFormMutation = useGenerateForm({ id })

  // const remplirFormulaire = p_document_id => {
  //   const idDocument = p_document_id
  //   router.push(`/projects/${id}/${idDocument}/formulaire`)
  // }

  // const remplirFicheNavette = p_document_id => {
  //   const idDocument = p_document_id
  //   router.push(`/projects/${id}/${idDocument}/fiche-navette`)
  // }

  // const finishFormulaire = async p_document_id => {
  //   const idDocument = p_document_id
  //   try {
  //     await useFinishFormMutation.mutateAsync(idDocument)
  //   } catch (error) {}
  // }

  // const generateFormulaire = async p_document_id => {
  //   const idDocument = p_document_id
  //   try {
  //     await useGenerateFormMutation.mutateAsync(idDocument)
  //   } catch (error) {}
  // }

  return (
    <Grid container spacing={5} className='!mt-5 '>
      <Grid item xs={12}>
        <StepDocuments
          typeProject={detailsProject?.type}
          stepDocuments={detailsProject?.documents}
          id={detailsProject?.id}
          detailsProject={detailsProject}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <SetProjectInstaller detailsProject={detailsProject} />
      </Grid>
      <Grid item xs={12} md={12}>
        <Simulator detailsProject={detailsProject} />

        {/* <WorkCompany detailsProject={detailsProject} /> */}
      </Grid>
    </Grid>
  )
}

export default StepPreAudit
