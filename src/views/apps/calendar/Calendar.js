import { useEffect, useRef } from 'react'
//import FullCalendar from '@fullcalendar/react'
//import listPlugin from '@fullcalendar/list'
//import dayGridPlugin from '@fullcalendar/daygrid'
//import timeGridPlugin from '@fullcalendar/timegrid'
//import interactionPlugin from '@fullcalendar/interaction'
import Icon from 'src/@core/components/icon'

import { useUpdateProjectVisit } from 'src/services/projectVisit.service'
import moment from 'moment'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = props => {
  const {
    store,
    dispatch,
    direction,
    updateEvent,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    events,
    setIdEvent,
    setUpdateEventProject,

    setEvent
  } = props
  const updateProjectVisitMutation = useUpdateProjectVisit()
  const calendarRef = useRef()
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi, setCalendarApi])

  const updateDateVisite = async (id, date) => {
    const data = {
      visit_date: moment(date).format('YYYY-MM-DD HH:mm'),
      user_id: null
    }

    try {
      await updateProjectVisitMutation.mutateAsync({ data, id: id })
      setopenModalDate(false)
    } catch (error) {}
  }

  const handleEventClick = event => {
    setIdEvent(event?._def?.publicId)
    setEvent(event?._def)
    setUpdateEventProject(true)
    handleSelectEvent()
    handleAddEventSidebarToggle(event)
    handleLeftSidebarToggle()
  }
  if (store) {
    const calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      events: events?.length
        ? events.map(e => ({
            ...e,
            id: e?.id,
            allDay: false,
            color: e?.color,
            start: e?.start,
            end: e?.end,
            title: e?.title,

            startEditable: e?.state == 0 ? true : false,
            editable: e?.state == 0 ? true : false
          }))
        : [],

      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      },
      editable: true,
      eventResizableFromStart: true,
      dragScroll: true,
      dayMaxEvents: 2,
      navLinks: true,
      eventClassNames({ event: calendarEvent }) {
        const colorName = calendarEvent.extendedProps.eventColor

        return [`bg-${colorName}`, 'cursor-pointer', '!py-2', '!rounded-2xl']
      },
      eventClick({ event: clickedEvent }) {
        dispatch(handleSelectEvent(clickedEvent))
        handleEventClick(clickedEvent)
      },
      customButtons: {
        sidebarToggle: {
          text: <Icon icon='mdi:menu' />,
          click() {
            handleLeftSidebarToggle()
          }
        }
      },
      dateClick(info) {
        const ev = { ...blankEvent }
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true
        dispatch(handleSelectEvent(ev))
        handleAddEventSidebarToggle()
      },
      eventDrop({ event: droppedEvent, oldEvent }) {
        dispatch(updateEvent(updateDateVisite(droppedEvent?._def?.publicId, droppedEvent.startStr)))
      },
      eventResize({ event: resizedEvent }) {
        dispatch(updateEvent(resizedEvent))
      },
      ref: calendarRef,
      direction
    }

    return <FullCalendar {...calendarOptions} />
  } else {
    return null
  }
}

export default Calendar
