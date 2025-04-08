import { Box, Typography } from '@mui/material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useState } from 'react'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import DialogAlert from '../components/dialogs/DialogAlert'
import moment from 'moment'
import { useDisabledWorks } from 'src/services/work.service'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import useStates from 'src/@core/hooks/useStates'
import CustomChip from 'src/@core/components/mui/chip'

const RowOptions = ({ row, resource, resource_name }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const disabledWorkMutation = useDisabledWorks({ id: row.id })
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const disabledScenarioValidation = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledWorkMutation.mutateAsync({ id: row?.id })
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
    router.push(`/works/${row?.id}/edit`)
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
        {listPermissions?.permissions.find(item => item.name == `update ${resource?.toLowerCase()}`).authorized && (
          <MenuItem onClick={handleEdit} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
            <Icon icon='mdi:pencil-outline' fontSize={18} />
            Modifier
          </MenuItem>
        )}

        {listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized && (
          <MenuItem
            onClick={handleDisabled}
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
        title={`${row?.state == '0' ? 'Activer' : 'Désactiver'} Traveau ${row?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledScenarioValidation}
      />
    </>
  )
}

const TraveauxColum = ({ userRole, resource, resource_name }) => {
  const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'state',
          headerName: 'État',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={getStateByModel('DWork', row?.state)?.color}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={getStateByModel('DWork', row?.state)?.name}
            />
          )
        },
        {
          headerAlign: 'center',
          flex: 0.03,
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
        //   flex: 0.15,
        //   field: 'description ',
        //   headerName: 'Description',
        //   align: 'center',

        //   renderCell: ({ row }) => (
        //     <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
        //       {row?.description}
        //     </Typography>
        //   )
        // },

        {
          headerAlign: 'center',
          flex: 0.35,
          field: 'Montant  ',
          headerName: 'Montant Estimatif',
          align: 'center',

          renderCell: ({ row }) =>
            row?.pricing_list?.map((price, key) => (
              <div key={key} className='flex items-center' style={{ width: '9rem' }}>
                <CustomCurrencyInput custom={true} value={price?.price_unit_ht} />
              </div>
            ))

          // [{condition: "> 0", price_unit_ht: 85}]
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'date ',
          headerName: 'Date de création',
          align: 'center',

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
              {listPermissions?.permissions.find(item => item.name == `update works`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete works`).authorized === false ? (
                '__'
              ) : (
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
          flex: 0.09,
          field: 'state',
          headerName: 'État',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={getStateByModel('DWork', row?.state)?.color}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={getStateByModel('DWork', row?.state)?.name}
            />
          )
        },
        {
          headerAlign: 'center',
          flex: 0.03,
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
        //   flex: 0.15,
        //   field: 'description ',
        //   headerName: 'Description',
        //   align: 'center',

        //   renderCell: ({ row }) => (
        //     <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
        //       {row?.description}
        //     </Typography>
        //   )
        // },
        {
          headerAlign: 'center',
          flex: 0.35,
          field: 'Montant  ',
          headerName: 'Condition surface',
          align: 'center',

          renderCell: ({ row }) =>
            row?.pricing_list?.map((price, key) => (
              <div key={key} className='flex items-center'>
                <Typography sx={{ fontSize: '14px', fontWeight: '500', paddingBottom: '9px' }} variant='body2'>
                  {price?.condition}&nbsp;
                </Typography>
              </div>
            ))

          // [{condition: "> 0", price_unit_ht: 85}]
        },
        {
          headerAlign: 'center',
          flex: 0.35,
          field: 'Montant  ',
          headerName: 'Montant Estimatif',
          align: 'center',

          renderCell: ({ row }) =>
            row?.pricing_list?.map((price, key) => (
              <div key={key} className='flex items-center' style={{ width: '5rem' }}>
                <CustomCurrencyInput custom={true} value={price?.price_unit_ht} />
              </div>
            ))

          // [{condition: "> 0", price_unit_ht: 85}]
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'date ',
          headerName: 'Date de création',
          align: 'center',

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
              {listPermissions?.permissions.find(item => item.name == `update works`).authorized === false &&
              listPermissions?.permissions.find(item => item.name == `delete works`).authorized === false ? (
                '__'
              ) : (
                <RowOptions row={row} resource={resource} resource_name={resource_name} />
              )}
            </Box>
          ),
          align: 'right'
        }
      ]
      break
  }
}

export default TraveauxColum
