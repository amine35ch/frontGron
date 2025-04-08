// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

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

// ** Demo Components Imports

import CustomCollapseComponent from 'src/components/CustomCollapseComponent'

import { useTheme } from '@emotion/react'
import CardDetailsProject from '../Cards/CardDetailsProject'

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const TabsDetailsEntites = ({
  dataDetails,

  tabsDocumentTitle,
  listTypeDocumentClient
}) => {
  // ** Hooks
  const router = useRouter()

  // ** State
  const [activeTab, setActiveTab] = useState('Projets')
  const [isLoading, setIsLoading] = useState(false)
  const [openModalFile, setopenModalFile] = useState(false)
  const theme = useTheme()

  // ** query

  // ** function

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab
          value='Projets'
          sx={{ fontSize: '15px !important' }}
          label='Projets'
          icon={<Icon icon='eos-icons:project-outlined' fontSize={'20px'} />}
        />
      </TabList>
      <Box sx={{ mt: 6 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Chargement...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='Projets'>
              <CustomCollapseComponent
                projects={dataDetails?.project_count?.to_do}
                titleCollapse={'A faire'}
                backgroundHex={'#a3a3a3'}
                background={'bg-neutral-400'}
              />
              <CustomCollapseComponent
                projects={dataDetails?.project_count?.current}
                titleCollapse={'En cours'}
                backgroundHex={'#38bdf8'}
                background={'bg-sky-400'}
              />
              <CustomCollapseComponent
                projects={dataDetails?.project_count?.finished}
                state={dataDetails?.projects}
                titleCollapse={'Terminés'}
                backgroundHex={'#f472b6'}
                background={'bg-pink-400'}
              />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default TabsDetailsEntites
