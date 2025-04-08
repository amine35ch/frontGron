import React from 'react'
import CalendarSvg from 'src/@core/svg/CalendarSvg'
import { Grid, Typography, TextField, Box } from '@mui/material'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'

import CustomDateTimePickers from 'src/components/CustomDateTimePickers'
import { useAuth } from 'src/hooks/useAuth'
import { useGetCollaborators } from 'src/services/collaborators.service'
import { useGetAllListCompanyCollaborator } from 'src/services/company.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomChip from 'src/@core/components/mui/chip'
import useStates from 'src/@core/hooks/useStates'

const Visit = ({
  ListCompanies,
  visit,
  defaultCompany = null,
  setVisit,
  visitDetails,
  title,
  formErrors,
  disabled = false,
  collaboratorsList = [],
  collaboratorsDisplayOption = 'first_name',
  disableCollaborator = false,
  titleAction = null,
  detailsProject
}) => {
  const auth = useAuth()
  const { getStateByModel } = useStates()
  const isDisabled = detailsProject.isEditable

  const handleChange = (key, value) => {
    if (key === 'd_company_id') {
      setVisit({
        ...visit,
        [key]: value,
        user_id: null
      })
    } else {
      setVisit({
        ...visit,
        [key]: value
      })
    }
  }

  return (
    <Grid container>
      <Grid item xs={12} className='!mt-4'>
        <Box display='flex' alignItems='center' mb={3}>
          <Typography className='' sx={{ fontSize: '15px', color: '#2a2e34', fontWeight: '600' }}>
            {title}
          </Typography>
          {titleAction}
        </Box>
        <Grid container item spacing={2} className='items-center'>
          <Grid item xs={1} className='flex items-center'>
            <CalendarSvg />
          </Grid>
          <Grid item xs={4} md={3}>
            {defaultCompany ? (
              <TextField
                fullWidth
                placeholder='Nom'
                size='small'
                variant='outlined'
                value={defaultCompany}
                disabled={true}
              />
            ) : (
              <CustomeAutoCompleteSelect
                disabled={visit?.state == 3 ? true : disabled || isDisabled}
                value={visit?.d_company_id}
                onChange={value => handleChange('d_company_id', value)}
                data={ListCompanies || []}
                option={'id'}
                displayOption={'trade_name'}
                withIcon={true}
              />
            )}
          </Grid>

          <Grid item xs={2} md={3}>
            {visit && visit?.user !== null && visit?.d_company_id !== auth?.user?.company?.id ? (
              <TextField
                fullWidth
                placeholder='Nom'
                size='small'
                variant='outlined'
                value={!visit?.user?.first_name ? '' : visit?.user?.first_name + ' ' + visit?.user?.last_name}
                disabled={true}
              />
            ) : (
              <CustomeAutoCompleteSelect
                value={visit?.user_id}
                onChange={value => handleChange('user_id', value)}
                option={'id'}
                data={collaboratorsList}
                disabled={disabled || isDisabled}
                displayOption={collaboratorsDisplayOption}
                marginProps={true}
              />
            )}
          </Grid>
          <Grid item xs={3}>
            <CustomDateTimePickers
              minDate={auth?.user?.profile == `MAR` ? false : true}
              disabled={disabled || isDisabled}
              dateFormat={'dd/MM/yyyy HH:mm'}
              backendFormat={'YYYY-MM-DD HH:mm '}
              dateValue={visit.visit_date}
              setDate={date => handleChange('visit_date', date)}
              maxDate={false}
              error={formErrors?.[`visits.0.visit_date`]}
              helperText={renderArrayMultiline(formErrors?.[`visits.0.visit_date`])}
            />
          </Grid>
          {visit?.state == 3 && (
            <Grid item xs={2} textAlign={'end'}>
              <CustomChip
                skin='light'
                size='large'
                label={getStateByModel('DProjectVisit', visit?.state)?.name}
                color={'primary'}
                sx={{ height: 33, fontSize: '17px', fontWeight: 500, px: 2, marginLeft: '10px', width: '180px' }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Visit
