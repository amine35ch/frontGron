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
import { useDeleteCompany, useDisabledCompany } from 'src/services/company.service'

const RowOptions = ({ row, resource, resource_name }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)

  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const disabledUserMutation = useDisabledCompany({ profile: 'auditors' })
  const deleteUserMutation = useDeleteCompany({ profile: 'auditors' })

  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDisabled = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const disabledAuditeurValidation = async event => {
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: row?.id })
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const handleDelete = () => {
    setDialogDeleteOpen(true)
    handleRowOptionsClose()
  }

  const deleteAuditeurValidation = async event => {
    setDialogDeleteOpen(false)
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: row?.id })
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/auditor/${row?.id}/edit`)
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
        )}
        {row?.can_delete && (
          <MenuItem
            onClick={handleDisabled}
            className='!px-2 !pb-1'
            color='warning'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#FDB528' }}
          >
            <Icon icon='mdi:delete-outline' color='#FDB528' fontSize={18} />
            {row?.state == '0' ? 'Activer' : 'Désactiver'}
          </MenuItem>
        )}

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
        title={`${row?.state == '0' ? 'Activer' : 'Désactiver'} Auditeur ${row?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledAuditeurValidation}
      />

      <DialogAlert
        open={dialogDeleteOpen}
        description=''
        setOpen={setDialogDeleteOpen}
        title={`Voulez-vous supprimer auditeur ${row?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteAuditeurValidation}
      />
    </>
  )
}

const AuditeurColumn = ({ userRole, resource, resource_name }) => {
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
          flex: 0.16,
          minWidth: 100,
          field: 'contact',
          headerName: 'Contact',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.representative_last_name} {row?.representative_first_name}
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
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized && (
                <Tooltip title='Voir'>
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/auditor/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' fontSize='20px' />
                  </IconButton>
                </Tooltip>
              )}

              {listPermissions?.permissions.find(item => item.name == `update auditors`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete auditors`).authorized === false ? null : (
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized && (
                <Tooltip title='Voir'>
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/auditor/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' fontSize='20px' />
                  </IconButton>
                </Tooltip>
              )}

              <RowOptions row={row} resource={resource} />
            </Box>
          ),
          align: 'center'
        }
      ]
      break
  }
}

export default AuditeurColumn
