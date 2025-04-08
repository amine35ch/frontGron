import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import { PolarArea } from 'react-chartjs-2'
import OptionsMenu from 'src/@core/components/option-menu'
import { useGetDocsData } from 'src/services/docs.service'

const DocsPolarChart = props => {
  const { data: docsData, isLoading, isError } = useGetDocsData()

  // If loading or there's an error, display skeleton
  if (isLoading || isError || !docsData) {
    return (
      <Card>
        <CardHeader
          title={
            isLoading ? <Skeleton animation='wave' height={20} width='80%' style={{ marginBottom: 6 }} /> : 'Dossiers'
          }
          subheader={isLoading ? <Skeleton animation='wave' height={12} width='40%' /> : 'Nombre de dossiers par état'}
        />
        <CardContent>
          <Skeleton animation='wave' variant='rectangular' height={350} />
        </CardContent>
      </Card>
    )
  }

  // Extract labels and data from docsData
  const labels = docsData.label?.map(String) || ['En cours', 'Terminés']
  const datas = docsData.data?.map(Number) || [0, 0]

  // ** Props
  const { info, grey, green, yellow, primary, warning, legendColor } = props

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  }

  const data = {
    labels: labels,
    datasets: [
      {
        borderWidth: 0,
        label: 'Population (millions)',
        data: datas,
        backgroundColor: [primary, yellow, warning, info]
      }
    ]
  }

  return (
    <Card>
      <CardHeader title='Dossiers' subheader='Nombre de dossiers par état' />
      <CardContent>
        <PolarArea data={data} height={350} options={options} />
      </CardContent>
    </Card>
  )
}

export default DocsPolarChart
