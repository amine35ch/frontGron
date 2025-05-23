// ** React Imports
import { useEffect, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'

// ** Third Party Imports
import clsx from 'clsx'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Utils
import { hasActiveChild, removeChildren } from 'src/@core/layouts/utils'

// ** Custom Components Imports
import VerticalNavItems from './VerticalNavItems'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavGroup from 'src/layouts/components/acl/CanViewNavGroup'

const MenuItemTextWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}))

const VerticalNavGroup = props => {
  // ** Props
  const {
    item,
    parent,
    settings,
    navHover,
    navVisible,
    isSubToSub,
    groupActive,
    setGroupActive,
    collapsedNavWidth,
    currentActiveGroup,
    setCurrentActiveGroup,
    navigationBorderWidth
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()
  const currentURL = router.asPath
  const { direction, mode, navCollapsed, verticalNavToggleType } = settings

  // ** Accordion menu group open toggle
  const toggleActiveGroup = (item, parent) => {
    let openGroup = groupActive

    // ** If Group is already open and clicked, close the group
    if (openGroup.includes(item.title)) {
      openGroup.splice(openGroup.indexOf(item.title), 1)

      // If clicked Group has open group children, Also remove those children to close those groups
      if (item.children) {
        removeChildren(item.children, openGroup, currentActiveGroup)
      }
    } else if (parent) {
      // ** If Group clicked is the child of an open group, first remove all the open groups under that parent
      if (parent.children) {
        removeChildren(parent.children, openGroup, currentActiveGroup)
      }

      // ** After removing all the open groups under that parent, add the clicked group to open group array
      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    } else {
      // ** If clicked on another group that is not active or open, create openGroup array from scratch
      // ** Empty Open Group array
      openGroup = []

      // ** push Current Active Group To Open Group array
      if (currentActiveGroup.every(elem => groupActive.includes(elem))) {
        openGroup.push(...currentActiveGroup)
      }

      // ** Push current clicked group item to Open Group array
      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    }
    setGroupActive([...openGroup])
  }

  // ** Menu Group Click
  const handleGroupClick = () => {
    const openGroup = groupActive
    if (verticalNavToggleType === 'collapse') {
      if (openGroup.includes(item.title)) {
        openGroup.splice(openGroup.indexOf(item.title), 1)
      } else {
        openGroup.push(item.title)
      }
      setGroupActive([...openGroup])
    } else {
      toggleActiveGroup(item, parent)
    }
  }
  useEffect(() => {
    if (hasActiveChild(item, currentURL)) {
      if (!groupActive.includes(item.title)) groupActive.push(item.title)
    } else {
      const index = groupActive.indexOf(item.title)
      if (index > -1) groupActive.splice(index, 1)
    }
    setGroupActive([...groupActive])
    setCurrentActiveGroup([...groupActive])

    // Empty Active Group When Menu is collapsed and not hovered, to fix issue route change
    if (navCollapsed && !navHover) {
      setGroupActive([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])
  useEffect(() => {
    if (navCollapsed && !navHover) {
      setGroupActive([])
    }
    if ((navCollapsed && navHover) || (groupActive.length === 0 && !navCollapsed)) {
      setGroupActive([...currentActiveGroup])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navCollapsed, navHover])
  useEffect(() => {
    if (groupActive.length === 0 && !navCollapsed) {
      setGroupActive([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navHover])
  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon
  const menuGroupCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const conditionalIconColor = () => {
    if (mode === 'semi-dark') {
      return {
        color: `rgba(${theme.palette.customColors.dark}, ${parent && item.children ? 0.6 : 0.87})`
      }
    } else
      return {
        color: parent && item.children ? 'text.secondary' : 'text.primary',

        // color: '#2a2e34',
        fontWeight: '400'
      }
  }

  const conditionalArrowIconColor = () => {
    if (mode === 'semi-dark') {
      return {
        color: `rgba(${theme.palette.customColors.dark}, 0.6)`
      }
    } else return {}
  }

  const conditionalBgColor = () => {
    if (mode === 'semi-dark') {
      return {
        '&:hover': {
          backgroundColor: `rgba(${theme.palette.customColors.dark}, 0.05)`
        },
        '&.Mui-selected': {
          backgroundColor: `rgba(${theme.palette.customColors.dark}, 0.08)`,
          '&:hover': {
            backgroundColor: `rgba(${theme.palette.customColors.dark}, 0.08)`
          }
        }
      }
    } else {
      return {
        '&.Mui-selected': {
          backgroundColor: 'action.selected',
          '&:hover': {
            backgroundColor: 'action.selected'
          }
        }
      }
    }
  }

  return (
    <CanViewNavGroup navGroup={item}>
      <Fragment>
        <ListItem
          disablePadding
          className='nav-group'
          onClick={handleGroupClick}
          sx={{
            mt: 1.5,
            flexDirection: 'column',
            transition: 'padding .25s ease-in-out',
            px:
              parent && item.children
                ? '0 !important'
                : `${theme.spacing(navCollapsed && !navHover ? 1 : 2)} !important`
          }}
        >
          <ListItemButton
            className={clsx({
              'Mui-selected': groupActive.includes(item.title) || currentActiveGroup.includes(item.title)
            })}
            sx={{
              backgroundColor: theme.palette.secondary.beigeBared,
              py: 1.4,
              width: '100%',
              borderRadius: '8px',
              ...conditionalBgColor(),
              transition: 'padding-left .25s ease-in-out',
              pr: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24 - 16) / 8 : 2,
              pl: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24 - 16) / 8 : 3,
              '&.Mui-selected.Mui-focusVisible': {
                backgroundColor: 'action.focus',
                '&:hover': {
                  backgroundColor: 'action.focus'
                }
              }
            }}
          >
            {isSubToSub ? null : (
              <ListItemIcon
                sx={{
                  ...conditionalIconColor(),
                  transition: 'margin .25s ease-in-out',
                  ...(parent && navCollapsed && !navHover ? {} : { mr: 2 }),
                  ...(navCollapsed && !navHover ? { mr: 0 } : {}),
                  ...(parent && item.children ? { ml: 2, mr: 4 } : {}),
                  '& svg': {
                    ...(!parent ? { fontSize: '1.25rem' } : { fontSize: '0.5rem' }),
                    ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
                  }
                }}
              >
                <UserIcon icon={icon} />
              </ListItemIcon>
            )}
            <MenuItemTextWrapper sx={{ ...menuGroupCollapsedStyles, ...(isSubToSub ? { ml: 8 } : {}) }}>
              <Typography
                {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                  noWrap: true
                })}
                fontWeight={'600'}
                sx={{ fontSize: '14px' }}
              >
                <Translations text={item.title} />
              </Typography>
              <Box
                className='menu-item-meta'
                sx={{
                  ml: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    ...conditionalArrowIconColor(),
                    transition: 'transform .25s ease-in-out',
                    ...(groupActive.includes(item.title) && {
                      transform: direction === 'ltr' ? 'rotate(90deg)' : 'rotate(-90deg)'
                    })
                  }
                }}
              >
                {item.badgeContent ? (
                  <Chip
                    size='small'
                    label={item.badgeContent}
                    color={item.badgeColor || 'primary'}
                    sx={{ mr: 0.75, '& .MuiChip-label': { px: 2.5, lineHeight: 1.385, textTransform: 'capitalize' } }}
                  />
                ) : null}
                <Icon fontSize='20px' icon={direction === 'ltr' ? 'mdi:chevron-right' : 'mdi:chevron-left'} />
              </Box>
            </MenuItemTextWrapper>
          </ListItemButton>
          <Collapse
            component='ul'
            onClick={e => e.stopPropagation()}
            in={true}
            sx={{
              pl: 0,
              width: '100%',
              ...menuGroupCollapsedStyles,
              transition: 'all 0.25s ease-in-out'
            }}

            // in={groupActive.includes(item.title)}
          >
            <VerticalNavItems
              {...props}
              parent={item}
              navVisible={navVisible}
              verticalNavItems={item.children}
              isSubToSub={parent && item.children ? item : undefined}
            />
          </Collapse>
        </ListItem>
      </Fragment>
    </CanViewNavGroup>
  )
}

export default VerticalNavGroup
