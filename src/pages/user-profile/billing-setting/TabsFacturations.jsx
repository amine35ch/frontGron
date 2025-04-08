// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Card, CardContent, Box } from '@mui/material'
import ListFactures from './ListFactures'
import ListProject from 'src/views/Projects/ListProject'
import PendingFeatures from './PendingFeatures'

// Styled TabList component
const MuiBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}))

const TabList = styled(MuiTabList)(({ theme }) => ({
  overflow: 'visible',
  '& .MuiTabs-flexContainer': {
    flexDirection: 'column'
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minHeight: 40,
    minWidth: 280,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: theme.shape.borderRadius,
    '& svg': {
      marginBottom: 0,
      marginRight: theme.spacing(1)
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%'
    }
  }
}))

const TabsFacturations = ({ data, activeTab, tabs, handleChange }) => {
  const renderTabContent = () => {
    return tabs?.map(tab => {
      return (
        <TabPanel key={tab?.id} value={tab?.name} sx={{ p: 6, pt: 0, width: '100%' }}>
          <Box key={tab?.id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' sx={{ height: 42, width: 42 }}>
                <Icon icon={tab?.icon} fontSize={28} />
              </CustomAvatar>
              <Box sx={{ ml: 4 }}>
                <Typography variant='h5'>{tab?.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{tab?.subtitle}</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
              {tab?.name === 'Dossiers' ? (
                <div className='overflow-x-auto'>
                  <ListProject state={2} showAllColumn={true} addNew={true} withCheckbox={true} />
                </div>
              ) : tab?.name === 'Factures' ? (
                <ListFactures />
              ) : (
                <PendingFeatures />
              )}
            </Box>
          </Box>
        </TabPanel>
      )
    })
  }

  const renderTabs = () => {
    return tabs?.map((tab, index) => {
      return (
        <Tab
          sx={{ textAlign: 'left !important', fontSize: '14px' }}
          key={index}
          value={tab?.name}
          label={tab?.name}
          icon={<Icon icon={tab?.icon} fontSize={20} />}
        />
      )
    })
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <MuiBox>
          <TabContext value={activeTab}>
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <TabList onChange={handleChange}>{renderTabs()}</TabList>
            </Box>
            {renderTabContent()}
          </TabContext>
        </MuiBox>
      </CardContent>
    </Card>
  )
}

export default TabsFacturations
