// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Backdrop from '@mui/material/Backdrop'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import CircularProgress from '@mui/material/CircularProgress'
import ListItem from '@mui/material/ListItem'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import { differenceInMinutes, differenceInHours, differenceInDays, format } from 'date-fns'
import { useInView } from 'react-intersection-observer'

// ** notification services
import {
  useGetNotifications,
  useMarkAllNotificationsAsSeen,
  useMarkNotificationAsSeen,
  useGetNewNotificationsCount
} from 'src/services/notification.service'

import { useRouter } from 'next/router'

// ** Email App Component Imports
import { setTimeout } from 'timers'
import MailDetails from './MailDetails'
import Iconify from '@iconify/iconify'
import IconifyIcon from 'src/@core/components/icon'

const MailItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  justifyContent: 'space-between',
  transition: 'border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  '&:not(:first-child)': {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  '&:hover': {
    zIndex: 2,
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
    '& .mail-actions': { display: 'flex' },
    '& .mail-info-right': { display: 'none' },
    '& + .MuiListItem-root': { borderColor: 'transparent' }
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}))

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const MailLog = props => {
  // ** Props
  const router = useRouter()

  const {
    store,
    hidden,
    dispatch,
    direction,
    updateMail,
    routeParams,
    labelColors,
    paginateMail,
    mailDetailsOpen,
    updateMailLabel,
    setMailDetailsOpen,
    handleSelectAllMail
  } = props

  // ** State
  const [refresh, setRefresh] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // ** Vars
  const folders = [
    {
      name: 'draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'inbox',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  ]

  const foldersConfig = {
    draft: {
      name: 'draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    spam: {
      name: 'spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    trash: {
      name: 'trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    inbox: {
      name: 'inbox',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  }

  const foldersObj = {
    inbox: [foldersConfig.spam, foldersConfig.trash],
    sent: [foldersConfig.trash],
    draft: [foldersConfig.trash],
    spam: [foldersConfig.inbox, foldersConfig.trash],
    trash: [foldersConfig.inbox, foldersConfig.spam]
  }

  const handleStarMail = (e, id, value) => {
    e.stopPropagation()
    dispatch(updateMail({ emailIds: [id], dataToUpdate: { isStarred: value } }))
  }

  const handleLabelUpdate = (id, label) => {
    const arr = Array.isArray(id) ? [...id] : [id]
    dispatch(updateMailLabel({ emailIds: arr, label }))
  }

  const handleFolderUpdate = (id, folder) => {
    const arr = Array.isArray(id) ? [...id] : [id]
    dispatch(updateMail({ emailIds: arr, dataToUpdate: { folder } }))
  }

  const mailDetailsProps = {
    hidden,
    folders,
    dispatch,
    direction,
    foldersObj,
    updateMail,
    routeParams,
    labelColors,
    paginateMail,
    handleStarMail,
    mailDetailsOpen,
    handleLabelUpdate,
    handleFolderUpdate,
    setMailDetailsOpen,
    mail: store && store.currentMail ? store.currentMail : null
  }

  // ** monitor view
  const { ref, inView } = useInView()

  const markAllNotificationsAsSeenMutation = useMarkAllNotificationsAsSeen()
  const { data: notificationsCount } = useGetNewNotificationsCount()

  const { data: notifications, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetNotifications()

  const getNotificationTimeAgo = createdAt => {
    const minutesDifference = differenceInMinutes(new Date(), new Date(createdAt))

    if (minutesDifference < 1) {
      return "À l'instant" // Custom message for "Just now"
    } else if (minutesDifference < 60) {
      return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} `
    } else {
      const hoursDifference = differenceInHours(new Date(), new Date(createdAt))

      if (hoursDifference < 24) {
        return `${hoursDifference} ${hoursDifference === 1 ? 'heure' : 'heures'} `
      } else {
        const daysDifference = differenceInDays(new Date(), new Date(createdAt))

        if (daysDifference <= 6) {
          return `${daysDifference} ${daysDifference === 1 ? 'jour' : 'jours'} `
        } else {
          return format(new Date(createdAt), 'dd/MM/yyyy') // If the notification is older than 6 days, return the date
        }
      }
    }
  }

  //**  Use useEffect to trigger fetching next page when inView
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const handleReadAllNotifications = async () => {
    try {
      await markAllNotificationsAsSeenMutation.mutateAsync()
    } catch (error) {}
  }

  const markNotificationAsSeenMutation = useMarkNotificationAsSeen()

  const handleNotificationClick = async (notificationId, endpoint, isSeen) => {
    try {
      if (isSeen != 1) await markNotificationAsSeenMutation.mutateAsync(notificationId)
    } catch (error) {}

    // Redirect to the 'dashboards/' route if endpoint is null
    if (endpoint === null) {
    } else {
      router.push(`${endpoint}`)
    }
  }

  const handleMailIconClick = async (notificationId, isSeen) => {
    try {
      if (isSeen !== 1) {
        await markNotificationAsSeenMutation.mutateAsync(notificationId)
      }
    } catch (error) {}
  }

  const content =
    notifications && notifications.pages.length ? (
      <List sx={{ p: 0 }}>
        {notifications.pages.map((page, pageIndex) =>
          page.data.map((notification, index) => {
            const mailReadToggleIcon = notification.vue === 1 ? 'mdi:email-open-outline' : 'mdi:email-outline'
            if (notifications.pages.length === pageIndex + 1 && page.length === index + 1) {
              return (
                <MailItem
                  ref={ref}
                  key={notification.id}
                  sx={{ backgroundColor: hoveredIndex === index ? 'action.hover' : 'background.paper' }}
                  onClick={() => {
                    handleNotificationClick(notification.id, notification.endpoint, notification.vue)
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        overflow: 'hidden',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' }
                      }}
                    >
                      <Typography
                        sx={{
                          mr: 4,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          width: ['100%', 'auto'],
                          overflow: ['hidden', 'unset'],
                          textOverflow: ['ellipsis', 'unset']
                        }}
                      >
                        {notification.action}
                      </Typography>
                      <Typography noWrap variant='body2' sx={{ width: '100%' }}>
                        {notification.description && notification.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    className='mail-actions'
                    sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}
                  >
                    <Tooltip placement='top' title={notification.vue === 1 ? '' : 'Lire notification'}>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation()
                          handleMailIconClick(notification.id, notification.vue)
                        }}
                      >
                        <Icon icon={mailReadToggleIcon} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    className='mail-info-right'
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                  >
                    <Typography
                      variant='caption'
                      sx={{ minWidth: '50px', textAlign: 'right', whiteSpace: 'nowrap', color: 'text.disabled' }}
                    >
                      {getNotificationTimeAgo(notification.created_at)}
                    </Typography>
                  </Box>
                </MailItem>
              )
            }

            return (
              <MailItem
                key={notification.id}
                sx={{
                  backgroundColor: hoveredIndex === index ? 'action.hover' : 'background.paper',
                  cursor: notification?.endpoint == null ? 'default' : 'cursor'
                }}
                onClick={() => {
                  handleNotificationClick(notification.id, notification.endpoint, notification.vue)
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      overflow: 'hidden',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}
                  >
                    <Typography
                      sx={{
                        mr: 4,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        width: ['100%', 'auto'],
                        overflow: ['hidden', 'unset'],
                        textOverflow: ['ellipsis', 'unset']
                      }}
                    >
                      {notification.action}
                    </Typography>
                    <Typography noWrap variant='body2' sx={{ width: '100%' }}>
                      {notification.description && notification.description}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  className='mail-actions'
                  sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  <Tooltip placement='top' title={notification.vue === 1 ? '' : 'Lire notification'}>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation()
                        handleMailIconClick(notification.id, notification.vue)
                      }}
                    >
                      <Icon icon={mailReadToggleIcon} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  className='mail-info-right'
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  <Typography
                    variant='caption'
                    sx={{ minWidth: '50px', textAlign: 'right', whiteSpace: 'nowrap', color: 'text.disabled' }}
                  >
                    {getNotificationTimeAgo(notification.created_at)}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      ml: 2,
                      color: notification.vue === 1 ? '#9bcb0c' : 'red',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <IconifyIcon icon={'mdi:circle-small'} />
                    {notification.vue === 1 ? 'lu' : 'Non lu'}
                  </Typography>
                </Box>
              </MailItem>
            )
          })
        )}
      </List>
    ) : (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
        <Icon icon='mdi:alert-circle-outline' fontSize={20} />
        <Typography>Aucune notification trouvée</Typography>
      </Box>
    )

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', '& .ps__rail-y': { zIndex: 5 } }}>
      <Box sx={{ height: '100%', backgroundColor: 'background.paper' }}>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ py: 1.75, px: { xs: 2.5, sm: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Notifications</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label={`${notificationsCount && notificationsCount} Nouveaux`}
                sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
              />
              <Tooltip placement='top' title='Marquer comme lu'>
                <IconButton size='small' onClick={handleReadAllNotifications} sx={{ ml: 2 }}>
                  <Icon icon='solar:check-read-linear' />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 7rem)' }}>
          <ScrollWrapper hidden={hidden}>
            {content}
            {isFetchingNextPage && <h3>Chargement...</h3>}
          </ScrollWrapper>
          <Backdrop
            open={refresh}
            onClick={() => setRefresh(false)}
            sx={{
              zIndex: 5,
              position: 'absolute',
              color: 'common.white',
              backgroundColor: 'action.disabledBackground'
            }}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </Box>
      </Box>

      <MailDetails {...mailDetailsProps} />
    </Box>
  )
}

export default MailLog
