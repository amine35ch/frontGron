// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { useGetEventById } from 'src/services/calendar.service'
import { useUpdateDecisionProjectVisit, useUpdateProjectVisit } from 'src/services/projectVisit.service'
import CustomChip from 'src/@core/components/mui/chip'

const { LoadingButton } = require('@mui/lab')

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
import { useGetProjectCompanies, useGetProjects } from 'src/services/project.service'
import { useGetCollaborators, useGetCompaniesByRole } from 'src/services/collaborators.service'
import useStates from 'src/@core/hooks/useStates'
import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import moment from 'moment'

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

const UpdateEventSideBar = props => {
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
    company,
    idEvent,
    event,
    listCompanies,
    loadingCompanies
  } = props

  // ** create project visit

  // ** States
  const { user } = useAuth()
  const [values, setValues] = useState(defaultState)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)

  const handleInputChange = (fieldName, value) => {
    setValues(prevValues => ({ ...prevValues, [fieldName]: value }))
  }

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
    calendarApi.refetchEvents()
  }
  const { data: projectsList, isLoading } = useGetProjects()
  const { data: detailsEventById } = useGetEventById(idEvent)

  // const { data: listCollaborators, isLoading: loadingCollab } = useGetCollaborators({})

  const updateProjectVisitMutation = useUpdateProjectVisit()

  const updateDecisionProjectVisitMutation = useUpdateDecisionProjectVisit()

  // const [state, setState] = useState(2)
  const [state, setState] = useState(detailsEventById ? detailsEventById.state : 1)
  const { getStateByModel } = useStates()

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: detailsEventById?.name || '' } })

  useEffect(() => {
    if (event) {
      setSelectedProjectId(event?.extendedProps?.project?.id)
      setSelectedCompanyId(event?.extendedProps?.company?.id)
    }
  }, [event, company])

  useEffect(() => {
    if (calendarApi) {
      calendarApi.refetchEvents()
    }
  }, [addEventSidebarOpen, calendarApi])

  const onSubmit = async () => {
    const formattedStartDate = format(values.startDate, 'yyyy-MM-dd HH:mm:ss')

    const data = {
      // entitled: data.title,
      // visit_date: formattedStartDate,
      // start_date: formattedStartDate,
      // type: values.calendar === 'Personal' ? 0 : 1,
      // d_project_id: selectedProjectId,
      // d_company_id: selectedCompanyId,

      // // end_date: formattedEndDate,
      // state: state === 1 ? 1 : 2

      visit_date: moment(formattedStartDate).format('YYYY-MM-DD HH:mm'),
      d_company_id: selectedCompanyId
    }
    try {
      await updateProjectVisitMutation.mutateAsync({ data, id: event?.publicId })

      handleSidebarClose()

      // resetToEmptyValues()
    } catch (error) {}
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (addEventSidebarOpen && detailsEventById) {
      const event = detailsEventById && detailsEventById
      setState(event.state)
      setValue('title', event.name || '')
      setValues({
        title: event.name || '',
        allDay: false,
        description: event.description || '',
        calendar: event.type.type === 0 ? 'Personal' : 'Business',
        endDate: new Date(event.visit_date),
        startDate: new Date(event.visit_date),
        d_project_id: event?.project?.id,
        d_company_id: event?.company?.id,
        state: event.state
      })
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, detailsEventById])

  const updateDecisionProjectVisite = async (state, id) => {
    const data = {
      state: state
    }
    try {
      await updateDecisionProjectVisitMutation.mutateAsync({ id: event?.publicId, data })

      handleSidebarClose()
    } catch (error) {}
  }

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
      <>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 6 }}>
          {event?.extendedProps?.state === 0 && (
            <LoadingButton
              loading={updateProjectVisitMutation?.isPending}
              size='small'
              type='button'
              variant='contained'
              color='primary'
              onClick={handleSubmit(onSubmit)}
            >
              Modifier
            </LoadingButton>
          )}
        </Box>

        {event?.extendedProps?.state === 0 && user?.profile !== 'MAR' && (
          <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4 }}>
            <LoadingButton
              variant='outlined'
              color='error'
              loading={updateDecisionProjectVisitMutation?.isPending}
              loadingPosition='start'
              className='h-[28px] !mx-4'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              startIcon={<IconifyIcon icon='icomoon-free:blocked' fontSize={13} />}
              onClick={() => updateDecisionProjectVisite(2)}
            >
              Non Valide
            </LoadingButton>

            <LoadingButton
              variant='outlined'
              color='primary'
              loading={updateDecisionProjectVisitMutation?.isPending}
              loadingPosition='start'
              className='h-[28px] '
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              startIcon={<IconifyIcon icon='mdi:check' />}
              onClick={() => updateDecisionProjectVisite(1)}
            >
              Accepter
            </LoadingButton>
          </Box>
        )}
      </>
    )
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
        <Typography variant='h6'>{event?.extendedProps?.state == 0 ? 'Modifier' : 'Détails'} viste</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' onClick={handleSidebarClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Statut de la visite
              </Typography>

              <CustomChip
                skin='light'
                size='small'
                label={getStateByModel('DProjectVisit', event?.extendedProps?.state)?.name}
                color={getStateByModel('DProjectVisit', event?.extendedProps?.state)?.color}
                sx={{
                  height: 20,
                  fontWeight: 500,

                  fontSize: '0.75rem',
                  alignSelf: 'flex-start',
                  color: 'text.secondary'
                }}
              />
            </Box>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Reference Projet
              </Typography>
              <TextField value={event?.extendedProps?.project?.reference} disabled={true} size='small' />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Titre
              </Typography>
              <Controller
                name='title'
                value={values.title}
                control={control}
                defaultValue={detailsEventById?.entitled || ''}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size='small'
                    autoFocus
                    value={value}
                    onChange={e => {
                      onChange(e)
                      handleInputChange('title', e.target.value)
                    }}
                    error={Boolean(errors.title)}
                  />
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
                Type
              </Typography>
              <Select
                size='small'
                value={values.calendar}
                labelId='event-calendar'
                onChange={e => {
                  setValues({ ...values, calendar: e.target.value })
                  handleInputChange('calendar', e.target.value)
                }}
              >
                <MenuItem value='Personal'>Visites </MenuItem>
                <MenuItem value='Business'>Traveaux</MenuItem>
              </Select>
            </FormControl>
            {/* {project ? null : (
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                  Dossier
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
                        {project?.reference}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )} */}
            {project ? null : (
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                  Pris en charge par
                </Typography>
                {event?.title === 'MAR' ? (
                  <TextField value={'MAR'} disabled={true} size='small' />
                ) : (
                  <Select
                    size='small'
                    value={selectedCompanyId}
                    labelId='event-company'
                    onChange={e => setSelectedCompanyId(e.target.value)}
                  >
                    {loadingCompanies ? (
                      <MenuItem value='' disabled>
                        Chargement...
                      </MenuItem>
                    ) : (
                      listCompanies?.map(collab => (
                        <MenuItem key={collab.id} value={collab.id}>
                          {collab.trade_name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              </FormControl>
            )}
            <Box sx={{ mb: 6 }}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34', mb: 1 }}>
                Date de début
              </Typography>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={values.endDate}
                selected={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent size='small' registername='startDate' />}
                onChange={date => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>

            <RenderSidebarFooter />
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

export default UpdateEventSideBar
