import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material'
import LigneTypeTableWithDynamicLigne from './LigneTypeTableWithDynamicLigne'
import { LoadingButton } from '@mui/lab'
import CustomAccordian from 'src/components/CustomAccordian'
import { useAddParoiMotifMutation, useGetListEnergyClasses } from 'src/services/project.service'
import { use, useEffect, useState } from 'react'
import CustomDatePicker from 'src/components/CustomDatePicker'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { set } from 'nprogress'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useRouter } from 'next/router'
import moment from 'moment'

const QuotationData = ({ detailsProject, idProject, typeProject, redirect, document, getDetailsIsSuccess }) => {
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    date_audit: null,
    audit_identifier: '',
    primary_energy_before_work: '',
    final_energy_before_work: '',
    gaz_emission_before_work: '',
    performance_energy_before_work: '',
    surface_housing_before_work: '',
    scenario: '',
    primary_energy_after_work: '',
    final_energy_after_work: '',
    gaz_emission_after_work: '',
    performance_energy_after_work: '',
    surface_housing_after_work: ''
  })
  const [criteria, setCriteria] = useState([])

  useEffect(() => {
    if (getDetailsIsSuccess) {
      setFormInput({
        date_audit:
          detailsProject?.date_audit === null ? moment(new Date()).format('YYYY-MM-DD') : detailsProject?.date_audit,
        audit_identifier: detailsProject?.audit_identifier,
        primary_energy_before_work: detailsProject?.primary_energy_before_work,
        final_energy_before_work: detailsProject?.final_energy_before_work,
        gaz_emission_before_work: detailsProject?.gaz_emission_before_work,
        performance_energy_before_work: detailsProject?.performance_energy_before_work,
        surface_housing_before_work: detailsProject?.surface_housing_before_work,
        scenario: detailsProject?.scenario,
        primary_energy_after_work: detailsProject?.primary_energy_after_work,
        final_energy_after_work: detailsProject?.final_energy_after_work,
        gaz_emission_after_work: detailsProject?.gaz_emission_after_work,
        performance_energy_after_work: detailsProject?.performance_energy_after_work,
        surface_housing_after_work: detailsProject?.surface_housing_after_work
      })
    }
  }, [getDetailsIsSuccess])

  const [formErrors, setFormErrors] = useState({})

  const addParoiMotif = useAddParoiMotifMutation({ id: idProject })

  const {
    data: energyClasseList,
    isSuccess: energyClasseListIsSuccess,
    isLoading: energyClasseListIsLoading
  } = useGetListEnergyClasses()

  const handleChange = (field, value) => {
    setFormInput(prevState => ({
      ...prevState,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const form = {
        ...formInput,
        derogation_request_criteria: criteria
      }
      await addParoiMotif.mutateAsync(form)
      redirect && router.push(`/projects/${idProject}/edit`)
    } catch (error) {
      setFormErrors(error?.response?.data?.errors)
    }
  }

  return (
    <>
      <CustomAccordian titleAccordian='Synthèse de l’audit énergétique'>
        <Grid container spacing={5} mt={5}>
          <Grid item md={12} xs={12}>
            <Typography align='center' color={'primary'} fontSize={20} sx={{ fontWeight: '600' }}>
              Synthèse à remplir par le professionnel ayant réalisé l'audit énergétique{' '}
            </Typography>
          </Grid>
          {/* Identifiant d'audit */}
          <Grid mt={5} item container alignItems={'center'}>
            <Grid item xs={12} md={2}>
              <Typography color={'secondary'} fontSize={16} sx={{ fontWeight: '600' }}>
                Identifiant d'audit
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                placeholder=''
                size='small'
                variant='outlined'
                className='w-full !mt-1'
                value={formInput?.audit_identifier}
                onChange={e => handleChange('audit_identifier', e.target.value)}
                sx={{ fontSize: '10px !important' }}
                error={formErrors?.audit_identifier}
                helperText={renderArrayMultiline(formErrors?.audit_identifier)}
              />
            </Grid>
          </Grid>
          {/* Date de facturation de l'audit */}
          <Grid mt={5} item container alignItems={'center'}>
            <Grid item xs={12} md={2}>
              <Typography color={'secondary'} fontSize={16} sx={{ fontWeight: '600' }}>
                Date de facturation de l'audit
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                dateFormat={'dd/MM/yyyy'}
                backendFormat={'YYYY-MM-DD'}
                dateValue={formInput?.date_audit}
                setDate={date => handleChange('date_audit', date)}
                error={formErrors?.date_audit}
                helperText={renderArrayMultiline(formErrors?.date_audit)}
              />
            </Grid>
          </Grid>
          {/* Situation initiale du logement */}
          <Grid item md={12} xs={12}>
            <Typography variant='h6'>Situation initiale du logement (« avant travaux »)</Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant='body1'>
              Consommation conventionnelle (chauffage, refroidissement, production d'eau chaude sanitaire, éclairage,
              auxiliaires)
            </Typography>
          </Grid>
          {/* Consommation conventionnelle avant travaux */}
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label='en kWh/m²/an d’énergie primaire'
              variant='outlined'
              size='small'
              value={formInput?.primary_energy_before_work}
              onChange={e => handleChange('primary_energy_before_work', e.target.value)}
              error={formErrors?.primary_energy_before_work}
              helperText={renderArrayMultiline(formErrors?.primary_energy_before_work)}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label='en kWh/m²/an d’énergie finale'
              variant='outlined'
              size='small'
              value={formInput?.final_energy_before_work}
              onChange={e => handleChange('final_energy_before_work', e.target.value)}
              error={formErrors?.final_energy_before_work}
              helperText={renderArrayMultiline(formErrors?.final_energy_before_work)}
            />
          </Grid>
          {/* Émissions annuelles de gaz à effet de serre avant travaux */}
          <Grid item md={12} xs={12} display='flex' alignItems='center' gap={2}>
            <Box width={400}>
              <Typography variant='body1'>Émissions annuelles de gaz à effet de serre :</Typography>
            </Box>
            <TextField
              label='en kgCO2/m²/an'
              variant='outlined'
              size='small'
              value={formInput?.gaz_emission_before_work}
              onChange={e => handleChange('gaz_emission_before_work', e.target.value)}
              error={formErrors?.gaz_emission_before_work}
              helperText={renderArrayMultiline(formErrors?.gaz_emission_before_work)}
            />
          </Grid>
          {/* Classe de performance énergétique avant travaux */}
          <Grid item md={12} xs={12} display='flex' alignItems='center' gap={2}>
            <Box width={400}>
              <Typography variant='body1'>Classe de performance énergétique (de A à G) :</Typography>
            </Box>
            <CustomeAutoCompleteSelect
              data={energyClasseList}
              value={formInput.performance_energy_before_work}
              onChange={newValue => handleChange('performance_energy_before_work', newValue)}
              option='type'
              displayOption='entitled'
              helperText={formErrors?.performance_energy_before_work}
              error={formErrors?.performance_energy_before_work}
            />
          </Grid>
          {/* Surface de référence du logement avant travaux */}
          <Grid item md={12} xs={12} display='flex' alignItems='center' gap={2}>
            <Box width={400}>
              <Typography variant='body1'>Surface de référence du logement en m² :</Typography>
            </Box>
            <TextField
              label='m²'
              variant='outlined'
              size='small'
              value={formInput?.surface_housing_before_work}
              onChange={e => handleChange('surface_housing_before_work', e.target.value)}
              error={formErrors?.surface_housing_before_work}
              helperText={renderArrayMultiline(formErrors?.surface_housing_before_work)}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Divider />
          </Grid>
          {/* Situation du logement projetée dans le scénario de travaux retenu */}
          <Grid item md={12} xs={12}>
            <Typography variant='h6'>
              Situation du logement projetée dans le scénario de travaux retenu (« après travaux »)
            </Typography>
          </Grid>
          <Grid item md={8} xs={12} display='flex' alignItems='center' gap={2}>
            <Box width={400}>
              <Typography variant='body1'>Référence ou n° du scenario retenu : </Typography>
            </Box>
            <TextField
              fullWidth
              label='Scénario'
              variant='outlined'
              size='small'
              value={formInput?.scenario}
              onChange={e => handleChange('scenario', e.target.value)}
              error={formErrors?.scenario}
              helperText={renderArrayMultiline(formErrors?.scenario)}
            />
          </Grid>
          {/* Consommation conventionnelle après travaux */}
          <Grid item md={12} xs={12}>
            <Typography variant='body1'>
              Consommation conventionnelle (chauffage, refroidissement, production d'eau chaude sanitaire, éclairage,
              auxiliaires)
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label='en kWh/m²/an d’énergie primaire'
              variant='outlined'
              size='small'
              value={formInput?.primary_energy_after_work}
              onChange={e => handleChange('primary_energy_after_work', e.target.value)}
              error={formErrors?.primary_energy_after_work}
              helperText={renderArrayMultiline(formErrors?.primary_energy_after_work)}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label='en kWh/m²/an d’énergie finale'
              variant='outlined'
              size='small'
              value={formInput?.final_energy_after_work}
              onChange={e => handleChange('final_energy_after_work', e.target.value)}
              error={formErrors?.final_energy_after_work}
              helperText={renderArrayMultiline(formErrors?.final_energy_after_work)}
            />
          </Grid>
          {/* Émissions annuelles de gaz à effet de serre après travaux */}
          <Grid item md={12} xs={12} display='flex' alignItems='center' gap={2}>
            <Box width={400}>
              <Typography variant='body1'>Émissions annuelles de gaz à effet de serre :</Typography>
            </Box>
            <TextField
              label='en kgCO2/m²/an'
              variant='outlined'
              size='small'
              value={formInput?.gaz_emission_after_work}
              onChange={e => handleChange('gaz_emission_after_work', e.target.value)}
              error={formErrors?.gaz_emission_after_work}
              helperText={renderArrayMultiline(formErrors?.gaz_emission_after_work)}
            />
          </Grid>
          {/* Classe de performance énergétique après travaux */}
          <Grid item md={12} xs={12} display='flex' alignItems='center' gap={2}>
            <Box width={400}>
              <Typography variant='body1'>Classe de performance énergétique (de A à G) :</Typography>
            </Box>
            <CustomeAutoCompleteSelect
              data={energyClasseList}
              value={formInput.performance_energy_after_work}
              onChange={newValue => handleChange('performance_energy_after_work', newValue)}
              option='type'
              displayOption='entitled'
              helperText={formErrors?.performance_energy_after_work}
              error={formErrors?.performance_energy_after_work}
            />
          </Grid>
          {/* Surface de référence du logement après travaux */}
          <Grid item md={12} xs={12} display='flex' alignItems='center' gap={2}>
            <Box width={400}>
              <Typography variant='body1'>Surface de référence du logement en m² :</Typography>
            </Box>
            <TextField
              label='m²'
              variant='outlined'
              size='small'
              value={formInput?.surface_housing_after_work}
              onChange={e => handleChange('surface_housing_after_work', e.target.value)}
              error={formErrors?.surface_housing_after_work}
              helperText={renderArrayMultiline(formErrors?.surface_housing_after_work)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      <LigneTypeTableWithDynamicLigne
        detailsProject={detailsProject}
        idProject={idProject}
        typeProject={typeProject}
        redirect={true}
        document={document}
        getDetailsIsSuccess={getDetailsIsSuccess}
        criteria={criteria}
        setCriteria={setCriteria}
      />
      <Grid mt={5} container>
        <Grid item md={12} sx={12} display={'flex'} justifyContent={'flex-end'}>
          <LoadingButton loading={addParoiMotif.isPending} variant='outlined' onClick={handleSubmit}>
            Enregistrer
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  )
}

export default QuotationData
