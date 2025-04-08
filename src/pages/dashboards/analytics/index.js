// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsSessions from 'src/views/dashboards/analytics/AnalyticsSessions'
import AnalyticsOverview from 'src/views/dashboards/analytics/AnalyticsOverview'
import AnalyticsPerformance from 'src/views/dashboards/analytics/AnalyticsPerformance'
import AnalyticsWeeklySales from 'src/views/dashboards/analytics/AnalyticsWeeklySales'
import AnalyticsVisitsByDay from 'src/views/dashboards/analytics/AnalyticsVisitsByDay'
import AnalyticsTotalRevenue from 'src/views/dashboards/analytics/AnalyticsTotalRevenue'
import AnalyticsSalesCountry from 'src/views/dashboards/analytics/AnalyticsSalesCountry'
import AnalyticsCongratulations from 'src/views/dashboards/analytics/AnalyticsCongratulations'
import AnalyticsActivityTimeline from 'src/views/dashboards/analytics/AnalyticsActivityTimeline'
import AnalyticsTotalTransactions from 'src/views/dashboards/analytics/AnalyticsTotalTransactions'
import AnalyticsProjectStatistics from 'src/views/dashboards/analytics/AnalyticsProjectStatistics'
import AnalyticsTopReferralSources from 'src/views/dashboards/analytics/AnalyticsTopReferralSources'
import ChartjsLineChart from 'src/views/charts/chartjs/ChartjsLineChart'
import ChartjsBarChart from 'src/views/charts/chartjs/ChartjsBarChart'
import ChartjsPolarAreaChart from 'src/views/charts/chartjs/ChartjsPolarAreaChart'
import ApexDonutChart from 'src/views/charts/apex-charts/ApexDonutChart'

import DevisBarchart from 'src/pages/components/charts/DevisBarchart'
import DocsPolarChart from 'src/pages/components/charts/DocsPolarChart'
import ReportLineChart from 'src/pages/components/charts/ReportLineChart'
import VisitsDonutChart from 'src/pages/components/charts/VisitsDonutChart'

import Chart from 'chart.js/auto'
import { useTheme } from '@mui/material/styles'

const AnalyticsDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
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
        <Grid item xs={12}>
          <DevisBarchart yellow={barChartYellow} labelColor={labelColor} borderColor={borderColor} />
        </Grid>

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
        <Grid item xs={12} md={8}>
          <AnalyticsActivityTimeline />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
