import React from 'react'

import StepDocuments from 'src/components/StepDocuments'

import { LoadingButton } from '@mui/lab'
import { Grid, TextField, Typography, Divider } from '@mui/material'
import { useEffect, useReducer, useState } from 'react'
import { batch } from 'react-redux'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'

import {
  useGetListEnergyClasses,
  useGetListIncomeClasses,
  useMergeAgent,
  useSubmitGeneralInformation
} from 'src/services/project.service'
import { useGetEnergyClasseSkips } from 'src/services/settings.service'

const mesureList = [
  { id: 1, title: 'Oui' },
  { id: 0, title: 'Non' }
]

// ** Initial state
const initialState = {
  shab: 0,
  nombreEtage: 0,
  mesures: 1,
  classeEnergetique: '',
  incomeClasse: '',
  sautClasse: 1,
  total: 0,
  scenario: null,
  rows: [],
  rowsSecond: [],
  installer: null,
  formError: null,
  isolatedSurfaceValue: null
}

// ** Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SHAB':
      return { ...state, shab: action.payload }
    case 'SET_NOMBRE_ETAGE':
      return { ...state, nombreEtage: action.payload }
    case 'SET_MESURES':
      return { ...state, mesures: action.payload }
    case 'SET_CLASSE_ENERGETIQUE':
      return { ...state, classeEnergetique: action.payload }
    case 'SET_INCOME_CLASSE':
      return { ...state, incomeClasse: action.payload }
    case 'SET_SAUT_CLASSE':
      return { ...state, sautClasse: action.payload }
    case 'SET_TOTAL':
      return { ...state, total: action.payload }
    case 'SET_SCENARIO':
      return { ...state, scenario: action.payload }
    case 'SET_ROWS':
      return { ...state, rows: action.payload }
    case 'SET_ROWS_SECOND':
      return { ...state, rowsSecond: action.payload }
    case 'SET_INSTALLER':
      return { ...state, installer: action.payload }
    case 'SET_FORM_ERROR':
      return { ...state, formError: action.payload }
    case 'SET_ISOLATED_SURFACE_VALUE':
      return { ...state, isolatedSurfaceValue: action.payload }
    default:
      return state
  }
}

const StepFinaleSetupWork = ({ id, detailsProject }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [formError, setFormError] = useState(null)

  const [localWorkList, setLocalWorkList] = useState([])

  const submitGeneralInformationMutation = useSubmitGeneralInformation({ id })

  const {
    data: incomeClasseList,
    isSuccess: incomeClasseListIsSuccess,
    isLoading: incomeClasseListIsLoading
  } = useGetListIncomeClasses()

  const {
    data: energyClasseList,
    isSuccess: energyClasseListIsSuccess,
    isLoading: energyClasseListIsLoading
  } = useGetListEnergyClasses()

  const {
    data: energyClasseSkipsList,
    isSuccess: energyClasseSkipsListIsSuccess,
    isLoading: energyClasseSkipsListIsLoading
  } = useGetEnergyClasseSkips()

  useEffect(() => {
    batch(() => {
      dispatch({ type: 'SET_INCOME_CLASSE', payload: detailsProject?.income_class })
      dispatch({ type: 'SET_CLASSE_ENERGETIQUE', payload: detailsProject?.performance_energy_before_work })
      dispatch({ type: 'SET_SHAB', payload: detailsProject?.surface_housing_before_work })
      dispatch({ type: 'SET_SAUT_CLASSE', payload: detailsProject?.class_skip })
      dispatch({ type: 'SET_NOMBRE_ETAGE', payload: detailsProject?.number_of_floors })
      dispatch({ type: 'SET_SCENARIO', payload: detailsProject?.scenario })
      dispatch({ type: 'SET_MESURES', payload: detailsProject?.isolated_surface })
      dispatch({ type: 'SET_INSTALLER', payload: detailsProject?.installer?.id })
      dispatch({ type: 'SET_ISOLATED_SURFACE_VALUE', payload: detailsProject?.isolated_surface_value })
    })
  }, [])

  const handleValueChange = (event, valueSetter) => {
    dispatch({ type: valueSetter, payload: event.target.value })
  }

  const handleSumbit = async e => {
    const data = {
      performance_energy_before_work: state.classeEnergetique,
      surface_housing_before_work: state.shab,
      class_skip: state.sautClasse,
      number_of_floors: state.nombreEtage,
      isolated_surface: state.mesures,
      isolated_surface_value: state.isolatedSurfaceValue,
      income_class: state.incomeClasse
    }

    try {
      await submitGeneralInformationMutation.mutateAsync(data)
      setFormError({})
    } catch (error) {
      const errorsObject = error?.response?.data?.errors

      // formError
      setFormError(errorsObject)
    }
  }

  return (
    <Grid container className='!mt-3' spacing={4}>
      <Grid item xs={12}>
        <form className='self-center' onSubmit={e => handleSumbit(e)}>
          <CustomAccordian titleAccordian={'Informations générales'}>
            <Grid pt={5} container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  SHAB
                </Typography>
                <TextField
                  type='number'
                  variant='outlined'
                  className='w-full !mt-1'
                  value={state.shab}
                  name='shab'
                  size='small'
                  onChange={event => handleValueChange(event, 'SET_SHAB')}
                  fullWidth
                  placeholder='SHAB (m²)'
                  sx={{ fontSize: '10px !important' }}
                  error={formError?.surface_housing_before_work}
                  helperText={formError?.surface_housing_before_work}
                />
                {/* <OnlyNumbersInput
              max={999}
              variant='outlined'
              className='w-full !mt-1'
              value={state.shab}
              name='shab'
              size='small'
              onChange={event => handleValueChange(event, 'SET_SHAB')}
              fullWidth
              placeholder='SHAB (m²)'
              sx={{ fontSize: '10px !important' }}
              error={formError?.surface_housing_before_work}
              helperText={formError?.surface_housing_before_work}
            /> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Nombre d'étage
                </Typography>

                <OnlyNumbersInput
                  max={100}
                  variant='outlined'
                  className='w-full !mt-1'
                  sx={{ fontSize: '10px !important' }}
                  size='small'
                  type={'number'}
                  value={state.nombreEtage}
                  onChange={event => handleValueChange(event, 'SET_NOMBRE_ETAGE')}
                  fullWidth
                  placeholder="Nombre d'étage"
                  error={formError?.number_of_floors}
                  helperText={formError?.number_of_floors}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Est-ce que vous avez les mesures des sufaces à isoler ?
                </Typography>
                <CustomeAutoCompleteSelect
                  data={mesureList}
                  value={state.mesures}
                  onChange={value => dispatch({ type: 'SET_MESURES', payload: value })}
                  error={formError?.isolated_surface}
                  helperText={formError?.isolated_surface}
                  option='id'
                  displayOption='title'
                />
              </Grid>
              {state.mesures === 1 ? (
                <Grid item xs={6} sm={6}>
                  <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Surface à isoler :
                  </Typography>

                  <OnlyNumbersInput
                    max={999}
                    variant='outlined'
                    className='w-full !mt-1'
                    value={state.isolatedSurfaceValue}
                    size='small'
                    onChange={event => handleValueChange(event, 'SET_ISOLATED_SURFACE_VALUE')}
                    fullWidth
                    placeholder='Mesures (m²)'
                    sx={{ fontSize: '10px !important' }}
                    error={formError?.isolated_surface_value}
                    helperText={formError?.isolated_surface_value}
                  />
                </Grid>
              ) : null}
              <Grid item xs={6} sm={6}>
                <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Classe énergétique intial
                </Typography>
                <CustomeAutoCompleteSelect
                  data={energyClasseList}
                  value={state.classeEnergetique}
                  onChange={value => dispatch({ type: 'SET_CLASSE_ENERGETIQUE', payload: value })}
                  option='type'
                  displayOption='entitled'
                  helperText={formError?.performance_energy_before_work}
                  error={formError?.performance_energy_before_work}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Sauts de classe prévu
                </Typography>
                <CustomeAutoCompleteSelect
                  data={energyClasseSkipsList}
                  value={state.sautClasse}
                  onChange={value => dispatch({ type: 'SET_SAUT_CLASSE', payload: value })}
                  error={formError?.class_skip}
                  helperText={formError?.class_skip}
                  option='type'
                  displayOption='entitled'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Catégorie
                </Typography>
                <CustomeAutoCompleteSelect
                  data={incomeClasseList}
                  value={state.incomeClasse}
                  onChange={value => dispatch({ type: 'SET_INCOME_CLASSE', payload: value })}
                  error={formError?.income_class}
                  helperText={formError?.income_class}
                  option='type'
                  displayOption='entitled'
                />
              </Grid>
            </Grid>
          </CustomAccordian>
          <Grid container>
            <Grid item xs={6}></Grid>

            <Grid item xs={6} className='flex justify-end'>
              <LoadingButton
                variant='contained'
                color='primary'
                loadingPosition='start'
                className='h-[29px] w-[105px]'
                sx={{ fontSize: '12px', cursor: 'pointer', mt: 5 }}
                onClick={() => handleSumbit()}
                loading={submitGeneralInformationMutation.isPending}
              >
                Enregistrer
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      {detailsProject?.missing_documents?.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant='body1' sx={{ color: 'secondary.main' }}>
            Aucun document manquant
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <StepDocuments
              typeProject={detailsProject?.type}
              stepDocuments={detailsProject?.step_documents}
              id={detailsProject?.id}
              detailsProject={detailsProject}
            />
          </Grid>{' '}
        </>
      )}
    </Grid>
  )
}

export default StepFinaleSetupWork
