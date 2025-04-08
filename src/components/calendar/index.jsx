// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import Calendar from 'src/views/apps/calendar/Calendar'
import SidebarLeft from 'src/views/apps/calendar/SidebarLeft'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import AddEventSidebar from 'src/views/apps/calendar/AddEventSidebar'

// import Calendar from './Calendar'

import { useAuth } from 'src/hooks/useAuth'

// Import your new React Query services
import { useGetAllProjectVisits, useGetProjectVisitsById, useGetEventById } from 'src/services/calendar.service'

// ** Actions
import {
  addEvent,
  fetchEvents,
  deleteEvent,
  updateEvent,
  handleSelectEvent,
  handleAllCalendars,
  handleCalendarsUpdate
} from 'src/store/apps/calendar'
import UpdateEventSideBar from 'src/views/apps/calendar/UpdateEventSideBar'
import { useGetListProject } from 'src/services/project.service'
import { useGetListCompany } from 'src/services/company.service'
import {
  useGetCollaborators,
  useGetCompaniesByRole,
  useGetCompaniesInspectors
} from 'src/services/collaborators.service'

// ** CalendarColors
const calendarsColor = {
  'Visites à faire': 'primary',
  'Visites éffectués': 'warning'
}

const AppCalendar = () => {
  // ** States
  const [calendarApi, setCalendarApi] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)

  // const [formInput, setFormInput] = useState({
  //   project: '',
  //   user: '',
  //   company: '',
  //   supervisor: ''
  // })
  const [project, setProject] = useState('')
  const [user, setUser] = useState('')
  const [companyState, setCompany] = useState('')
  const [supervisor, setSupervisor] = useState('')

  // ** Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const store = useSelector(state => state.calendar)
  const auth = useAuth()

  const company = auth && auth.user.company

  // ** Vars
  const leftSidebarWidth = 260
  const addEventSidebarWidth = 400
  const { skin, direction } = settings
  const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))

  // Use the new React Query hooks for fetching visits
  const { data: listProject } = useGetListProject({})

  // const { data: listAuditeur } = useGetListCompany({
  //   type: 'aud',
  //   profile: 'auditors',
  //   id: auth?.user?.userable_id,
  //   state: 1
  // })

  const { data: listCollaborators } = useGetCompaniesInspectors({})

  const { data: allProjectVisits } = useGetAllProjectVisits({ project, company: companyState, user, supervisor })
  const [filtredEvents, setFiltredEvents] = useState([])
  const [idEvent, setIdEvent] = useState(null)
  const [event, setEvent] = useState(null)
  const [updateEventProject, setUpdateEventProject] = useState(false)
  const [role, setRole] = useState('AUD,INS')
  const { data: listCompanies, isLoading: loadingCompanies } = useGetCompaniesByRole({ role })

  const getTypeClassName = eventType => {
    switch (eventType) {
      case 0:
        return 'primary'
      case 1:
        return 'warning'
      case 2:
        return 'success'
      default:
        return 'info'
    }
  }

  const filtreEvents = events => {
    return events?.map(visit => ({
      id: visit.id,
      title: visit.name,
      start: new Date(visit.visit_date),
      end: new Date(visit.visit_date),
      classNames: getTypeClassName(visit.type.type),
      eventColor: visit?.state_color,
      state: visit?.state,
      project: visit?.project,
      company: visit?.company
    }))
  }

  useEffect(() => {
    setFiltredEvents(filtreEvents(allProjectVisits))
  }, [JSON.stringify(allProjectVisits)])

  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars))
  }, [dispatch, store.selectedCalendars])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const handleAddEventSidebarToggle = () => {
    if (addEventSidebarOpen) {
      setUpdateEventProject(false)
    }

    setAddEventSidebarOpen(!addEventSidebarOpen)
  }

  useEffect(() => {
    setIdEvent(null)
  }, [])

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        mdAbove={mdAbove}
        dispatch={dispatch}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        handleSelectEvent={handleSelectEvent}
        handleAllCalendars={handleAllCalendars}
        handleCalendarsUpdate={handleCalendarsUpdate}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        events={filtreEvents(allProjectVisits)}
        setFiltredEvents={setFiltredEvents}
        listProject={listProject}
        listCompanies={listCompanies}
        listCollaborators={listCollaborators}
        project={project}
        setProject={setProject}
        user={user}
        setUser={setUser}
        companyState={companyState}
        setCompany={setCompany}
        supervisor={supervisor}
        setSupervisor={setSupervisor}
      />
      <Box
        sx={{
          px: 5,
          pt: 3.75,
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
        }}
      >
        <Calendar
          store={store}
          dispatch={dispatch}
          direction={direction}
          updateEvent={updateEvent}
          calendarApi={calendarApi}
          calendarsColor={calendarsColor}
          setCalendarApi={setCalendarApi}
          handleSelectEvent={handleSelectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          events={filtredEvents}
          idEvent={idEvent}
          setIdEvent={setIdEvent}
          updateEventProject={updateEventProject}
          setUpdateEventProject={setUpdateEventProject}
          event={event}
          setEvent={setEvent}
        />
      </Box>

      {idEvent && updateEventProject && (
        <UpdateEventSideBar
          store={store}
          dispatch={dispatch}
          addEvent={addEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          calendarApi={calendarApi}
          drawerWidth={addEventSidebarWidth}
          handleSelectEvent={handleSelectEvent}
          addEventSidebarOpen={addEventSidebarOpen}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          idEvent={idEvent}
          project={project}
          company={company}
          event={event}
          listCompanies={auth?.user?.profile === 'MAR' ? listCompanies : listCollaborators}
          loadingCompanies={loadingCompanies}
        />
      )}
    </CalendarWrapper>
  )
}

export default AppCalendar
