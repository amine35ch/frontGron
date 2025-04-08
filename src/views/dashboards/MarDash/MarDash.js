// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import DevisBarchart from 'src/pages/components/charts/DevisBarchart'
import DocsPolarChart from 'src/pages/components/charts/DocsPolarChart'
import ReportLineChart from 'src/pages/components/charts/ReportLineChart'
import VisitsDonutChart from 'src/pages/components/charts/VisitsDonutChart'

import DashCard from 'src/views/components/dashCard/DashCard'

import Chart from 'chart.js/auto'
import { useTheme } from '@mui/material/styles'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'
import Skeleton from '@mui/material/Skeleton'

// visits services
import { useGetDocsData } from 'src/services/docs.service'

// visits services
import { useGetVisitsData } from 'src/services/visits.service'

const MarDash = () => {
  const theme = useTheme()

  // Vars
  const whiteColor = '#fff'
  const yellowColor = '#FFC439'
  const primaryColor = '#86A039'
  const areaChartBlue = '#2c9aff'
  const barChartYellow = '#ffcf5c'
  const polarChartGrey = '#4f5d70'
  const polarChartInfo = '#299aff'
  const lineChartYellow = '#d4e157'
  const polarChartGreen = '#28dac6'
  const lineChartPrimary = '#787EFF'
  const lineChartWarning = '#ff9800'
  const horizontalBarInfo = '#26c6da'
  const polarChartWarning = '#ff8131'
  const scatterChartGreen = '#28c76f'
  const warningColorShade = '#ffbd1f'
  const areaChartBlueLight = '#84d0ff'
  const areaChartGreyLight = '#edf1f4'
  const scatterChartWarning = '#ff9f43'
  const borderColor = theme.palette.divider
  const labelColor = theme.palette.text.disabled
  const legendColor = theme.palette.text.secondary

  const { data: docsData, isLoading: docsLoading } = useGetDocsData()
  const { data: visitsData, isLoading: visitsLoading, isError } = useGetVisitsData()

  //calculate total from data array
  const calculateTotal = data => {
    return data?.reduce((acc, value) => acc + Number(value), 0)
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item spacing={5} md={8} className='flex flex-row gap-x-6'>
          <DashCard
            icon={
              docsLoading ? (
                <Skeleton variant='rect' width={40} height={40} />
              ) : (
                <Icon icon='material-symbols:call-received' />
              )
            }
            number={docsLoading ? <Skeleton width={80} /> : docsData?.data[0]}
            label={docsLoading ? <Skeleton width={80} /> : 'Nouveaux Dossiers'}
            total={docsLoading ? <Skeleton width={80} /> : `/${calculateTotal(docsData?.data)}`}
          />
          <DashCard
            icon={docsLoading ? <Skeleton variant='rect' width={40} height={40} /> : <Icon icon='carbon:in-progress' />}
            number={docsLoading ? <Skeleton width={80} /> : docsData?.data[1]}
            label={docsLoading ? <Skeleton width={80} /> : 'Dossiers en cours'}
            total={docsLoading ? <Skeleton width={80} /> : `/${calculateTotal(docsData?.data)}`}
          />
          <DashCard
            icon={docsLoading ? <Skeleton variant='rect' width={40} height={40} /> : <Icon icon='pajamas:task-done' />}
            number={docsLoading ? <Skeleton width={80} /> : docsData?.data[2]}
            label={docsLoading ? <Skeleton width={80} /> : 'Dossiers terminés'}
            total={docsLoading ? <Skeleton width={80} /> : `/${calculateTotal(docsData?.data)}`}
          />
          <DashCard
            icon={docsLoading ? <Skeleton variant='rect' width={40} height={40} /> : <Icon icon='lets-icons:stop' />}
            number={docsLoading ? <Skeleton width={80} /> : docsData?.data[3]}
            label={docsLoading ? <Skeleton width={80} /> : 'Dossiers suspendus'}
            total={docsLoading ? <Skeleton width={80} /> : `/${calculateTotal(docsData?.data)}`}
          />
        </Grid>

        <Grid item spacing={5} md={4} className='flex flex-row gap-x-6'>
          <DashCard
            icon={visitsLoading ? <Skeleton variant='rect' width={40} height={40} /> : <Icon icon='ri:todo-line' />}
            number={visitsLoading ? <Skeleton width={80} /> : visitsData?.chiffre[0]}
            label={visitsLoading ? <Skeleton width={80} /> : 'Visites à faire'}
            total={visitsLoading ? <Skeleton width={80} /> : `/${calculateTotal(visitsData?.chiffre)}`}
          />
          <DashCard
            icon={
              visitsLoading ? <Skeleton variant='rect' width={40} height={40} /> : <Icon icon='pajamas:task-done' />
            }
            number={visitsLoading ? <Skeleton width={80} /> : visitsData?.chiffre[1]}
            label={visitsLoading ? <Skeleton width={80} /> : 'Visites effectuées'}
            total={visitsLoading ? <Skeleton width={80} /> : `/${calculateTotal(visitsData?.chiffre)}`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocsPolarChart
            yellow={yellowColor}
            info={polarChartInfo}
            grey={polarChartGrey}
            primary={primaryColor}
            green={polarChartGreen}
            legendColor={legendColor}
            warning={polarChartWarning}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <VisitsDonutChart />
        </Grid>
        <Grid item xs={12} md={12}>
          <DevisBarchart yellow={barChartYellow} labelColor={labelColor} borderColor={borderColor} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Grid item xs={12}>
            <ReportLineChart
              white={whiteColor}
              labelColor={labelColor}
              success={lineChartYellow}
              borderColor={borderColor}
              legendColor={legendColor}
              primary={lineChartPrimary}
              warning={lineChartWarning}
            />
          </Grid>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default MarDash
