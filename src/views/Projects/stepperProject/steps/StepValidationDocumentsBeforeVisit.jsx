import { LoadingButton } from '@mui/lab'
import { Divider, Grid, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import StepDocuments from 'src/components/StepDocuments'
import { useUpdateClientRibIban } from 'src/services/client.service'

const StepValidationDocumentsBeforeVisit = ({ detailsProject }) => {
  const [formInput, setFormInput] = useState({ rib: '', iban: '' })
  const updateRibIbanMutation = useUpdateClientRibIban()
  useEffect(() => {
    setFormInput({
      rib: detailsProject?.client?.rib,
      iban: detailsProject?.client?.iban
    })
  }, [])

  const handleChange = event => {
    setFormInput({
      ...formInput,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async () => {
    try {
      await updateRibIbanMutation.mutateAsync({
        id: detailsProject?.client?.id,
        data: { rib: formInput?.rib, iban: formInput?.iban }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid container className='!mt-3' spacing={4}>
      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>
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

export default StepValidationDocumentsBeforeVisit
