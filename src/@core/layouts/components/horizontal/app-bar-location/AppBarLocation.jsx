import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Translations from 'src/layouts/components/Translations'
import navigationList from 'src/navigation/vertical'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled } from '@mui/material/styles'
import UserIcon from 'src/layouts/components/UserIcon'
import themeConfig from 'src/configs/themeConfig'
import { settings } from 'nprogress'
import { useTheme } from '@mui/material/styles'
import useTabs from 'src/hooks/useTabs'
import { Tab, Tabs } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

const AppBarLocation = ({ parent }) => {
  const router = useRouter()
  const { user } = useAuth()
  const { id } = router.query

  const theme = useTheme()
  const navigation = navigationList(user?.role)
  const [item, seItem] = useState('')
  const [children, setChildren] = useState(null)
  const [child, setChild] = useState(null)
  const { tabs, activeTab, setActiveTab, navigateAndSetActiveTab } = useTabs()
  const { mode, navCollapsed } = settings

  useEffect(() => {
    // const item = navigation?.find(item => item.path === router.pathname)
    navigation?.map(item => {
      if (item.path === router.pathname) {
        seItem(item)
        setChildren(null)
        setChild(null)
      } else if (item?.children) {
        item?.children?.map(child => {
          if (child.path === router.pathname) {
            seItem(item)

            setChildren(child)
            setChild(null)
          } else if (child?.hideChildren) {
            child?.hideChildren?.map(hideChild => {
              if (hideChild.path === router.pathname) {
                seItem(item)
                setChildren(child)
                setChild(hideChild)
              }
            })
          }
        })
      }
    })
  }, [router.pathname])

  const MenuItemTextMetaWrapper = styled(Box)({
    width: '100%',
    display: 'flex',
    minHeight: '21px',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'opacity .25s ease-in-out',
    ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
  })

  const conditionalIconColor = () => {
    if (mode === 'semi-dark') {
      return {
        color: `rgba(${theme.palette.customColors.dark}, ${parent ? 0.6 : 0.87})`
      }
    } else
      return {
        color: parent ? 'text.secondary' : 'text.primary',

        // color: '#2a2e34',
        fontWeight: '400'
      }
  }

  const handleChangeTab = (event, newValue) => {
    navigateAndSetActiveTab(newValue)

    // setActiveTab(newValue)
  }

  const getPath = value => {
    if (value.hasOwnProperty('path')) {
      const url = value.path
      if (value.path.includes('[id]')) {
        let newUrl = url.replace('[id]', id)
        router.push(newUrl)
      } else {
        router.push(url)
      }
    }
  }

  return (
    <Box
      sx={{
        '&.MuiBox-root': {
          backgroundColor: theme.palette.primary.bg
        },
        borderBottom: '1px solid #e9ebf0',
        display: 'flex',
        alignItems: 'center',
        maxHeight: 46,
        pr: 4
      }}
    >
      <Box
        sx={{
          px: 6,
          py: 3,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon
            sx={{
              ...conditionalIconColor(),
              transition: 'margin .25s ease-in-out',
              ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2 }),
              ...(parent ? { ml: 2, mr: 4 } : {}),
              '& svg': {
                ...(!parent ? { fontSize: '1.25rem' } : { fontSize: '0.5rem' }),
                ...(parent && item.icon ? { fontSize: '0.875rem' } : {}),
                color: theme.palette.primary.active
              }
            }}
          >
            <UserIcon icon={item?.icon} />
          </ListItemIcon>
          <MenuItemTextMetaWrapper
            sx={{
              ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
            }}
          >
            <Typography
              {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                noWrap: true
              })}
              sx={{ fontSize: '14px' }}
            >
              <Translations text={item?.title} />
            </Typography>
          </MenuItemTextMetaWrapper>
        </div>
        {children !== null && (
          <>
            <p>&nbsp; / &nbsp; </p>
            <ListItemIcon
              sx={{
                ...conditionalIconColor(),
                transition: 'margin .25s ease-in-out',
                ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2 }),
                ...(parent ? { ml: 2, mr: 4 } : {}),
                '& svg': {
                  ...(!parent ? { fontSize: '1.1rem' } : { fontSize: '0.5rem' }),
                  ...(parent && children.icon ? { fontSize: '0.875rem' } : {}),
                  color: theme.palette.primary.active
                }
              }}
            >
              <UserIcon icon={children?.icon} />
            </ListItemIcon>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => getPath(children)}>
              <MenuItemTextMetaWrapper
                sx={{
                  ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
                }}
              >
                <Typography
                  {...((themeConfig.menuTextTruncate ||
                    (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                    noWrap: true
                  })}
                  sx={{ fontSize: '14px' }}
                >
                  <Translations text={children?.title} />
                </Typography>
              </MenuItemTextMetaWrapper>
            </div>
          </>
        )}

        {child !== null && (
          <>
            <p>&nbsp; /&nbsp; </p>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => getPath(child)}>
              <MenuItemTextMetaWrapper
                sx={{
                  ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
                }}
              >
                <Typography
                  {...((themeConfig.menuTextTruncate ||
                    (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                    noWrap: true
                  })}
                  sx={{ fontSize: '14px' }}
                >
                  <Translations text={child?.title} />
                </Typography>
              </MenuItemTextMetaWrapper>
            </div>
          </>
        )}
      </Box>
      {tabs.length > 0 ? (
        <>
          <Box sx={{ borderLeft: 1, height: '25px', borderColor: 'divider' }}></Box>
          <Box>
            <Tabs
              onChange={handleChangeTab}
              sx={{
                borderColor: 'divider',
                '& .MuiTabs-scroller': {
                  maxHeight: 50
                },
                '& .MuiTabs-flexContainer': {
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  gap: 3
                },
                '& .MuiTab-root': {
                  height: '100%',
                  '&.Mui-selected': {
                    color: 'primary.dark',
                    border: 0
                  }
                }
              }}
              value={activeTab}
            >
              {tabs?.map((tab, index) => (
                <Tab
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent' // Remove the background color on hover from the whole tab
                    },
                    '&:hover span': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                      maxHeight: 32,
                      mt: 2
                    }
                  }}
                  value={index}
                  key={index}
                  label={tab.label}
                  disabled={tab.disabled}
                />
              ))}
            </Tabs>
          </Box>
        </>
      ) : null}
      {/* {user?.subscription_status == 2 && (
        <CustomChip
          skin='light'
          color={'error'}
          sx={{
            fontWeight: '600',
            fontSize: '.75rem',
            height: '26px',
            cursor: 'pointer'
          }}
          icon={<IconifyIcon icon={'mdi:error'} fontSize={20} />}
          label={'Votre abonnement est expiré'}
        />
      )} */}
    </Box>
  )
}

export default AppBarLocation
