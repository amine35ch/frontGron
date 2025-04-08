import { Box, Avatar, Tooltip, Typography, CircularProgress } from '@mui/material'
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
import { useDeleteCollaborator } from 'src/services/collaborators.service'
import { useDeleteCompany, useDeleteCompanyUser, useDisabledCompany } from 'src/services/company.service'
import { useSendResetLinkEmail } from 'src/services/user-profile.service'
import toast from 'react-hot-toast'

const RowOptions = ({ row, resource, resource_name, path, recoverPassword, identifiant }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)

  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const disabledUserMutation = useDisabledCompany({ profile: 'users' })
  const deleteUserMutation = useDeleteCompanyUser({ profile: 'users' })
  const sendResetLinkEmailMutation = useSendResetLinkEmail()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDisabled = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const disabledCollaboratorValidation = async event => {
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

  const deleteCollaboratorValidation = async event => {
    try {
      await deleteUserMutation.mutateAsync({ id: row?.id })

      setDialogDeleteOpen(false)
    } catch (error) {}
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(path)
  }

  const handleResetLinkEmail = async () => {
    if (row?.email && identifiant === '1') {
      const data = {
        email: row?.email
      }
      try {
        await sendResetLinkEmailMutation.mutateAsync(data)
        setAnchorEl(null)
      } catch (error) {}
    } else if (identifiant !== '1') {
      toast.error('Veuillez ajouter un identifiant pour ce utilisateur')
    } else if (!row?.email) {
      toast.error('Veuillez ajouter un email pour ce utilisateur')
    }
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

        {recoverPassword && (
          <MenuItem onClick={handleResetLinkEmail} className='!px-2 !pb-1'>
            {sendResetLinkEmailMutation?.isPending ? (
              <CircularProgress size={17} />
            ) : (
              <Icon icon='mdi:send' fontSize={17} />
            )}
            <Typography fontSize={14} ml={2}>
              Réinitialiser mot de passe{' '}
            </Typography>
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
        title={`${row?.state == '0' ? 'Activer' : 'Désactiver'} Inspecteur ${row?.first_name} ${row?.last_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledCollaboratorValidation}
      />

      <DialogAlert
        open={dialogDeleteOpen}
        description=''
        setOpen={setDialogDeleteOpen}
        title={`Voulez-vous supprimer utilisateur ${row?.first_name} ${row?.last_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteCollaboratorValidation}
      />
    </>
  )
}

const InstallersColum = ({ userRole, resource, resource_name, recoverPassword, identifiant }) => {
  // const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  switch (userRole) {
    case 'inspector':
      return [
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulé',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.first_name} {row?.last_name}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Rôle',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.role?.display_name}
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
          field: 'phone',
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
              {row?.can_delete === false && row?.can_update === false ? null : (
                <RowOptions
                  row={row}
                  resource={resource}
                  resource_name={resource_name}
                  recoverPassword={recoverPassword}
                  identifiant={identifiant}
                  path={`/collaborators/${row?.id}/edit/`}
                />
              )}
            </Box>
          ),
          align: 'right'
        }
      ]
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Nom Utilisateur',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.username}
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
              {row?.first_name} {row?.last_name}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Société',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.company?.trade_name}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Rôle',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.role?.display_name}
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
          field: 'phone',
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
              {row?.can_delete === false && row?.can_update === false ? null : (
                <RowOptions
                  row={row}
                  resource={resource}
                  resource_name={resource_name}
                  recoverPassword={recoverPassword}
                  identifiant={identifiant}
                  path={`/company/users/${row?.id}/edit/`}
                />
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
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulé',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.first_name} {row?.last_name}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Société',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.company?.trade_name}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Rôle',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.role?.display_name}
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
          field: 'phone',
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
              {row?.can_delete === false && row?.can_update === false ? null : (
                <RowOptions
                  row={row}
                  resource={resource}
                  resource_name={resource_name}
                  recoverPassword={recoverPassword}
                  identifiant={identifiant}
                  path={`/company/users/${row?.id}/edit/`}
                />
              )}
            </Box>
          ),
          align: 'right'
        }
      ]
      break
  }
}

export default InstallersColum
