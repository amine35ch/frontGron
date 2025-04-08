// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import {
  useGetAllMarsForCompanie,
  useGetCompanyProfileDetails,
  useSetMarForCompanies
} from 'src/services/company.service'
import { useState } from 'react'

const notifications = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const theme = useTheme()
  const auth = useAuth()
  const [idMar, setIdMar] = useState('')
  const { data: listAllMars } = useGetAllMarsForCompanie()
  const { data: detailsCompanies } = useGetCompanyProfileDetails()
  const setMarForCompaniesMutation = useSetMarForCompanies()

  const handleSetMarParent = async value => {
    setIdMar(value)
    const data = { mar_id: value }
    try {
      setMarForCompaniesMutation.mutateAsync(data)
    } catch (error) {}
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left w-[230px]' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StyledLink href='/' sx={{ display: 'flex' }}>
          <img src={'/images/logos/ajla.png'} width={30} />
          {/* <img src={'/images/logos/ktiba.png'} width={70} style={{ marginLeft: '5px' }} /> */}

          {/*  */}
        </StyledLink>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          {hidden && !settings.navHidden ? (
            <IconButton sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
              <Icon color='white' icon='mdi:menu' />
            </IconButton>
          ) : null}

          {/* <Autocomplete hidden={hidden} settings={settings} /> */}
          {/* <IconButton>
            <StyledLink href='/apps/calendar'>
              <Icon color='white' icon='mdi:calendar-blank' />
            </StyledLink>
          </IconButton> */}
        </Box>

        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <ShortcutsDropdown settings={settings} shortcuts={shortcuts} /> */}
        {listAllMars && listAllMars?.data?.length !== 0 && (
          <Box width={'10rem'}>
            <CustomeAutoCompleteSelect
              data={listAllMars?.data}
              option={'id'}
              value={detailsCompanies?.parent?.id}
              variant='standard'
              onChange={value => handleSetMarParent(value)}
              displayOption={'trade_name'}
              colorProps={'white'}
            />
          </Box>
        )}
        <NotificationDropdown settings={settings} notifications={notifications} />
        {auth?.user?.role?.includes('::admin') ? (
          <IconButton>
            <StyledLink href='/company'>
              <Icon color='white' icon='mdi:settings-outline' />
            </StyledLink>
          </IconButton>
        ) : null}
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
