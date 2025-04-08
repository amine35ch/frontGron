// ** React Imports
import { useState, Fragment, useEffect } from 'react'
import toast from 'react-hot-toast'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { getInitials } from 'src/@core/utils/get-initials'
import { differenceInMinutes, differenceInHours, differenceInDays, format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import {
  useGetNotifications,
  useMarkAllNotificationsAsSeen,
  useMarkNotificationAsSeen,
  useGetNewNotificationsCount
} from 'src/services/notification.service'

import { useRouter } from 'next/router'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 400,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  marginTop: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  '&:not(:last-of-type)': {
    // borderBottom: `1px solid ${theme.palette.divider}`
  },
  '&:hover': {
    // paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  minWidth: 300
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 344
})

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

// ** Styled IconButton component
const StyledIconTypography = styled(Typography)(({ theme }) => ({
  // backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  fontWeight: 600,
  '&:hover': {
    color: theme.palette.primary.dark,
    cursor: 'pointer'
  }
}))

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = props => {
  // ** Props
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // const [isHovered, setIsHovered] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // ** Vars

  // const { data, isLoading, isSuccess } = useGetNotifications({
  //   paginated: true,
  //   pageSize,
  //   page,
  // })

  // ** monitor view
  const { ref, inView } = useInView()

  const markAllNotificationsAsSeenMutation = useMarkAllNotificationsAsSeen()
  const { data: notificationsCount } = useGetNewNotificationsCount()

  // const { data: notifications, isLoading, isSuccess } = useGetNotifications()
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

  //** Use the data from React Query to render notifications

  const content =
    notifications &&
    notifications.pages.map((page, pageIndex) =>
      page.data.map((notification, index) => {
        if (notifications.pages.length === pageIndex + 1 && page.length === index + 1) {
          return (
            <MenuItem
              ref={ref}
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id, notification.endpoint, notification.vue)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                {/* <RenderAvatar notification={notification} /> */}

                <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>{notification.action}</MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>
                    {notification.description && notification.description}
                  </MenuItemSubtitle>
                </Box>
                {/* <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  visibility={hoveredIndex === index ? 'visible' : 'hidden'}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: 2,
                      borderRadius: '50%'
                    }}
                  >
                    {notification.vue === 1 ? (
                      <Icon icon='mdi:email-open-outline' fontSize='1.5rem' />
                    ) : (
                      <Icon icon='mdi:email-outline' fontSize='1.5rem' />
                    )}
                  </Box>
                  <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 10, fontWeight: 600 }}>
                    {getNotificationTimeAgo(notification.created_at)}
                  </Typography>
                </Box> */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  visibility={hoveredIndex === index ? 'visible' : 'hidden'}
                >
                  <IconButton
                    sx={{
                      // fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: notification.vue === 1 ? theme => theme.palette.primary.main : '#E5EFC6',
                      color: notification.vue === 1 ? 'white' : theme => theme.palette.text.primary
                    }}
                    size='small'
                    onClick={e => {
                      e.stopPropagation()
                      handleMailIconClick(notification.id, notification.vue)
                    }}
                  >
                    <Icon icon={notification.vue === 1 ? 'mdi:email-open-outline' : 'mdi:email-outline'} />
                  </IconButton>
                  <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 10, fontWeight: 600 }}>
                    {getNotificationTimeAgo(notification.created_at)}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          )
        }

        return (
          <MenuItem
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id, notification.endpoint, notification.vue)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              {/* <RenderAvatar notification={notification} /> */}

              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>{notification.action}</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>
                  {notification.description && notification.description}
                </MenuItemSubtitle>
              </Box>
              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                visibility={hoveredIndex === index ? 'visible' : 'hidden'}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 2,
                    borderRadius: '50%'
                  }}
                >
                  {notification.vue === 1 ? (
                    <Icon icon='mdi:email-open-outline' fontSize='1.5rem' />
                  ) : (
                    <Icon icon='mdi:email-outline' fontSize='1.5rem' />
                  )}
                </Box>
                <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 10, fontWeight: 600 }}>
                  {getNotificationTimeAgo(notification.created_at)}
                </Typography>
              </Box> */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                visibility={hoveredIndex === index ? 'visible' : 'hidden'}
              >
                <IconButton
                  sx={{
                    // fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: notification.vue === 1 ? theme => theme.palette.primary.main : '#E5EFC6',
                    color: notification.vue === 1 ? 'white' : theme => theme.palette.text.primary
                  }}
                  size='small'
                  onClick={e => {
                    e.stopPropagation()
                    handleMailIconClick(notification.id, notification.vue)
                  }}
                >
                  <Icon size='small' icon={notification.vue === 1 ? 'mdi:email-open-outline' : 'mdi:email-outline'} />
                </IconButton>
                <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 10, fontWeight: 600 }}>
                  {getNotificationTimeAgo(notification.created_at)}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        )
      })
    )

  const notifExist = notificationsCount && notificationsCount > 0

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleReadAllNotifications = async () => {
    try {
      await markAllNotificationsAsSeenMutation.mutateAsync()
    } catch (error) {}
    handleDropdownClose()
  }

  const markNotificationAsSeenMutation = useMarkNotificationAsSeen()

  const handleNotificationClick = async (notificationId, endpoint, isSeen) => {
    handleDropdownClose()
    try {
      if (isSeen != 1) await markNotificationAsSeenMutation.mutateAsync(notificationId)
    } catch (error) {}

    // Redirect to the 'dashboards/' route if endpoint is null
    if (endpoint === null) {
      router.push('/dashboards/')
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

  const RenderAvatar = ({ notification }) => {
    const { avatarAlt, avatarImg, avatarIcon, avatarText, avatarColor } = notification
    if (avatarImg) {
      return <Avatar alt={avatarAlt} src={avatarImg} />
    } else if (avatarIcon) {
      return (
        <Avatar skin='light' color={avatarColor}>
          {avatarIcon}
        </Avatar>
      )
    } else {
      return (
        <Avatar skin='light' color={avatarColor}>
          {getInitials(avatarText)}
        </Avatar>
      )
    }
  }

  const handleBellIconClick = () => {
    router.push('/apps/email')
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleBellIconClick} aria-controls='customized-menu'>
        <Badge
          color='secondary'
          variant='dot'
          invisible={!notifExist}
          sx={{
            '& .MuiBadge-badge': {
              top: 3,
              right: 4,
              boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
            }
          }}
        >
          <Icon icon='mdi:bell-outline' fontSize='1.4rem' color={'white'} />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDropdownClose}>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              color='primary'
              label={`${notificationsCount && notificationsCount} Nouveaux`}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {content}
          {isFetchingNextPage && <h3>Chargement...</h3>}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            // py: 3.5,
            // borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 35
          }}
        >
          <StyledIconTypography onClick={handleReadAllNotifications}>Marquer comme lu</StyledIconTypography>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
