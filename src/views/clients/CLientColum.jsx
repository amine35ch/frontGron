import { Box, Avatar, Tooltip, Typography } from '@mui/material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useDeleteClient } from 'src/services/client.service'

const RowOptions = ({ row, resource, acceptFunct }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const deleteUserMutation = useDeleteClient()
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteClientValidation = async event => {
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: row?.id })
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/beneficiaries/${row?.id}/edit`)
  }

  const handleAccept = () => {
    acceptFunct(row)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' fontSize='20px' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '9rem' } }}
      >
        {row?.can_update && (
          <MenuItem onClick={handleEdit} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
            <Icon icon='mdi:pencil-outline' fontSize={18} />
            Modifier
          </MenuItem>
        )}{' '}
        {/* {row?.can_update && row?.type === 0 && (
          <MenuItem onClick={handleAccept} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
            <Icon icon='mdi:check-outline' fontSize={18} />
            Accepter
          </MenuItem>
        )} */}
        {row?.can_delete && (
          <MenuItem
            onClick={handleDelete}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: 'red' }}
          >
            <Icon icon='mdi:delete-outline' color='red' fontSize={18} />
            Supprimer
          </MenuItem>
        )}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer Client ${row?.first_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClientValidation}
      />
    </>
  )
}

const CLientColum = ({ userRole, resource, acceptFunct }) => {
  // const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'reference',
          headerName: 'Référence',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.reference}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulé',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.last_name} {row?.first_name}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Email',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.email_contact}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number',
          headerName: 'Numéro de Téléphone',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.phone_number_1}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'city',
          headerName: 'Ville',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.city}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Adresse',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.address}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {listPermissions?.permissions.find(item => item.name == `view ${resource?.toLowerCase()}`).authorized && (
                <Tooltip title='Voir'>
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/beneficiaries/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' fontSize='20px' />
                  </IconButton>
                </Tooltip>
              )}
              {listPermissions?.permissions.find(item => item.name == `update ${resource?.toLowerCase()}`)
                .authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized ===
                false ? null : (
                <>
                  {row?.can_update || row?.can_delete ? (
                    <RowOptions acceptFunct={acceptFunct} row={row} resource={resource} />
                  ) : null}
                </>
              )}
            </Box>
          ),
          align: 'right'
        }
      ]

    default:
      return [
        {
          headerAlign: 'center',
          flex: 0.03,
          field: 'statut',
          headerName: 'Statut',
          align: 'center',
          renderCell: ({ row }) => (
            <Avatar
              sx={{
                bgcolor: getStateByModel('User', row?.state)?.color,
                width: '2.3rem',
                height: '2.3rem'
              }}
            >
              <IconifyIcon
                icon={getStateByModel('User', row?.state)?.icon}
                className={` ${
                  getStateByModel('User', row?.state)?.name === 'Active'
                    ? '!text-[#61CE11]'
                    : getStateByModel('User', row?.state)?.name === 'Désactivé'
                    ? '!text-[#FF4C51]'
                    : '!text-[#FFB911]'
                } !text-xl `}
              />
            </Avatar>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'reference',
          headerName: 'Référence',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.reference}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulé',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.last_name} {row?.first_name}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Email',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.email}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number',
          headerName: 'Numéro de Téléphone',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.phone_number}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'email',
          headerName: 'Email',
          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.email}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Adresse',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.address}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {listPermissions?.permissions.find(item => item.name == `view ${resource?.toLowerCase()}`).authorized && (
                <Tooltip title='Voir'>
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/beneficiaries/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' />
                  </IconButton>
                </Tooltip>
              )}

              {listPermissions?.permissions.find(item => item.name == `update ${resource?.toLowerCase()}`)
                .authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized ===
                false ? null : (
                <>
                  {row?.can_update || row?.can_delete ? (
                    <RowOptions acceptFunct={acceptFunct} row={row} resource={resource} />
                  ) : null}
                </>
              )}
            </Box>
          ),
          align: 'center'
        }
      ]
      break
  }
}

export default CLientColum
