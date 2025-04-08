import React, { useEffect, useState } from 'react'
import {
  Grid,
  Typography,
  IconButton,
  TextField,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Divider
} from '@mui/material'

import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useUpdateProject } from 'src/services/project.service'
import { useGetClients } from 'src/services/client.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetOperationTiers, useGetTiers } from 'src/services/tiers.service'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'

import {
  useGetListEnergyClasses,
  useGetListIncomeClasses,
  useGetListProjectNatures,
  useGetListProjectResidences,
  useGetListTypeDemade,
  useGetNatureResidence,
  useGetWorkType
} from 'src/services/settings.service'
import { useRouter } from 'next/router'

const FormUpdate = ({ typeProject, redirect = false, detailsProject = {} }) => {
  const router = useRouter()
  const theme = useTheme()

  // ** state
  const [formInput, setFormInput] = useState({
    d_client_id: null,
    performance_energy_before_work: null,
    income_class: null,
    demande_project: null,
    d_third_party_id: null,

    operations: []
  })
  const [occuppants, setOccuppants] = useState([])
  const [formErrors, setFormErrors] = useState({})

  // ** Query
  const updateProjectMutation = useUpdateProject({ id: detailsProject?.id })
  const { data: lisEnergyClasses } = useGetListEnergyClasses()
  const { data: listIncomeClasses } = useGetListIncomeClasses()

  const { data: clientList } = useGetClients({})
  const { data: lisTypeDemande } = useGetListTypeDemade()
  const { data: listTiers } = useGetTiers({ type: 2 })
  const { data: listOperationTiers } = useGetOperationTiers({ id: formInput.d_third_party_id })

  // Custom function

  useEffect(() => {
    setFormInput(prev => {
      return { ...prev, ...detailsProject }
    })
  }, [])

  const handleChange = (name, value) => {
    setFormInput(prev => {
      return { ...prev, [name]: value }
    })
  }

  const handleupdateProject = async () => {
    try {
      await updateProjectMutation.mutateAsync({ ...formInput, occupants: occuppants })
      if (redirect) router.push(`/${typeProject}/${detailsProject?.id}/edit`)
    } catch (error) {}
  }

  return (
    <div>
      <Typography textTransform={'uppercase'} variant='h4'>
        {redirect ? (
          <IconButton
            onClick={() => {
              router.push(`/${typeProject}/${detailsProject?.id}/edit`)
            }}
          >
            <IconifyIcon color='#8e49b3' icon='icon-park-outline:arrow-left' width={20} height={20} />
          </IconButton>
        ) : null}
        Information
      </Typography>
      <Grid container spacing={5} p={5}>
        <Grid container item xs={12} md={6} className='!mb-2'>
          <Grid item xs={12} md={12}>
            <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Client
            </Typography>
            <CustomeAutoCompleteSelect
              value={formInput.d_client_id}
              onChange={value => handleChange('d_client_id', value)}
              data={clientList}
              option={'id'}
              formError={formErrors}
              error={formErrors?.d_client_id}
              displayOption={'first_name'}
              helperText={renderArrayMultiline(formErrors?.d_client_id)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2'>
          <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Source
          </Typography>
          <CustomeAutoCompleteSelect
            option={'type'}
            value={formInput.demande_project}
            onChange={value => handleChange('demande_project', value)}
            data={lisTypeDemande}
            displayOption={'entitled'}
            formError={formErrors}
            error={formErrors?.demande_project}
            helperText={renderArrayMultiline(formErrors?.demande_project)}
          />
        </Grid>

        <Grid item xs={12} md={6} className='!pt-0 !mb-2'>
          <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Classe Énergétique
          </Typography>
          <CustomeAutoCompleteSelect
            option={'type'}
            value={formInput.performance_energy_before_work}
            onChange={value => handleChange('performance_energy_before_work', value)}
            data={lisEnergyClasses?.filter(item => item.entitled !== 'Aucun')}
            formError={formErrors}
            displayOption={'entitled'}
            error={formErrors?.performance_energy_before_work}
            helperText={renderArrayMultiline(formErrors?.performance_energy_before_work)}
          />
        </Grid>

        <Grid item xs={12} md={6} className='!pt-0 !mb-2'>
          <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Classe du revenue
          </Typography>
          <CustomeAutoCompleteSelect
            option={'type'}
            value={formInput.income_class}
            onChange={value => handleChange('income_class', value)}
            data={listIncomeClasses}
            formError={formErrors}
            displayOption={'entitled'}
            error={formErrors?.income_class}
            helperText={renderArrayMultiline(formErrors?.income_class)}
          />
        </Grid>
        {formInput?.demande_project == 0 && (
          <Grid container item xs={12} md={6} className='!pt-0 !mb-2'>
            <Grid item xs={12} md={11}>
              <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Tiers
              </Typography>
              <CustomeAutoCompleteSelect
                option={'id'}
                value={formInput.d_third_party_id}
                onChange={value => handleChange('d_third_party_id', value)}
                data={listTiers}
                formError={formErrors}
                error={formErrors?.d_third_party_id}
                displayOption={'name'}
                helperText={renderArrayMultiline(formErrors?.d_third_party_id)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={1}
              className='flex items-end justify-end'
              onClick={() => setOpenModalAddEntreprise(true)}
            >
              <IconButton aria-label='Ajouter Tiers' size='small'>
                <IconifyIcon icon='material-symbols-light:add-home-work' color='#585DDB' fontSize='35px' />
              </IconButton>
            </Grid>
          </Grid>
        )}

        {formInput?.demande_project == 0 && formInput?.d_third_party_id !== null && (
          <Grid item xs={12} md={6} className='!pt-0 !mb-2'>
            <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Opérations
            </Typography>
            <CustomeAutoCompleteSelectMultiple
              value={formInput.operations}
              optionLabel={'reference'}
              onChange={value => handleChange('operations', value)}
              data={listOperationTiers}
              formError={formErrors}
              error={formErrors?.operations}
              helperText={renderArrayMultiline(formErrors?.operations)}
            />
          </Grid>
        )}
      </Grid>

      <Grid container>
        <Grid item xs={6}></Grid>

        <Grid item xs={6} className='flex justify-end !mb-4'>
          <LoadingButton
            variant='contained'
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={handleupdateProject}
          >
            Modifier
          </LoadingButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default FormUpdate
