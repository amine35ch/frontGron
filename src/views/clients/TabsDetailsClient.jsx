// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CardDetailsProject from '../components/Cards/CardDetailsProject'

// ** Demo Components Imports

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const TabsDetailsClient = ({ dataDetails, tabsDocumentTitle, listTypeDocumentClient }) => {
  // ** Hooks

  // ** State
  const [activeTab, setActiveTab] = useState('Projets')
  const [isLoading, setIsLoading] = useState(false)

  // ** function
  useEffect(() => {
    setActiveTab(dataDetails?.projects[0]?.reference)
  }, [dataDetails])

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      {dataDetails?.projects?.length == 0 ? (
        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <img src={`/images/pages/empty-image.png`} alt='empty' />
          <p>Pas des projets.</p>
        </Box>
      ) : (
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='forced scroll tabs example'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          {dataDetails?.projects?.map((project, key) => (
            <Tab
              key={key}
              value={project?.reference}
              sx={{ fontSize: '15px !important' }}
              label={project?.reference}
              icon={<Icon icon='eos-icons:project-outlined' fontSize={'20px'} />}
            />
          ))}
        </TabList>
      )}
      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Chargement...</Typography>
          </Box>
        ) : (
          <>
            {dataDetails?.projects?.map((project, key) => (
              <TabPanel key={key} sx={{ p: 0 }} value={project?.reference}>
                <CardDetailsProject
                  listTypeDocumentClient={listTypeDocumentClient}
                  project={project}
                  viewDetailsProject={true}
                />
              </TabPanel>
            ))}
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default TabsDetailsClient
