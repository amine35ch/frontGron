import { LoadingButton } from '@mui/lab'
import Grid from '@mui/system/Unstable_Grid/Grid'
import { use, useEffect, useState } from 'react'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useGetListCompany } from 'src/services/company.service'
import { useValidatorInstallor } from 'src/services/project.service'
import { useGetListScenario } from 'src/services/scenario.service'

const WorkCompany = ({ detailsProject }) => {
  const [scenario, setScenario] = useState(null)
  const [company, setCompany] = useState(null)
  const validateInstallorMutation = useValidatorInstallor({ id: detailsProject?.id })

  const {
    data: scenarioList,
    isSuccess: scenarioListIsSuccess,
    isLoading: scenarioListIsLoading
  } = useGetListScenario({ paginated: false })

  const { data, isLoading, isSuccess } = useGetListCompany({
    type: 'ins',
    profile: 'installers'
  })
  useEffect(() => {
    setScenario(detailsProject?.scenario)
  }, [])

  const onSubmit = async () => {
    try {
      await validateInstallorMutation.mutateAsync({ installer: company })
    } catch (error) {}
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <CustomeAutoCompleteSelect
          data={data}
          value={company}
          onChange={value => setCompany(value)}
          error={false}
          helperText={false}
          option='id'
          displayOption='name'
          label='Entreprise retenue'
        />
      </Grid>
      <Grid item xs={12} md={4}></Grid>
      <Grid item xs={12} md={4}>
        <CustomeAutoCompleteSelect
          data={scenarioList}
          value={scenario}
          onChange={value => setScenario(value)}
          error={false}
          helperText={false}
          option='id'
          displayOption='entitled'
          label='Scénario'
        />
      </Grid>
      <Grid item xs={12} md={12} mt={5} display={'flex'} justifyContent={'flex-end'}>
        <LoadingButton
          onClick={onSubmit}
          loading={validateInstallorMutation?.isLoading}
          variant='contained'
          size='small'
          color='primary'
        >
          Enregistrer
        </LoadingButton>
      </Grid>
    </Grid>
  )
}

export default WorkCompany
