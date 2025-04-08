// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
//import FullCalendar from '@fullcalendar/react'
//import listPlugin from '@fullcalendar/list'
//import dayGridPlugin from '@fullcalendar/daygrid'
//import timeGridPlugin from '@fullcalendar/timegrid'
//import interactionPlugin from '@fullcalendar/interaction'
//import frLocale from '@fullcalendar/core/locales/fr'
import format from 'date-fns/format'

// ** visits services **
import { useGetAllProjectVisits, useGetProjectVisitsById } from 'src/services/calendar.service'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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

const Calendar = ({
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
  project,
  setIdEvent,
  idEvent,
  setUpdateEventProject
}) => {
  const [activeEventId, setActiveEventId] = useState(null)

  const handleEventClick = ({ event }) => {
    setIdEvent(event._def.publicId)
    setActiveEventId(event._def.publicId || null)
    setUpdateEventProject(!!event._def.publicId)
    handleSelectEvent()
    handleAddEventSidebarToggle(event)
    handleLeftSidebarToggle()
  }

  const handleDateClick = ({ date }) => {
    handleAddEventSidebarToggle(date)

    const eventsOnClickedDate = events.filter(
      event => format(event.start, 'yyyy-MM-dd HH:mm:ss') === format(date, 'yyyy-MM-dd HH:mm:ss')
    )
  }

  const handleEventDrop = async ({ event }) => {
    const updatedEvent = {
      id: event.extendedProps?.originalData?.id,
      start: event.start,
      end: event.end
    }

    await dispatch(updateEvent(updatedEvent))
  }

  const handleEventResize = async ({ event }) => {
    const updatedEvent = {
      id: event.extendedProps?.originalData?.id,
      start: event.start,
      end: event.end
    }


    await dispatch(updateEvent(updatedEvent))
  }

  const handleInitialRender = ({ view }) => {
    setCalendarApi(view.calendar)
  }

  const eventRender = ({ event, el }) => {
    // Customize event color based on your conditions
    el.style.backgroundColor = 'red' // Example color
  }

  return (
    <FullCalendar
      locales={[frLocale]}
      locale='fr'
      events={  events?.length
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
        : []}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      initialView='dayGridMonth'
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={store.weekendsVisible}
      datesSet={handleInitialRender}
      eventClick={handleEventClick}
      eventDrop={handleEventDrop}
      eventResize={handleEventResize}
      dateClick={handleDateClick}
      eventRender={eventRender}
    />
  )
}

export default Calendar
