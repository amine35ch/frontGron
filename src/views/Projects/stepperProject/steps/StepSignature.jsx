import React from 'react'
import { Box, Grid, Card, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import StepDocuments from 'src/components/StepDocuments'

const StepSignature = ({ detailsProject }) => {
  return (
    <div className='mt-10 text-center'>
      <StepDocuments
        detailsProject={detailsProject}
        typeProject={detailsProject?.type}
        stepDocuments={detailsProject?.step_documents}
        id={detailsProject?.id}
      />

      <div className='flex justify-center mt-5'>
        <img src={'/images/gif/signature.gif'} width={'350'} alt='signature' />
      </div>
    </div>
  )
}

export default StepSignature
