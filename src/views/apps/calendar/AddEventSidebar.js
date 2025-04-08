// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useGetEventById } from 'src/services/calendar.service'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import format from 'date-fns/format'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** services
import { useCreateProjectVisit } from 'src/services/calendar.service'
import { useGetProjects } from 'src/services/project.service'
import { useGetClients } from 'src/services/client.service'
import { useGetCollaborators } from 'src/services/collaborators.service'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

const AddEventSidebar = props => {
  // ** Props
  const {
    store,
    dispatch,
    addEvent,
    updateEvent,
    drawerWidth,
    calendarApi,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle,
    project,
    company
  } = props

  // ** create project visit
  const createProjectVisitMutation = useCreateProjectVisit()

  // ** States
  const [values, setValues] = useState(defaultState)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [selectedCollabId, setselectedCollabId] = useState(null)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
    calendarApi.refetchEvents()
  }
  const { data: projectsList, isLoading } = useGetProjects()
  const { data: listCollaborators, isLoading: loadingCollab } = useGetCollaborators({})

  useEffect(() => {
    if (project) {
      setSelectedProjectId(project)
    }
    if (company) {
      setSelectedCompanyId(company.id)
    }
  }, [project, company])

  const onSubmit = async data => {
    const formattedStartDate = format(values.startDate, 'yyyy-MM-dd HH:mm:ss')
    const formattedEndDate = format(values.endDate, 'yyyy-MM-dd HH:mm:ss')

    const visits = [
      {
        name: data.title,
        visit_date: formattedStartDate,
        user_id: selectedCompanyId,
        type: values.calendar === 'Personal' ? 0 : 1,
        d_company_id: selectedCompanyId
      }
    ]

    const projectVisitData = {
      entitled: data.title,
      visit_date: formattedStartDate,
      start_date: formattedStartDate,
      type: values.calendar === 'Personal' ? 0 : 1,
      d_project_id: selectedProjectId,
      d_company_id: selectedCompanyId,
      end_date: formattedEndDate,
      visits: visits
    }

    try {
      await createProjectVisitMutation.mutateAsync(projectVisitData)

      // Handle success as needed
      handleSidebarClose()
      calendarApi.refetchEvents()
      resetToEmptyValues()
    } catch (error) {
      // Handle error as needed
      console.error('Error creating project visit:', error)
    }
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }

    // calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent
      setValue('title', event.title || '')
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        guests: event.extendedProps.guests || [],
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date()
      })
    }
  }, [setValue, store.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    return (
      <Fragment sx={{ display: 'flex', justifyContent: 'end', mt: 6 }}>
        <Button
          size='small'
          variant='outlined'
          color='secondary'
          sx={{ mr: 4, height: '26px' }}
          onClick={resetToEmptyValues}
        >
          Réinitialiser
        </Button>
        <Button size='small' type='button' variant='contained' onClick={handleSubmit(onSubmit)}>
          Ajouter
        </Button>
      </Fragment>
    )

    // if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
    //   return (
    //     <Fragment>
    //       <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
    //         Ajouter
    //       </Button>
    //       <Button size='large' variant='outlined' color='secondary' onClick={resetToEmptyValues}>
    //         Réinitialiser
    //       </Button>
    //     </Fragment>
    //   )
    // } else {
    //   return (
    //     <Fragment>
    //       <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
    //         Update
    //       </Button>
    //       <Button size='large' variant='outlined' color='secondary' onClick={resetToStoredValues}>
    //         Reset
    //       </Button>
    //     </Fragment>
    //   )
    // }
  }

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'background.default',
          p: theme => theme.spacing(3, 3.255, 3, 5.255)
        }}
      >
        <Typography variant='h6'>Ajouter événement</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? (
            <IconButton
              size='small'
              onClick={handleDeleteEvent}
              sx={{ color: 'text.primary', mr: store.selectedEvent !== null ? 1 : 0 }}
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          ) : null}
          <IconButton size='small' onClick={handleSidebarClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Titre <strong className='text-red-500'>*</strong>
              </Typography>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField size='small' autoFocus value={value} onChange={onChange} error={Boolean(errors.title)} />
                )}
              />
              {errors.title && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-title-error'>
                  Ce champ est obligatoire
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Type<strong className='text-red-500'>*</strong>
              </Typography>
              <Select
                size='small'
                value={values.calendar}
                labelId='event-calendar'
                onChange={e => setValues({ ...values, calendar: e.target.value })}
              >
                <MenuItem value='Personal'>Visites </MenuItem>
                <MenuItem value='Business'>Traveaux</MenuItem>
              </Select>
            </FormControl>
            {project ? null : (
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                  Dossiers <strong className='text-red-500'>*</strong>
                </Typography>
                <Select
                  size='small'
                  value={selectedProjectId}
                  labelId='event-project'
                  onChange={e => setSelectedProjectId(e.target.value)}
                >
                  {projectsList &&
                    projectsList?.map(project => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.client.first_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            {project ? null : (
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                  Inspecteurs <strong className='text-red-500'>*</strong>
                </Typography>
                <Select size='small' labelId='event-company' onChange={e => setselectedCollabId(e.target.value)}>
                  {loadingCollab ? (
                    <MenuItem value='' disabled>
                      Loading collaborators...
                    </MenuItem>
                  ) : (
                    listCollaborators?.map(collab => (
                      <MenuItem key={collab.id} value={collab.id}>
                        {collab.username}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
            <Box sx={{ mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Date de début<strong className='text-red-500'>*</strong>
              </Typography>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={values.endDate}
                selected={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent size='small' registername='startDate' />}
                onChange={date => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            {/* <Box sx={{ mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Date de fin<strong className='text-red-500'>*</strong>
              </Typography>
              <DatePicker
                selectsEnd
                id='event-end-date'
                endDate={values.endDate}
                selected={values.endDate}
                minDate={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent size='small' registername='endDate' />}
                onChange={date => setValues({ ...values, endDate: new Date(date) })}
              />
            </Box> */}
            {/* <FormControl sx={{ mb: 3 }}>
              <FormControlLabel
                label='Toute la journée'
                control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
              />
            </FormControl> */}
            {/* <TextField
              fullWidth
              type='url'
              id='event-url'
              sx={{ mb: 3 }}
              label='URL des événements'
              value={values.url}
              onChange={e => setValues({ ...values, url: e.target.value })}
            /> */}
            {/* <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id='event-guests'>Invités</InputLabel>
              <Select
                multiple
                label='Invités'
                value={values.guests}
                labelId='event-guests'
                id='event-guests-select'
                onChange={e => setValues({ ...values, guests: e.target.value })}
              >
                <MenuItem value='bruce'>Bruce</MenuItem>
                <MenuItem value='clark'>Clark</MenuItem>
                <MenuItem value='diana'>Diana</MenuItem>
                <MenuItem value='john'>John</MenuItem>
                <MenuItem value='barry'>Barry</MenuItem>
              </Select>
            </FormControl> */}
            {/* <TextField
              rows={4}
              multiline
              fullWidth
              sx={{ mb: 3 }}
              label='Description'
              id='event-description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
            /> */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 10, justifyContent: 'end' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar
