import { Box, Avatar, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useDeleteTiers } from 'src/services/tiers.service'
import { useDisabledCompany } from 'src/services/company.service'

const RowOptions = ({ row, resource, resource_name }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const disabledUserMutation = useDisabledCompany({ profile: 'sub-contractors' })
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteTiersValidation = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: row?.id })
      }
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
    router.push(`/subcontractor/${row?.id}/edit`)
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
        {listPermissions?.permissions.find(item => item.name == `update ${resource}`)?.authorized && (
          <MenuItem onClick={handleEdit} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
            <Icon icon='mdi:pencil-outline' fontSize={18} />
            Modifier
          </MenuItem>
        )}
        {listPermissions?.permissions.find(item => item.name == `delete ${resource}`)?.authorized && (
          <MenuItem
            onClick={handleDelete}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#FDB528' }}
          >
            <Icon icon='mdi:delete-outline' color='#FDB528' fontSize={18} />
            {row?.state == '0' ? 'Activer' : 'Désactiver'}
          </MenuItem>
        )}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`${row?.state == '0' ? 'Activer' : 'Désactiver'} Sous Traitant ${row?.trade_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteTiersValidation}
      />
    </>
  )
}

const SousTraitantColumn = ({ userRole, resource, resource_name }) => {
  // const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

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
              {row?.trade_name}
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized && (
                <Tooltip title='Voir'>
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/subcontractor/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' fontSize='20px' />
                  </IconButton>
                </Tooltip>
              )}
              {listPermissions?.permissions.find(item => item.name == `update sub-contractors`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete sub-contractors`).authorized ===
                false ? null : (
                <RowOptions row={row} resource={resource} resource_name={resource_name} />
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
              {row?.name}
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
              {row?.phone_number_1}
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
              {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized && (
                <Tooltip title='Voir'>
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/subcontractor/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' />
                  </IconButton>
                </Tooltip>
              )}
              {listPermissions?.permissions.find(item => item.name == `update sub-contractors`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete sub-contractors`).authorized ===
                false ? null : (
                <RowOptions row={row} resource={resource} resource_name={resource_name} />
              )}
            </Box>
          ),
          align: 'center'
        }
      ]
      break
  }
}

export default SousTraitantColumn
