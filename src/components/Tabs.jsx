import { useState } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Stack, useTheme } from '@mui/material'
import FavoriteAnahResponse from 'src/views/Projects/stepperProject/steps/favoriteAnahResponse'
import AnahModificationRequest from 'src/views/Projects/stepperProject/steps/AnahModificationRequest'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export default function TabsValidationAnah({ selectedValue, options, detailsProject }) {
  const theme = useTheme()

  const [value, setValue] = useState(selectedValue)

  const handleChange = (_, newValue) => {
    setValue(newValue)
  }

  return (
    <Stack
      direction='column'
      width='100%'
      sx={{
        border: '1.2px solid #0000001A',
        borderRadius: '5px'
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{
          style: {
            display: 'none'
          }
        }}
        sx={{
          backgroundColor: '#f7f7f9'
        }}
      >
        {options?.map(tab => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            icon={
              <span
                style={{
                  color: tab.value === value ? tab.color : '#0000008A'
                }}
              >
                {tab.icon}
              </span>
            }
            iconPosition='start'
            {...a11yProps(tab.value)}
            disabled={tab.value !== value}
            sx={{
              '&.Mui-selected': {
                borderTop: `5px solid ${tab.color}`,
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                backgroundColor: 'white',
                color: theme.palette.common.black,
                borderBottom: 'none'
              },
              '& .MuiTab-iconWrapper': {
                color: tab.value === value ? tab.color : 'inherit'
              }
            }}
          />
        ))}
      </Tabs>

      <TabPanel value={value} index={1}>
        <FavoriteAnahResponse detailsProject={detailsProject} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <AnahModificationRequest detailsProject={detailsProject} />
      </TabPanel>
    </Stack>
  )
}
