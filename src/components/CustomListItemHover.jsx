import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import IconifyIcon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'

import { useDeleteDocumentClientSpecificVersion } from 'src/services/client.service'
import { useAuth } from 'src/hooks/useAuth'

const ListItemCustom = styled(ListItem)(({ theme, activeItem }) => ({
  cursor: 'pointer',
  borderRadius: 2,
  marginBottom: 6,

  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  justifyContent: 'space-between',
  backgroundColor: activeItem && `#EEEEEE`,
  transition: 'border 0.25s ease-in-out, transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:not(:first-child)': {
    borderTop: `1px solid ${theme.palette.divider}`
  },

  // boxShadow: activeItem ? theme.shadows[3] : null,
  // transform: activeItem && 'translateY(-2px)',
  // '& .mail-actions': activeItem && { display: 'flex' },
  // '& .mail-info-right': activeItem && { display: 'none' },
  // '& + .MuiListItem-root': activeItem && { borderColor: 'transparent' },
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
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(2)
  }
}))

const CustomListItemHover = ({
  setSuspendDialogOpen,
  item,
  option,
  activeItem,
  action,
  isDisabled,
  deleteSpecificVersion,
  index
}) => {
  const theme = useTheme()
  const deleteDocumentMutation = useDeleteDocumentClientSpecificVersion()
  const { user } = useAuth()

  return (
    <List sx={{ p: 0 }} onClick={() => action(item)}>
      <ListItemCustom activeItem={activeItem}>
        <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
          <IconifyIcon color={theme.palette.primary.main} fontSize='19px' icon='ion:document-attach-outline' />

          <Box
            sx={{
              display: 'flex',
              overflow: 'hidden',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              ml: 2
            }}
          >
            <Typography
              sx={{
                mr: 4,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                width: ['100%', 'auto'],
                overflow: ['hidden', 'unset'],
                textOverflow: ['ellipsis', 'unset'],
                fontSize: '13px'
              }}

              // color='primary'
            >
              {item[option]} <Typography variant='body2'>{item?.version}</Typography>
            </Typography>
          </Box>
        </Box>
        <Box className='mail-actions' sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}>
          {user?.role?.includes('::admin') ? (
            <Tooltip placement='top' title='Supprimer fichier'>
              <IconButton color='error' onClick={() => setSuspendDialogOpen(true)} disabled={isDisabled}>
                <IconifyIcon icon='mdi:delete-outline' fontSize={'18px'} />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      </ListItemCustom>
    </List>
  )
}

export default CustomListItemHover
