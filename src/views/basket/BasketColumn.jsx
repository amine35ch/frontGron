import { Box, Avatar, Tooltip, Typography } from '@mui/material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useBasketDelete, useBasketRestore } from 'src/services/basket.service'
import moment from 'moment'

const RowOptions = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [suspendDialogDeleteOpen, setSuspendDialogDeleteOpen] = useState(false)
  const restoreMutation = useBasketRestore({ id: row?.id })
  const forceDeleteMutation = useBasketDelete({ id: row?.id })

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const restaurerValidation = async event => {
    const model = row?.modelReference
    try {
      if (event) {
        await restoreMutation.mutateAsync(model)
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const forceDelete = async event => {
    const model = row?.modelReference
    try {
      if (event) {
        await forceDeleteMutation.mutateAsync(model)
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const handleDelete = () => {
    setSuspendDialogDeleteOpen(true)
    handleRowOptionsClose()
  }

  const handleRestore = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title='Restaurer' onClick={handleRestore}>
        <IconButton size='small' sx={{ mr: 0.5 }}>
          <Icon icon='mdi:backup-restore' color='#1E4590' fontSize='20px' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Supprimer définitivement' onClick={handleDelete}>
        <IconButton size='small' sx={{ mr: 0.5 }}>
          <Icon icon='mdi:delete-outline' color='red' fontSize={18} />
        </IconButton>
      </Tooltip>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Voulez-vous  vraiment restaurer ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={restaurerValidation}
      />

      <DialogAlert
        open={suspendDialogDeleteOpen}
        description=''
        setOpen={setSuspendDialogDeleteOpen}
        title={`Voulez-vous  vraiment supprimer définitivement ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={forceDelete}
      />
    </>
  )
}

const BasketColumn = ({ userRole, resource }) => {
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'model',
          headerName: "Type d'enregistrement",
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.model}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'entitled',
          headerName: "Intitulé de l'enregistrement",
          align: 'center',

          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
                {row?.entitled}
              </Typography>
              <Typography noWrap variant='caption'>
                {row?.last_name} {row?.first_name}
              </Typography>
            </Box>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'date',
          headerName: 'Date de suppression',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.deleted_at).format('DD/MM/YYYY h:mm')}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'date',
          headerName: 'Utilisateur',
          align: 'center',

          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row?.deleted_by?.first_name} {row?.deleted_by?.last_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row?.deleted_by?.email}
              </Typography>
            </Box>
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
              <RowOptions row={row} />
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
          field: 'model',
          headerName: 'Model',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.model}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'entitled',
          headerName: 'Intitulé',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.entitled}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'date',
          headerName: 'Date de suppression',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.deleted_at).format('DD/MM/YYYY h:mm')}
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
              <RowOptions row={row} />
            </Box>
          ),
          align: 'right'
        }
      ]
      break
  }
}

export default BasketColumn
