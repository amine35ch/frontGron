import { Box, Typography } from '@mui/material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useDisabledScenario } from 'src/services/scenario.service'

const RowOptions = ({ row, resource }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const disabledScenarioMutation = useDisabledScenario({ id: row.id })
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const disabledScenarioValidation = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledScenarioMutation.mutateAsync({ id: row?.id })
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
    router.push(`/scenario/${row?.id}/edit`)
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
          {row?.state == '0' ? 'Activer' : 'Désactiver'}
        </MenuItem>
        {/* )} */}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Désactiver Scénario ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledScenarioValidation}
      />
    </>
  )
}

const ScenarioColum = ({ userRole, resource }) => {
  // const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  switch (userRole) {
    case 'admin':
      return [
        // {
        //   headerAlign: 'center',
        //   flex: 0.03,
        //   field: 'reference',
        //   headerName: 'Référence',
        //   align: 'center',
        //   renderCell: ({ row }) => (
        //     <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
        //       {row?.reference}
        //     </Typography>
        //   )
        // },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'entitled ',
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
          field: 'works ',
          headerName: 'Travaux',
          align: 'center',

          renderCell: ({ row }) =>
            row?.works?.map((work, key) => (
              <>
                <CustomChip
                  skin='light'
                  size='small'
                  label={work.reference}
                  color='secondary'
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    alignSelf: 'flex-start',
                    color: 'text.secondary',
                    marginLeft: '10px'
                  }}
                />
              </>
            ))
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {listPermissions?.permissions.find(item => item.name == `update scenarios`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete scenarios`).authorized === false ? null : (
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
          field: 'name ',
          headerName: 'Nom',
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
          field: 'description ',
          headerName: 'description',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.description}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'operations ',
          headerName: 'Opérations',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.operations}
            </Typography>
          )
        }
      ]
      break
  }
}

export default ScenarioColum
