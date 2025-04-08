// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

// ** Third Party Imports
import { Line } from 'react-chartjs-2'

// visits services
import { useGetAnnualReportData } from 'src/services/report.service'

const ReportLineChart = props => {
  const { data: annualReportData, isLoading, isError } = useGetAnnualReportData()

  if (isLoading || isError || !annualReportData) {
    return (
      <Card>
        <CardHeader
          title={<Skeleton animation='wave' height={20} width='80%' style={{ marginBottom: 6 }} />}
          subheader={<Skeleton animation='wave' height={12} width='40%' />}
        />
        <CardContent>
          <Skeleton animation='wave' variant='rectangular' height={400} />
        </CardContent>
      </Card>
    )
  }

  // Extract labels and data from docsData
  const labels = annualReportData.labels?.map(String) || [
    'Jan',
    'Fev',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Aout',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const devisData = annualReportData.devis?.map(Number) || []
  const dossiersData = annualReportData.dossiers?.map(Number) || []
  const visitsData = annualReportData.visits?.map(Number) || []

  // ** Props
  const { white, primary, success, warning, labelColor, borderColor, legendColor } = props

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor
        }
      },
      y: {
        min: 0,
        max: 400,
        ticks: {
          stepSize: 100,
          color: labelColor
        },
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  }

  const datasets = [
    {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      label: 'Devis',
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: primary,
      backgroundColor: primary,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: primary,
      data: devisData
    },
    {
      fill: false,
      tension: 0.5,
      label: 'Dossiers',
      pointRadius: 1,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: warning,
      backgroundColor: warning,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: warning,
      data: dossiersData
    },
    {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      label: 'Visites',
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: success,
      backgroundColor: success,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: success,
      data: visitsData
    }
  ].filter(item => item.data.length > 0)

  const data = {
    labels: labels,
    datasets: datasets
  }

  return (
    <Card>
      <CardHeader title='Rapport des activités ' subheader='résumé des actions annuelles' />
      <CardContent>
        <Line data={data} height={400} options={options} />
      </CardContent>
    </Card>
  )
}

export default ReportLineChart
