// ** React Imports
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'

// ** MUI Imports
import { Grid, TextField, Typography } from '@mui/material'
import {
  useGetEnergyClasseSkips,
  useGetListEnergyClasses,
  useGetListIncomeClasses,
  useGetMarScales
} from 'src/services/settings.service'
import { marAmount, operationUnitPrice } from './simulateCalculator'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useSubmitSimulation } from 'src/services/project.service'
import { useRouter } from 'next/router'
import CustomAccordian from 'src/components/CustomAccordian'
import TotalCard from 'src/components/TotalCard'
import { useReducer } from 'react'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'
import { batch } from 'react-redux'

import WorkService from '../Projects/components/work-service'
import TotalCardTraveaux from '../DevisTravaux/components/TotalCardTraveaux'
import toast from 'react-hot-toast'

const mesureList = [
  { id: 1, title: 'Oui' },
  { id: 0, title: 'Non' }
]

// ** Initial state
const initialState = {
  shab: 0,
  nombreEtage: 0,
  mesures: 0,
  classeEnergetique: 7,
  incomeClasse: 4,
  sautClasse: 2,
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

const Simulator = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { detailsProject, chooseInstaller = 0, hideButton = false, openAccordian = true } = props
  const router = useRouter()
  const { id } = router.query
  const [formError, setFormError] = useState(null)

  const [totals, setTotals] = useState({
    amount_ht: 0,
    amount_ttc: 0,
    amount_tva: 0,

    // REST
    TTC_rest: 0,
    ht_rest: 0,
    TVA_rest: 0,

    // ANAH
    TTC_anah: 0,
    HT_anah: 0,
    TVA_anah: 0
  })
  const [localWorkList, setLocalWorkList] = useState([])
  const [localWorks, setLocalWorks] = useState([])

  //**  React query
  const submitSimulationMutation = useSubmitSimulation({ id })
  const { data: marScaleList, isSuccess: marScaleListIsSuccess, isLoading: marScaleListIsLoading } = useGetMarScales()

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

  const isDisabled = detailsProject.isEditable

  useEffect(() => {
    let total = 0

    const localRows = []
    const localOperations = []
    detailsProject?.works?.forEach(item => {
      localRows.push({
        id: item?.work?.id,
        unit: item?.work?.unit,
        entitled: item?.entitled,
        value: item?.qty,
        cost_ht: item?.cost_ht_simulation,
        pricing_list: item?.work?.pricing_list,
        price_unit_ht: item?.price_unit_ht
      })

      total = total + item?.cost_ht_simulation
      localOperations.push(item?.work)
    })

    batch(() => {
      dispatch({ type: 'SET_INCOME_CLASSE', payload: detailsProject?.income_class ?? 4 })
      dispatch({ type: 'SET_INCOME_CLASSE', payload: detailsProject?.income_class ?? 4 })
      dispatch({ type: 'SET_CLASSE_ENERGETIQUE', payload: detailsProject?.performance_energy_before_work ?? 7 })
      dispatch({ type: 'SET_SHAB', payload: detailsProject?.surface_housing_before_work })
      dispatch({ type: 'SET_SAUT_CLASSE', payload: detailsProject?.class_skip || 2 })
      dispatch({ type: 'SET_NOMBRE_ETAGE', payload: detailsProject?.number_of_floors })
      dispatch({ type: 'SET_SCENARIO', payload: detailsProject?.scenario })
      dispatch({ type: 'SET_MESURES', payload: detailsProject?.isolated_surface ? 1 : 0 })
      dispatch({ type: 'SET_INSTALLER', payload: detailsProject?.installer?.id })
      dispatch({ type: 'SET_ISOLATED_SURFACE_VALUE', payload: detailsProject?.isolated_surface_value })
      dispatch({ type: 'SET_TOTAL', payload: total })
    })
    setLocalWorks(localRows)
  }, [])

  useEffect(() => {
    if (!detailsProject.scenario && detailsProject.works.length == 0 && localWorkList.length > 0) {
      handleSumbit(false)
    }
  }, [detailsProject, localWorkList])

  // const mar = marAmount(state.incomeClasse, marScaleList)

  const handleValueChange = (event, valueSetter) => {
    if (event?.target?.name === 'shab') {
      let localTotal = 0

      const updatedRows = localWorkList?.map(item => {
        if (item?.d_work_id) {
          const price_unit_ht = operationUnitPrice(item, event.target.value)
          const cost_ht = item?.qty * price_unit_ht
          localTotal += cost_ht

          return {
            ...item,
            price_unit_ht: price_unit_ht
          }
        }
        localTotal += item?.cost_ht_simulation

        return item
      })

      setLocalWorkList(updatedRows)
    }

    dispatch({ type: valueSetter, payload: event.target.value })
  }

  const handleSumbit = async (showToast = true) => {
    const displayWorks = localWorkList?.filter(work => work?.d_work_id)

    const scenario = displayWorks
      ?.map((work, index) => (index !== displayWorks?.length - 1 ? `${work?.entitled} + ` : work?.entitled))
      .join('')

    for (let i = 0; i < localWorkList?.length; i++) {
      const element = localWorkList[i]

      // Ensure element values are converted to string before using replace
      element.price_unit_ht_simulation = parseFloat(String(element?.price_unit_ht_simulation)?.replace(',', '.'))
      element.qty_simulation = parseFloat(String(element?.qty_simulation)?.replace(',', '.'))
    }

    const data = {
      isolated_surface_value: state.isolatedSurfaceValue,
      installer: state.installer,
      income_class: state.incomeClasse,
      performance_energy_before_work: state.classeEnergetique,
      surface_housing_before_work: state.shab,
      class_skip: state.sautClasse,
      number_of_floors: state.nombreEtage,
      scenario: scenario,
      works: localWorkList,
      cost_ht_simulation: totals.amount_ht,
      rest_ht_simulation: totals.ht_rest,
      cost_ttc_simulation: totals.amount_ttc,
      rest_ttc_simulation: totals.TTC_rest,
      isolated_surface: state.mesures
    }

    // Check data for debugging
    // console.log(
    //   'Data works:',
    //   data?.works,

    //   // Ensure that the value is properly handled as a string before replace
    //   parseFloat(String(data?.works[0]?.price_unit_ht_simulation)?.replace(',', '.'))
    // )

    // Uncomment the following to handle submit
    let err = false
    let errMessages = {}
    if (!state.classeEnergetique || state.classeEnergetique == 7) {
      if (showToast) {
        toast.error('veuillez sélectionner une classe Energetique')
      }
      errMessages['performance_energy_before_work'] = 'veuillez sélectionner une classe Energetique'
      err = true
    }
    if (state.incomeClasse == 4) {
      if (showToast) {
        toast.error('veuillez sélectionner une Catégorie ')
      }
      errMessages['income_class'] = 'veuillez sélectionner une Catégorie'
      err = true
    }
    if (err) {
      setFormError(errMessages)
      
return
    }
    try {
      await submitSimulationMutation.mutateAsync(
        { data, hasInstaller: chooseInstaller, showToast },
        {
          onSuccess: data => {
            if (showToast) {
              toast.success(data?.data?.message)
            }
          }
        }
      )
      setFormError({})
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormError(errorsObject)
    }
  }

  return (
    <form className='self-center' onSubmit={e => handleSumbit()}>
      <CustomAccordian open={openAccordian} titleAccordian={'Informations générales'}>
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
              disabled={isDisabled}
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
              value={state.nombreEtage}
              onChange={event => handleValueChange(event, 'SET_NOMBRE_ETAGE')}
              fullWidth
              type={'number'}
              placeholder="Nombre d'étage"
              error={formError?.number_of_floors}
              helperText={formError?.number_of_floors}
              disabled={isDisabled}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Est-ce que vous avez les mesures des sufaces à isoler ? <strong className='text-red-500'>*</strong>
            </Typography>
            <CustomeAutoCompleteSelect
              data={mesureList}
              value={state.mesures}
              onChange={value => dispatch({ type: 'SET_MESURES', payload: value })}
              error={formError?.isolated_surface}
              helperText={formError?.isolated_surface}
              option='id'
              displayOption='title'
              disabled={isDisabled}
            />
          </Grid>
          {state.mesures === 1 ? (
            <Grid item xs={6} sm={6}>
              <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Surface à isoler : <strong className='text-red-500'>*</strong>
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
                disabled={isDisabled}
              />
            </Grid>
          ) : null}
          <Grid item xs={6} sm={6}>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Classe énergétique intial <strong className='text-red-500'>*</strong>
            </Typography>
            <CustomeAutoCompleteSelect
              data={energyClasseList}
              value={state.classeEnergetique}
              onChange={value => dispatch({ type: 'SET_CLASSE_ENERGETIQUE', payload: value })}
              option='type'
              displayOption='entitled'
              helperText={formError?.performance_energy_before_work}
              error={formError?.performance_energy_before_work}
              disabled={isDisabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Sauts de classe prévu <strong className='text-red-500'>*</strong>
            </Typography>
            <CustomeAutoCompleteSelect
              data={energyClasseSkipsList}
              value={state.sautClasse}
              onChange={value => dispatch({ type: 'SET_SAUT_CLASSE', payload: value })}
              error={formError?.class_skip}
              helperText={formError?.class_skip}
              option='type'
              displayOption='entitled'
              disabled={isDisabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Catégorie <strong className='text-red-500'>*</strong>
            </Typography>
            <CustomeAutoCompleteSelect
              data={incomeClasseList}
              value={state.incomeClasse}
              onChange={value => dispatch({ type: 'SET_INCOME_CLASSE', payload: value })}
              error={formError?.income_class}
              helperText={formError?.income_class}
              option='type'
              displayOption='entitled'
              disabled={isDisabled}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      <Grid container>
        <Grid item xs={6}></Grid>

        <Grid item xs={6} mb={3} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            color='primary'
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer', mt: 5 }}
            onClick={() => handleSumbit()}
            loading={submitSimulationMutation.isPending}
            disabled={isDisabled}
          >
            Enregistrer
          </LoadingButton>
        </Grid>
      </Grid>
      <CustomAccordian open={false} titleAccordian={'Simulation'}>
        <Grid pt={5} pb={5} container spacing={5}>
          <Grid mt={5} item xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'}>
            <WorkService
              workList={detailsProject?.works}
              detailsProject={{ ...state, id: detailsProject?.id }}
              totals={totals}
              setTotals={setTotals}
              localWorkList={localWorkList}
              setLocalWorkList={setLocalWorkList}
            />
          </Grid>
        </Grid>
        <Grid container spacing={5} mt={2}>
          <Grid item sx={12} md={12}>
            <TotalCardTraveaux allAmounts={totals} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6}></Grid>

          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              color='primary'
              loadingPosition='start'
              className='h-[29px] w-[255px]'
              sx={{ fontSize: '12px', cursor: 'pointer', mt: 5 }}
              onClick={() => handleSumbit()}
              loading={submitSimulationMutation.isPending}
              disabled={isDisabled}
            >
              Enregistrer Simulation
            </LoadingButton>
          </Grid>
        </Grid>
      </CustomAccordian>
    </form>
  )
}

export default Simulator
