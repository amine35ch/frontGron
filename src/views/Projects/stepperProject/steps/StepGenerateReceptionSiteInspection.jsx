import {
  Grid,
  Divider,
  TextField,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { useState } from 'react'
import StepDocuments from 'src/components/StepDocuments'
import Visit from './Visit'
import { useAuth } from 'src/hooks/useAuth'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useGetListCompany } from 'src/services/company.service'
import { useGetProjectCompanies } from 'src/services/project.service'
import moment from 'moment'
import BtnColorSecondary from 'src/components/BtnColorSecondary'
import { useCreateProjectVisit } from 'src/services/projectVisit.service'

const StepGenerateReceptionSiteInspection = ({ id, detailsProject }) => {
  const [formErrors, setFormErrors] = useState(null)

  const [formInputMar, setFormInputMar] = useState({
    name: '2ème visite Mar',
    type: 2,
    user_id: '',
    d_company_id: detailsProject?.mar?.id,
    visit_date: moment(new Date()).format('YYYY-MM-DD hh:mm')
  })

  //**************** */ QUERY
  const createProjectVisitMutation = useCreateProjectVisit({})

  // ****function

  const handleSaveVisit = async () => {
    try {
      await createProjectVisitMutation.mutateAsync({
        d_project_id: id,
        visits: [formInputMar]
      })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <Grid container className='!mt-3' spacing={4}>
      <Visit
        defaultCompany={detailsProject?.mar}
        ListCompanies={[]}
        detailsProject={detailsProject}
        visit={formInputMar}
        setVisit={setFormInputMar}
        titleTypeAudit={'2ème visite Mar'}
      />
      <Grid item xs={12} className='!my-2 flex justify-end'>
        <BtnColorSecondary
          action={() => handleSaveVisit()}
          title='Enregistrer'
          isLoading={createProjectVisitMutation?.isPending}
        />
      </Grid>
      <Grid item md={12} xs={12} mb={2}>
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

export default StepGenerateReceptionSiteInspection
