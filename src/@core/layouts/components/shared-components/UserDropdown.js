// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 5,
  height: 5,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()
  const auth = useAuth()

  const CompanyId = auth?.user?.company?.id
  const userProfile = auth?.user?.display_profile

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    fontSize: '1rem',
    color: 'text.primary',
    textDecoration: 'none',
    whiteSpace: 'break-spaces',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'primary.dark'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <div
          skin='light'
          variant='rounded'
          style={{
            width: 25,
            height: 25,
            fontWeight: 500,
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            borderRadius: '50%',
            backgroundColor: 'white'
          }}
        >
          {getInitials(auth?.user?.username)}
        </div>
        {/* <Custom */}
        {/* <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 25, height: 25 }}
          src='/images/avatars/1.png'
        /> */}
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <div
                skin='light'
                variant='rounded'
                style={{
                  width: 35,
                  height: 35,
                  fontWeight: 500,
                  mb: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#86A039',
                  color: 'white'
                }}
              >
                {getInitials(auth?.user?.username)}
              </div>
              {/* <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} /> */}
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{auth?.user?.username}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {userProfile}
              </Typography>
            </Box>
          </Box>
        </Box>

        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/user-profile/profile')}>
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            Profil
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/user-profile/billing-setting')}>
          <Box sx={styles}>
            <Icon icon='mdi:payment-settings' />
            Paramètre de Facturation
          </Box>
        </MenuItem> */}
        {/* {auth?.user?.role?.includes('::admin') ? (
          <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose(`/company/editProfile`)}>
            <Box sx={styles}>
              <Icon icon='mdi:settings-outline' />
              Paramétrage
            </Box>
          </MenuItem>
        ) : null} */}

        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/email')}>
          <Box sx={styles}>
            <Icon icon='mdi:email-outline' />
            Boite de réception
          </Box>
        </MenuItem> */}

        {/* <Divider /> */}

        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')}>
          <Box sx={styles}>
            <Icon icon='mdi:currency-usd' />
            Prix
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/faq')}>
          <Box sx={styles}>
            <Icon icon='mdi:help-circle-outline' />
            Aide
          </Box>
        </MenuItem> */}
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Déconnexion
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
