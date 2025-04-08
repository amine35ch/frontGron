import React, { useState } from 'react'
import { Grid, Divider, Checkbox } from '@mui/material'

import moment from 'moment'
import { useCreateProjectVisit, useGetCompaniesUsersSuperviseurInspecteur } from 'src/services/projectVisit.service'
import BtnColorSecondary from 'src/components/BtnColorSecondary'

import Visit from './Visit'
import { useAuth } from 'src/hooks/useAuth'
import { useGetListCompany } from 'src/services/company.service'

const StepAppointmentMarAndTech = ({ id, detailsProject, displayOption }) => {
  const [formErrors, setFormErrors] = useState(null)
  const { user } = useAuth()
  const visit = detailsProject?.visits?.find(visit => visit.type.type === 4)
  const visitEntrepriseData = detailsProject?.visits?.find(visit => visit.type.type === 0)
  const ListCompanies = [detailsProject?.installer, detailsProject?.mar]
  const isDisabled = detailsProject.isEditable

  const [formInputMar, setFormInputMar] = useState({
    name: 'Visite Accompagnateur rénov',
    type: 4,
    user_id: visit?.user?.id || '',
    user: visit?.user || {},
    d_company_id: visit?.d_company_id || user?.company?.id,
    state: visit?.state,
    visit_date: visit?.visit_date || moment(new Date()).format('YYYY-MM-DD hh:mm')
  })

  const [visitEnterprise, setVisitEnterprise] = useState({
    enable: visitEntrepriseData?.d_company_id ? true : false,
    name: 'Visite entreprise Retenue',
    type: 0,
    user_id: visitEntrepriseData?.user?.id || '',
    user: visitEntrepriseData?.user || {},
    d_company_id: visitEntrepriseData?.d_company_id || user?.company?.id,
    state: visitEntrepriseData?.state,
    visit_date: visitEntrepriseData?.visit_date || moment(new Date()).format('YYYY-MM-DD hh:mm')
  })

  const { data: listCollaboratorsMar } = useGetCompaniesUsersSuperviseurInspecteur({})

  //**************** */ QUERY
  const createProjectVisitMutation = useCreateProjectVisit({})

  // ****function

  const handleSaveVisit = async () => {
    try {
      console.log([visitEnterprise, formInputMar])
      await createProjectVisitMutation.mutateAsync({
        d_project_id: id,
        visits: [visitEnterprise, formInputMar]
      })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <Grid container className='!mt-5' spacing={2}>
      <Grid item xs={12}>
        <Visit
          ListCompanies={ListCompanies}
          displayName={''}
          detailsProject={detailsProject}
          visit={formInputMar}
          visitDetails={visit}
          setVisit={setFormInputMar}
          title={'Planifier la visite Accompagnateur rénov'}
          formErrors={formErrors}
          collaboratorsList={formInputMar.d_company_id === user?.company?.id ? listCollaboratorsMar : []}
          collaboratorsDisplayOption={'full_name'}
          defaultCompany={user?.company?.trade_name}
        />
      </Grid>
      <Grid item xs={12}>
        <Visit
          disabled={!visitEnterprise.enable}
          ListCompanies={ListCompanies}
          displayName={''}
          detailsProject={detailsProject}
          visit={visitEnterprise}
          visitDetails={visitEntrepriseData}
          setVisit={setVisitEnterprise}
          title={'Cocher pour planifier la visite Entreprise Retenue'}
          titleAction={
            <Checkbox
              checked={visitEnterprise.enable}
              onChange={event => {
                setVisitEnterprise({ ...visitEnterprise, enable: event.target.checked })
              }}
              inputProps={{ 'aria-label': 'controlled' }}
              disabled={isDisabled}
            />
          }
          formErrors={formErrors}
          collaboratorsList={visitEnterprise.d_company_id === user?.company?.id ? listCollaboratorsMar : []}
          collaboratorsDisplayOption={'full_name'}
        />
      </Grid>
      <Grid item xs={12} className='!my-2 flex justify-end'>
        <BtnColorSecondary
          action={() => handleSaveVisit()}
          title='Enregistrer'
          isLoading={createProjectVisitMutation?.isPending}
          disabled={isDisabled}
        />
      </Grid>

      {/* <Grid item md={12} xs={12} mb={2}>
        <Divider />
      </Grid> */}
    </Grid>
  )
}

export default StepAppointmentMarAndTech
