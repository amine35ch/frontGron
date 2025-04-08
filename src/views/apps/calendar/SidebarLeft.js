// ** MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect'
import { useEffect, useState } from 'react'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useAuth } from 'src/hooks/useAuth'

const SidebarLeft = props => {
  const {
    mdAbove,
    calendarsColor,
    leftSidebarOpen,
    leftSidebarWidth,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    events,
    setFiltredEvents,
    listProject,
    listCompanies,
    listCollaborators,
    project,
    setProject,
    user,
    setUser,
    companyState,
    setCompany,
    supervisor,
    setSupervisor
  } = props
  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []
  const [filterValue, setFilterValue] = useState('all')
  const auth = useAuth()

  useEffect(() => {
    setFiltredEvents(filterEvents(events, filterValue))
  }, [filterValue])

  const filterEvents = (events, filterValue) => {
    return events?.filter(event => {
      return filterValue === 'Visites à faire'
        ? new Date(event.start) >= new Date()
        : filterValue === 'Visites éffectués'
        ? new Date(event.start) < new Date()
        : true
    })
  }

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]) => {
        return (
          <FormControlLabel
            key={key}
            label={key}
            sx={{ mb: 0.5 }}
            control={
              <Checkbox
                color={value}
                name='calendarFilters'
                checked={filterValue === 'all' || filterValue === key}
                onChange={() => setFilterValue(key)}
              />
            }
          />
        )
      })
    : null

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle()
  }
  if (renderFilters) {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 2,
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: leftSidebarWidth,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderBottomRightRadius: 0,
            p: theme => theme.spacing(5),
            zIndex: mdAbove ? 2 : 'drawer',
            position: mdAbove ? 'static' : 'absolute'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        {/* <Button
          fullWidth
          sx={{ fontSize: '12px', height: '26px' }}
          variant='contained'
          onClick={handleSidebarToggleSidebar}
        >
          Ajouter un événement
        </Button> */}

        <Typography variant='body2' sx={{ mb: 2.5, textTransform: 'uppercase' }}>
          Calendriers
        </Typography>
        <FormControlLabel
          label='Voir tout'
          sx={{ mr: 0, mb: 0.5 }}
          control={
            <Checkbox
              color='secondary'
              name='calendarFilters'
              checked={filterValue === 'all'}
              onChange={e => setFilterValue('all')}
            />
          }
        />
        {renderFilters}
        <Typography variant='body2' sx={{ mt: 7, mb: 2.5, textTransform: 'uppercase' }}>
          Filter
        </Typography>
        <div className=' w-full'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Projet
          </Typography>
          <div className='w-full'>
            <CustomeAutoCompleteSelect
              value={project}
              onChange={value => setProject(value)}
              data={listProject}
              option={'id'}
              fullWidth={true}
              displayOption={'reference'}
            />
          </div>
        </div>
        {auth?.user?.profile == 'MAR' && (
          <div className='mt-3 w-full'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Société
            </Typography>
            <div className='w-full'>
              <CustomeAutoCompleteSelect
                value={companyState}
                onChange={value => setCompany(value)}
                data={listCompanies}
                option={'id'}
                fullWidth={true}
                displayOption={'reference'}
              />
            </div>
          </div>
        )}
        <div className='mt-3 w-full'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Utilisateur
          </Typography>
          <CustomeAutoCompleteSelect
            value={user}
            onChange={value => setUser(value)}
            option={'id'}
            data={listCollaborators}
            displayOption={'last_name'}
            marginProps={true}
          />
        </div>
      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
