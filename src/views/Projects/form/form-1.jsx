import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
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
  Divider,
  useTheme,
  FormHelperText,
  Stack
} from '@mui/material'

import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useUpdateProject, useUpdateProjectCerfaMutation } from 'src/services/project.service'
import { useGetClients } from 'src/services/client.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetOperationTiers, useGetTiers } from 'src/services/tiers.service'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'
import CreateClient from 'src/views/clients/CreateClient'
import CreateTiers from 'src/views/Tiers/CreateTiers'
import OcuppantTable from './OcuppantList'
import CustomeTypography from 'src/components/CustomeTypography'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { useGetListProjectNatures, useGetNatureResidence, useGetWorkType } from 'src/services/settings.service'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import CustomAccordian from 'src/components/CustomAccordian'
import PostiveIntegerInput from 'src/components/PostiveIntegerInput'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'

const Form1 = forwardRef((props, ref) => {
  const router = useRouter()
  const theme = useTheme()

  const {
    getDetailsIsSuccess = false,
    SubmitButton = true,
    redirect = false,
    detailsProject = {},
    formErrors,
    setFormErrors
  } = props

  // ** state
  const [formInput, setFormInput] = useState({
    type: '',
    scenario: '',
    total_number_occupants: 1,
    number_of_children: 0,
    project_nature: '',
    sum_revenue_reference_1: '',
    year_of_sum_revenue_reference_1: '',
    work_load_for_low_income_owners: '',
    free_hosting_for_low_income_household: '',
    number_of_residents_under_your_roof: '',
    number_of_dependent_children: '',
    sum_revenue_reference_2: '',
    year_of_sum_revenue_reference_2: '',
    address: '',
    house_number: '',
    street: '',
    complement: '',
    batiment: '',
    floor: '',
    stairs: '',
    house_number: '',
    street: '',
    door: '',
    zip_code: '',
    city: '',
    common: '',
    number_and_street: '',
    nature_residence: 0,
    work_commun_parts: 0,
    more_than_fifteen: '',
    logement_date_creation: '',
    ptz_beneficiary: 0,
    auto_rehabilitation: '',
    work_description: '',
    energy_consumption_before: '',
    energy_consumption_after: '',
    work_type: 0,
    more_than_fifteen: 1,
    logement_date_creation: '',
    auto_rehabilitation: 0,
    energy_consumption_before: '',
    energy_consumption_after: '',
    work_description: ''
  })
  const [occuppants, setOccuppants] = useState([])

  // const [formErrors, setFormErrors] = useState({})

  // ** Query
  const updateProjectMutation = useUpdateProjectCerfaMutation({ id: detailsProject?.id })
  const { data: listNatureResidences } = useGetNatureResidence()
  const { data: listProjectNatures } = useGetListProjectNatures()
  const { data: listWorkType } = useGetWorkType()

  // Custom function

  useEffect(() => {
    if (getDetailsIsSuccess) {
      setFormInput(prev => {
        const updatedFormInput = { ...prev }

        Object.keys(updatedFormInput).forEach(key => {
          if (detailsProject.hasOwnProperty(key)) {
            updatedFormInput[key] = detailsProject[key]
          }
        })

        return updatedFormInput
      })
      setOccuppants(detailsProject?.occupants || [])
    }
  }, [getDetailsIsSuccess])

  const handleChange = (name, value) => {
    setFormInput(prev => {
      return { ...prev, [name]: value }
    })
  }

  const handleAddNewRow = () => {
    setOccuppants(prev => [
      ...prev,
      {
        civility: '',
        first_name: '',
        last_name: '',
        year_of_birth: ''
      }
    ])
  }

  const handleOccupantTotalNumberChange = event => {
    let { value } = event.target
    if (value < 1) value = 1
    setFormInput(prev => {
      return { ...prev, total_number_occupants: value }
    })
    value = value - 1
    if (value > occuppants.length) {
      const diff = value - occuppants.length
      for (let i = 0; i < diff; i++) {
        handleAddNewRow()
      }
    } else {
      const diff = occuppants.length - value
      for (let i = 0; i < diff; i++) {
        occuppants.pop()
      }
      setOccuppants([...occuppants])
    }
  }

  const handleReturnComponentData = () => {
    return { ...formInput, occupants: occuppants }
  }

  useImperativeHandle(ref, () => ({
    handleReturnComponentData,
    handleChange
  }))

  const handleUpdateProject = async () => {
    try {
      await updateProjectMutation.mutateAsync({ ...formInput, occupants: occuppants })
      if (redirect) router.push(`/projects/${detailsProject?.id}/edit`)
    } catch (error) {
      setFormErrors(error.response.data.errors)
    }
  }

  return (
    <div>
      <CustomAccordian titleAccordian={'Identité du demandeur de l’aide'}>
        <Grid container spacing={5} p={5}>
          <Grid item xs={12} md={6}>
            <CustomeTypography>Nombre total d’occupants du logement à améliorer</CustomeTypography>
            {/* <TextField
              onChange={handleOccupantTotalNumberChange}
              value={formInput.total_number_occupants}
              name='total_number_occupants'
              fullWidth
              size='small'
              variant='outlined'
              type='number'
              inputProps={{ min: 0 }}
            /> */}
            <OnlyNumbersInput
              max={200}
              onChange={handleOccupantTotalNumberChange}
              value={formInput.total_number_occupants}
              error={formErrors?.total_number_occupants}
              helperText={renderArrayMultiline(formErrors?.total_number_occupants)}
              name='total_number_occupants'
              fullWidth
              size='small'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomeTypography>Le cas échéant, nombre d’enfant(s) à naître</CustomeTypography>
            {/* <TextField
              onChange={event => handleChange('number_of_children', event.target.value)}
              value={formInput.number_of_children}
              name='number_of_children'
              fullWidth
              size='small'
              variant='outlined'
              type='number'
              inputProps={{ min: 0 }}
            /> */}
            <OnlyNumbersInput
              max={200}
              onChange={event => handleChange('number_of_children', Number(event?.target?.value))}
              value={formInput.number_of_children}
              error={formErrors?.number_of_children}
              helperText={renderArrayMultiline(formErrors?.number_of_children)}
              name='number_of_children'
              fullWidth
              size='small'
              variant='outlined'
            />
          </Grid>
          {formInput.total_number_occupants > 1 ? (
            <Grid item xs={12} md={12}>
              <CustomeTypography>
                l’identité des occupants du logement à améliorer (en dehors de vous)
              </CustomeTypography>
              <OcuppantTable occuppants={occuppants} formErrors={formErrors} setOccuppants={setOccuppants} />
            </Grid>
          ) : null}
          <Grid item xs={12} md={6}>
            <CustomeTypography>Titre de résidence principale à améliorer</CustomeTypography>
            <CustomeAutoCompleteSelect
              option={'type'}
              value={formInput.project_nature}
              onChange={value => handleChange('project_nature', value)}
              data={listProjectNatures}
              formError={formErrors}
              error={formErrors?.project_nature}
              displayOption={'entitled'}
              helperText={renderArrayMultiline(formErrors?.project_nature)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomeTypography>
              RFR total des occupants du logement à améliorer, vous inclus le cas échéant{' '}
              <strong className='text-red-500'>*</strong>
            </CustomeTypography>
            <div className='flex gap-2 '>
              <CustomCurrencyInput
                onChange={event => handleChange('sum_revenue_reference_1', event.floatValue)}
                value={formInput.sum_revenue_reference_1}
                name='number_of_children'
                fullWidth
                size='small'
                variant='outlined'
                error={formErrors?.sum_revenue_reference_1}
                helperText={renderArrayMultiline(formErrors?.sum_revenue_reference_1)}
              />

              <OnlyNumbersInput
                max={9999}
                onChange={event => {
                  handleChange('year_of_sum_revenue_reference_1', event?.target?.value)
                }}
                value={formInput.year_of_sum_revenue_reference_1}
                name='year_of_sum_revenue_reference_1'
                size='small'
                variant='outlined'
                label='Année RFR'
                error={formErrors?.year_of_sum_revenue_reference_1}
                helperText={renderArrayMultiline(formErrors?.year_of_sum_revenue_reference_1)}
              />
            </div>
          </Grid>
          <Stack my={2} width='100%'>
            <CustomAccordian titleAccordian='Cas particulier' open={false} isSpecialCase>
              <Grid item xs={12} md={12} my={2}>
                <div className='flex items-center'>
                  <IconifyIcon color={theme.palette.primary.main} icon='icon-park-outline:dot' width={20} height={20} />
                  <Typography color={'primary'}>
                    <Box sx={{ fontWeight: 'bold', m: 1 }}>
                      Vous n’occupez pas (et n’allez pas occuper) le logement à améliorer mais :
                    </Box>
                  </Typography>
                </div>
                <div className='ml-4 space-y-2'>
                  <FormControl>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formInput.work_load_for_low_income_owners}
                            onChange={event => handleChange('work_load_for_low_income_owners', event.target.checked)}
                          />
                        }
                        label='vous assurez la charge des travaux pour le compte de vos ascendants ou descendants de revenus modestes, eux-mêmes propriétaires du logement'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={event =>
                              handleChange('free_hosting_for_low_income_household', event.target.checked)
                            }
                            checked={formInput.free_hosting_for_low_income_household}
                          />
                        }
                        label='vous hébergez à titre gratuit un ménage de ressources modestes'
                      />
                    </FormGroup>
                  </FormControl>
                  <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                      <CustomeTypography>Nombre de personnes vivant sous votre toit</CustomeTypography>

                      <OnlyNumbersInput
                        max={200}
                        onChange={event => handleChange('number_of_residents_under_your_roof', event?.target?.value)}
                        value={formInput.number_of_residents_under_your_roof}
                        name='number_of_residents_under_your_roof'
                        fullWidth
                        size='small'
                        variant='outlined'
                        error={formErrors?.number_of_residents_under_your_roof}
                        helperText={renderArrayMultiline(formErrors?.number_of_residents_under_your_roof)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomeTypography>Le cas échéant, nombre d’enfant(s) à naître</CustomeTypography>

                      <OnlyNumbersInput
                        max={200}
                        min={1}
                        onChange={event => handleChange('number_of_dependent_children', event?.target?.value)}
                        value={formInput.number_of_dependent_children}
                        name='number_of_dependent_children'
                        fullWidth
                        size='small'
                        variant='outlined'
                        error={formErrors?.number_of_dependent_children}
                        helperText={renderArrayMultiline(formErrors?.number_of_dependent_children)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomeTypography>
                        RFR total des occupants du logement à améliorer, vous inclus
                      </CustomeTypography>
                      <div className='flex gap-2 '>
                        <CustomCurrencyInput
                          onChange={event => handleChange('sum_revenue_reference_2', event.floatValue)}
                          value={formInput.sum_revenue_reference_2}
                          name='sum_revenue_reference_2'
                          fullWidth
                          size='small'
                          variant='outlined'
                          error={formErrors?.sum_revenue_reference_2}
                          helperText={renderArrayMultiline(formErrors?.sum_revenue_reference_2)}
                        />

                        <OnlyNumbersInput
                          max={9999}
                          onChange={event => {
                            handleChange('year_of_sum_revenue_reference_2', event?.target?.value)
                          }}
                          error={formErrors?.year_of_sum_revenue_reference_2}
                          helperText={renderArrayMultiline(formErrors?.year_of_sum_revenue_reference_2)}
                          value={formInput.year_of_sum_revenue_reference_2}
                          name='year_of_sum_revenue_reference_2'
                          size='small'
                          variant='outlined'
                          label='Année RFR'
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </CustomAccordian>
          </Stack>
        </Grid>
      </CustomAccordian>
      <CustomAccordian titleAccordian={'Description du logement à améliorer'}>
        {/* <Typography color={'primary.dark'} textTransform={'uppercase'} variant='h5'>
        Description du logement à améliorer
      </Typography> */}
        <Grid container spacing={5} p={5}>
          {/* <Grid item xs={12} md={6}>
            <CustomeTypography>Adresse</CustomeTypography>
            <TextField
              onChange={event => handleChange('address', event.target.value)}
              value={formInput.address}
              name='address'
              fullWidth
              size='small'
              variant='outlined'
              error={formErrors?.address}
              helperText={renderArrayMultiline(formErrors?.address)}
            />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <CustomeTypography>N°</CustomeTypography>
            <TextField
              onChange={event => handleChange('house_number', event.target.value)}
              value={formInput.house_number}
              name='house_number'
              fullWidth
              size='small'
              variant='outlined'
              error={formErrors?.house_number}
              helperText={renderArrayMultiline(formErrors?.house_number)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomeTypography>Voie</CustomeTypography>
            <TextField
              onChange={event => handleChange('street', event.target.value)}
              value={formInput.street}
              error={formErrors?.street}
              helperText={renderArrayMultiline(formErrors?.street)}
              name='street'
              fullWidth
              size='small'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomeTypography>Ville</CustomeTypography>
            <TextField
              onChange={event => handleChange('city', event.target.value)}
              value={formInput.city}
              error={formErrors?.city}
              helperText={renderArrayMultiline(formErrors?.city)}
              name='city'
              fullWidth
              size='small'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomeTypography>Code Postal</CustomeTypography>

            <OnlyNumbersInput
              max={99999}
              onChange={event => handleChange('zip_code', event?.target?.value)}
              value={formInput.zip_code}
              error={formErrors?.zip_code}
              helperText={renderArrayMultiline(formErrors?.zip_code)}
              name='zip_code'
              fullWidth
              size='small'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomeTypography>Commune</CustomeTypography>
            <TextField
              onChange={event => handleChange('common', event.target.value)}
              value={formInput.common}
              error={formErrors?.common}
              helperText={renderArrayMultiline(formErrors?.common)}
              name='common'
              fullWidth
              size='small'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomeTypography>Bâtiment</CustomeTypography>
            <TextField
              onChange={event => handleChange('batiment', event.target.value)}
              value={formInput.batiment}
              error={formErrors?.batiment}
              helperText={renderArrayMultiline(formErrors?.batiment)}
              name='batiment'
              fullWidth
              size='small'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomeTypography>Escalier</CustomeTypography>
            <TextField
              onChange={event => handleChange('stairs', event.target.value)}
              value={formInput.stairs}
              name='stairs'
              fullWidth
              size='small'
              variant='outlined'
              error={formErrors?.stairs}
              helperText={renderArrayMultiline(formErrors?.stairs)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomeTypography>Etage</CustomeTypography>

            <OnlyNumbersInput
              max={100}
              onChange={event => handleChange('floor', event?.target?.value)}
              value={formInput.floor}
              name='floor'
              fullWidth
              size='small'
              variant='outlined'
              error={formErrors?.floor}
              helperText={renderArrayMultiline(formErrors?.floor)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomeTypography>Porte</CustomeTypography>
            <TextField
              onChange={event => handleChange('door', Number(event.target.value))}
              value={formInput.door}
              name='door'
              fullWidth
              size='small'
              variant='outlined'
              error={formErrors?.door}
              helperText={renderArrayMultiline(formErrors?.door)}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <div className='flex justify-center pt-2'>
              <CustomeTypography>Logement à améliorer</CustomeTypography>
            </div>
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomeAutoCompleteSelect
              option={'type'}
              value={formInput.nature_residence}
              onChange={value => handleChange('nature_residence', value)}
              data={listNatureResidences}
              formError={formErrors}
              error={formErrors?.nature_residence}
              displayOption={'entitled'}
              helperText={renderArrayMultiline(formErrors?.nature_residence)}
            />
          </Grid>
          <Grid item xs={12} md={2}></Grid>
          <Grid item xs={12} md={6}>
            {formInput.nature_residence === 1 ? (
              <div className='flex items-center'>
                <CustomeTypography>Travaux concernent les parties communes de l’immeuble:</CustomeTypography>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby='demo-controlled-radio-buttons-group'
                    name='controlled-radio-buttons-group'
                    value={formInput.work_commun_parts}
                    onChange={event => {
                      handleChange('work_commun_parts', event.target.value)
                    }}
                  >
                    <FormControlLabel labelPlacement='start' value={1} control={<Radio />} label='Oui' />
                    <FormControlLabel labelPlacement='start' value={0} control={<Radio />} label='Non' />
                  </RadioGroup>
                </FormControl>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <div className='flex items-center'>
              <CustomeTypography>Construit depuis plus de 15 ans:</CustomeTypography>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby='demo-controlled-radio-buttons-group'
                  name='controlled-radio-buttons-group'
                  value={formInput.more_than_fifteen}
                  onChange={event => handleChange('more_than_fifteen', event.target.value)}
                >
                  <FormControlLabel labelPlacement='start' value={1} control={<Radio />} label='Oui' />
                  <FormControlLabel labelPlacement='start' value={0} control={<Radio />} label='Non' />
                </RadioGroup>
              </FormControl>
              <OnlyNumbersInput
                max={9999}
                onChange={event => handleChange('logement_date_creation', event?.target?.value)}
                value={formInput.logement_date_creation}
                name='logement_date_creation'
                size='small'
                label='Année de construction'
                variant='outlined'
                error={formErrors?.logement_date_creation}
                helperText={renderArrayMultiline(formErrors?.logement_date_creation)}
                sx={{ marginLeft: 5 }}
              />
            </div>
            {formInput.more_than_fifteen == 0 ? (
              <FormHelperText>
                <Typography color='error.dark'>Le ménage est inéligible à l'aide</Typography>
              </FormHelperText>
            ) : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <div className='flex items-center'>
              <CustomeTypography>
                Vous avez bénéficié d’un Prêt à Taux Zéro (PTZ) du ministère du Logement au cours des cinq dernières
                années pour son acquisition :
              </CustomeTypography>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby='demo-controlled-radio-buttons-group'
                  name='controlled-radio-buttons-group'
                  value={formInput.ptz_beneficiary}
                  onChange={event => {
                    handleChange('ptz_beneficiary', event.target.value)
                  }}
                  error={formErrors?.ptz_beneficiary}
                  helperText={renderArrayMultiline(formErrors?.ptz_beneficiary)}
                >
                  <FormControlLabel labelPlacement='start' value={1} control={<Radio />} label='Oui' />
                  <FormControlLabel labelPlacement='start' value={0} control={<Radio />} label='Non' />
                </RadioGroup>
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <div className='flex items-center'>
              <CustomeTypography>
                Travaux vont être réalisés partiellement ou totalement dans le cadre du dispositif d’auto-réhabilitation
                avec un opérateur spécialisé :
              </CustomeTypography>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby='demo-controlled-radio-buttons-group'
                  name='controlled-radio-buttons-group'
                  value={formInput.auto_rehabilitation}
                  onChange={event => {
                    handleChange('auto_rehabilitation', event.target.value)
                  }}
                  error={formErrors?.auto_rehabilitation}
                  helperText={renderArrayMultiline(formErrors?.auto_rehabilitation)}
                >
                  <FormControlLabel labelPlacement='start' value={1} control={<Radio />} label='Oui' />
                  <FormControlLabel labelPlacement='start' value={0} control={<Radio />} label='Non' />
                </RadioGroup>
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <div className='flex flex-col items-center justify-center gap-2'>
              <CustomeTypography>
                Pour le bénéfice de la prime <span className='text-green-700'>Habiter Mieux sérénité</span>, indiquez la
                consommation énergétique conventionnelle en kWh ep/m2 .an de votre logement :
              </CustomeTypography>
              <Grid container spacing={2}>
                <Grid item md={4}></Grid>
                <Grid item xs={12} md={2}>
                  <CustomeTypography>Avant travaux</CustomeTypography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    onChange={event => handleChange('energy_consumption_before', event.target.value)}
                    value={formInput.energy_consumption_before}
                    name='energy_consumption_before'
                    size='small'
                    variant='outlined'
                    sx={{ marginLeft: 5 }}
                    label='kWh ep/m2'
                    error={formErrors?.energy_consumption_before}
                    helperText={renderArrayMultiline(formErrors?.energy_consumption_before)}
                  />
                </Grid>
                <Grid item md={4}></Grid>

                <Grid item md={4}></Grid>

                <Grid item xs={12} md={2}>
                  <CustomeTypography>Projetée après travaux</CustomeTypography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    onChange={event => handleChange('energy_consumption_after', event.target.value)}
                    value={formInput.energy_consumption_after}
                    name='energy_consumption_after'
                    size='small'
                    variant='outlined'
                    sx={{ marginLeft: 5 }}
                    label='kWh ep/m2'
                    error={formErrors?.energy_consumption_after}
                    helperText={renderArrayMultiline(formErrors?.energy_consumption_after)}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomeTypography>Travaux souhaités</CustomeTypography>
            <CustomeAutoCompleteSelect
              option={'type'}
              value={formInput.work_type}
              onChange={value => handleChange('work_type', value)}
              data={listWorkType}
              formError={formErrors}
              error={formErrors?.work_type}
              displayOption={'entitled'}
              helperText={renderArrayMultiline(formErrors?.work_type)}
            />
          </Grid>
          {formInput.work_type === 3 ? (
            <Grid item xs={12} md={12}>
              <TextField
                multiline
                rows={4}
                onChange={event => handleChange('work_description', event.target.value)}
                value={formInput.work_description}
                name='work_description'
                fullWidth
                variant='outlined'
                label='Précisez-en la nature des travaux '
                sx={{
                  '& textarea': {
                    minHeight: '50px '
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '12px 14px'
                  }
                }}
                error={formErrors?.work_description}
                helperText={renderArrayMultiline(formErrors?.work_description)}
              />
            </Grid>
          ) : null}
        </Grid>
      </CustomAccordian>
      {SubmitButton ? (
        <Grid container>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} className='flex justify-end !mb-4'>
            <LoadingButton
              variant='contained'
              color='primary'
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={handleUpdateProject}
              loading={updateProjectMutation.isPending}
            >
              Enregitrer
            </LoadingButton>
          </Grid>
        </Grid>
      ) : null}
    </div>
  )
})

export default Form1
