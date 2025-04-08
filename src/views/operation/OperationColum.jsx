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
import { useDisabledOperation } from 'src/services/operation.service'

const RowOptions = ({ row, resource }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const disabledOperationMutation = useDisabledOperation()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const disabledOperationValidation = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledOperationMutation.mutateAsync({ id: row?.id })
      }
    } catch (error) {}
  }

  const handleDisabled = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/operations/${row?.id}/edit`)
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
        <MenuItem onClick={handleEdit} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
          <Icon icon='mdi:pencil-outline' fontSize={18} />
          Modifier
        </MenuItem>
        {/* // )} */}
        {/* {listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized && ( */}
        <MenuItem
          onClick={handleDisabled}
          className='!px-2 !pb-1'
          sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#FDB528' }}
        >
          <Icon icon='mdi:delete-outline' color='#FDB528' fontSize={18} />
          Désactiver
        </MenuItem>
        {/* )} */}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Désactiver Opération ${row?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledOperationValidation}
      />
    </>
  )
}

const OperationColum = ({ userRole, resource }) => {
  // const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.03,
          field: 'id',
          headerName: 'ID',
          align: 'center',
          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.id}
            </Typography>
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

        // {
        //   headerAlign: 'center',
        //   flex: 0.09,
        //   field: 'entitle',
        //   headerName: 'Intitulé',
        //   align: 'center',

        //   renderCell: ({ row }) => (
        //     <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
        //       {row?.entitle}
        //     </Typography>
        //   )
        // },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'unit_type',
          headerName: 'Type unité',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.unit_type?.entitled}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'price_unit_ht',
          headerName: 'Prix unitaire',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.price_unit_ht}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'condition',
          headerName: 'Condition',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.condition}
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
              {listPermissions?.permissions.find(item => item.name == `update works`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete works`).authorized === false ? null : (
                <RowOptions row={row} resource={resource} />
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
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/operations/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' />
                  </IconButton>
                </Tooltip>
              )}

              {listPermissions?.permissions.find(item => item.name == `update works`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete works`).authorized === false ? null : (
                <RowOptions row={row} resource={resource} />
              )}
            </Box>
          ),
          align: 'center'
        }
      ]
      break
  }
}

export default OperationColum
