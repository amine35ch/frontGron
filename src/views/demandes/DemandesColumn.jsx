import { Box, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useDeleteProject } from 'src/services/project.service'
import moment from 'moment'
import { styled } from '@mui/material/styles'

import CustomAvatar from 'src/@core/components/mui/avatar'

const Avatar = styled(CustomAvatar)(({ theme }) => ({
  width: 25,
  height: 25,
  borderRadius: '50%'
}))

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
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await deleteProjectMutation.mutateAsync({ id: row?.id })
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
    router.push(`/demandes/${row?.id}/edit`)
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
        {/* {listPermissions?.permissions.find(item => item.name == `update ${resource?.toLowerCase()}`).authorized && ( */}

        {row?.decisions[0]?.decision !== '-1' ? (
          <MenuItem onClick={handleEdit} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
            <Icon icon='mdi:pencil-outline' fontSize={18} />
            Modifier
          </MenuItem>
        ) : null}

        {/* // )} */}
        {/* {listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized && ( */}
        <MenuItem
          onClick={handleDelete}
          className='!px-2 !pb-1'
          sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#bc4841' }}
        >
          <Icon icon='mdi:delete-outline' color='#bc4841' fontSize={18} />
          Supprimer
        </MenuItem>
        {/* )} */}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer projet ${row?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteProjecttValidation}
      />
    </>
  )
}

const DemandesColumn = ({ userRole, resource }) => {
  // const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.03,
          field: 'statut',
          headerName: 'Qualification',
          align: 'center',
          renderCell: ({ row }) =>
            row?.decisions[0]?.decision == 1 ? (
              <Avatar skin='light' color={'success'} variant='rounded'>
                <IconifyIcon fontSize='17px' icon='ic:baseline-check' />
              </Avatar>
            ) : row?.decisions[0]?.decision == '-1' ? (
              <Avatar skin='light' color={'error'} variant='rounded'>
                <IconifyIcon fontSize='17px' icon='material-symbols:error-outline' />
              </Avatar>
            ) : (
              <Avatar skin='light' color={'warning'} variant='rounded'>
                <IconifyIcon fontSize='17px' icon='material-symbols:progress-activity-sharp' />
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
          flex: 0.16,
          minWidth: 100,
          field: 'Type de la demande',
          headerName: 'Type de la demande',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.type_demande_project}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'Classe Énergétique',
          headerName: 'Classe Énergétique',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.project_energy_class}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'Résidence',
          headerName: 'Résidence',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.project_residence}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'Nature',
          headerName: 'Nature',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.project_nature}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'Classe du revenue',
          headerName: 'Classe du revenue',
          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.project_income_class}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'date',
          headerName: 'Date de création',
          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.created_at).format('DD/MM/YYYY')}
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
              {/* {listPermissions?.permissions.find(item => item.name == `view ${resource?.toLowerCase()}`).authorized && ( */}
              {/* <Tooltip title='Voir'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/projects/${row.id}/details`}>
                  <Icon icon='mdi:eye-outline' fontSize='20px' />
                </IconButton>
              </Tooltip> */}

              {/* )} */}

              <RowOptions row={row} resource={resource} />
            </Box>
          ),
          align: 'right'
        }
      ]

    default:
      return []
      break
  }
}

export default DemandesColumn
