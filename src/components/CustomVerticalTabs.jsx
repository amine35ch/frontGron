import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardDetailsProject from 'src/views/components/Cards/CardDetailsProject'
import ListProjectVisit from 'src/views/project-visit/ListProjectVisit'
import ListItemsFiles from './ListItemsFiles'
import { Card, CardContent, Grid } from '@mui/material'
import Divider from '@mui/material/Divider'
import CustomChip from 'src/@core/components/mui/chip'
import CrudDataTable from './CrudDataTable'
import ProjectVisitColum from 'src/views/project-visit/ProjectVisitColum'
import StepDocuments from './StepDocuments'
import { useAuth } from 'src/hooks/useAuth'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      className='w-full'
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

export default function CustomVerticalTabs({
  tabs,
  detailsProject,
  listProjectVisit,
  page,
  setPage,
  pageSize,
  setPageSize
}) {
  const [value, setValue] = React.useState(0)
  const { user } = useAuth()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const projectVisitColumn = ProjectVisitColum({
    userRole: user.role.slice(5),
    resource: 'project-visit'
  })

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {tabs?.map((tab, index) => (
          <Tab label={tab} key={index} {...a11yProps(index)} />
        ))}
      </Tabs>
      {/* {children} */}
      <TabPanel value={value} index={0}>
        <CardDetailsProject project={detailsProject} viewDetailsProject={false} />
        <CrudDataTable
          query={listProjectVisit}
          columns={projectVisitColumn}
          data={listProjectVisit?.data}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          isLoading={false}
          resource='project-visit'
          resource_name='Projets Visite 2'
          showFilter={false}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CardDetailsProject project={detailsProject} viewDetailsProject={false} />
        <Card>
          <CardContent>
            <Grid container>
              <Grid item={12} md={6}>
                <div>
                  <span className='font-semibold' style={{ fontSize: '17px' }}>
                    Liste des Documents
                  </span>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={detailsProject?.documents?.length}
                    color={'primary'}
                    sx={{ height: 24, fontSize: '14px', fontWeight: 500, px: 2, marginLeft: '10px' }}
                  />
                </div>
              </Grid>
            </Grid>
            <Divider />
            {/* {detailsProject?.documents?.map((doc, key) =>
              doc?.versions?.map(
                (docVersion, index) =>
                  doc?.versions?.length - 1 == index && (
                    <ListItemsFiles
                      key={key}
                      doc={doc}
                      document={docVersion}
                      allVersion={doc?.versions}
                      authorizeDelete={false}
                    />
                  )
              )
            )} */}

            {/* <StepDocuments
              typeProject={detailsProject?.type}
              stepDocuments={detailsProject?.documents}
              id={detailsProject?.id}
            /> */}
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  )
}
