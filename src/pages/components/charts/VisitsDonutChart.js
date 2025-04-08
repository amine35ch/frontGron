// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// visits services
import { useGetVisitsData } from 'src/services/visits.service'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#86A039',
  series5: '#FF8131'
}

const VisitsDonutChart = () => {
  const { data: visitsData, isLoading, isError } = useGetVisitsData()

  // ** Hook
  const theme = useTheme()

  // If loading or there's an error, display skeleton
  if (isLoading || isError || !visitsData) {
    return (
      <Card>
        <CardHeader
          title={
            isLoading ? <Skeleton animation='wave' height={20} width='80%' style={{ marginBottom: 6 }} /> : 'Visites'
          }
          subheader={
            isLoading ? <Skeleton animation='wave' height={12} width='40%' /> : 'Nombres de visites par catégorie'
          }
        />
        <CardContent>
          <Skeleton animation='wave' variant='rectangular' height={350} />
        </CardContent>
      </Card>
    )
  }

  const series = visitsData?.percentage?.map(Number) || [0, 0]

  const options = {
    stroke: { width: 0 },
    labels: [' A faire', 'Effectués'],
    colors: [donutColors.series4, donutColors.series5], // Use only two colors for two data options
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: val => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              label: 'à faire',
              formatter: () => `${series[0]}%`,
              color: theme.palette.text.primary
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Visites'
        subheader='Nombres de visites par catégorie'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        <ReactApexcharts type='donut' height={400} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default VisitsDonutChart
