import { Box, Typography, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import { useDeleteProject } from 'src/services/project.service'
import CustomChip from 'src/@core/components/mui/chip'
import { dateFormater } from 'src/@core/utils/utilities'

const RowOptions = ({ row, resource }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const deleteProjectMutation = useDeleteProject()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteProjecttValidation = async event => {
    try {
      if (event) {
        await deleteProjectMutation.mutateAsync({ id: row?.id })
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
    router.push(`/government/${row?.id}/edit`)
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
        <MenuItem onClick={handleEdit} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
          <Icon icon='mdi:pencil-outline' fontSize={18} />
          Modifier
        </MenuItem>
        {/* <MenuItem
          onClick={handleDelete}
          className='!px-2 !pb-1'
          sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#bc4841' }}
        >
          <Icon icon='mdi:delete-outline' color='#bc4841' fontSize={18} />
          Supprimer
        </MenuItem> */}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Delete project ${row?.name} ?`}
        acceptButtonTitle='Accept'
        declineButtonTitle='Cancel'
        handleAction={deleteProjecttValidation}
      />
    </>
  )
}

const AccessListColumn = ({ userRole, resource }) => {
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  return [
    {
      headerAlign: 'center',
      flex: 0.2,
      field: 'username',
      headerName: "Nom d'utilisateur",
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.username}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.2,
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
      flex: 0.2,
      field: 'phone_number',
      headerName: 'Téléphone',
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.phone_number}
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
          {/* <Tooltip title='Voir'>
            <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/access-list/${row.id}/edit`}>
              <Icon icon='mdi:eye-outline' fontSize='20px' />
            </IconButton>
          </Tooltip> */}
          <RowOptions row={row} resource={resource} />
        </Box>
      ),
      align: 'right'
    }
  ]
}

export default AccessListColumn
