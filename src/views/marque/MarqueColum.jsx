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
import CustomChip from 'src/@core/components/mui/chip'
import { useDeleteBrand, useDisabledBrands, useEnableBrands, useValidateBrands } from 'src/services/brand.service'
import useStates from 'src/@core/hooks/useStates'

const RowOptions = ({ row, resource }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)

  const disabledBrandsMutation = useDisabledBrands({ id: row.id })
  const enableBrandMutation = useEnableBrands({ id: row?.id })
  const validateBrandMutation = useValidateBrands({ id: row?.id })
  const deleteBrandMutation = useDeleteBrand()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDisabled = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const disabledBrands = async event => {
    setSuspendDialogOpen(false)
    if (event) {
      try {
        await disabledBrandsMutation.mutateAsync()
      } catch (error) {
        const errorsObject = error?.response?.data?.errors
      }
    }
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/Catalog/brands/${row?.id}/edit`)
  }

  const enabledBrands = async event => {
    if (event) {
      try {
        await enableBrandMutation.mutateAsync()
      } catch (error) {
        const errorsObject = error?.response?.data?.errors
      }
    }
  }

  const validateBrands = async event => {
    if (event) {
      try {
        await validateBrandMutation.mutateAsync()
      } catch (error) {
        const errorsObject = error?.response?.data?.errors
      }
    }
  }

  const handleDelete = () => {
    setDialogDeleteOpen(true)
  }

  const handleDeleteBrandMuatation = async event => {
    setDialogDeleteOpen(false)
    try {
      await deleteBrandMutation.mutateAsync({ id: row.id })
    } catch (error) {}
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
        {row?.state == 0 ? (
          <MenuItem
            onClick={enabledBrands}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#86A039' }}
          >
            <Icon color={'#86A039'} icon='material-symbols-light:notifications-active-rounded' fontSize={19} />
            Activer
          </MenuItem>
        ) : row?.state == 1 ? (
          <MenuItem
            onClick={handleDisabled}
            className='!px-2 !pb-1'
            color='warning'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#FDB528' }}
          >
            <Icon color={'#FDB528'} icon='material-symbols-light:notifications-active-rounded' fontSize={19} />
            Désactiver
          </MenuItem>
        ) : null}

        {auth?.user?.profile == 'MAR' ? (
          row?.is_validated === 0 ? (
            <MenuItem onClick={validateBrands} className='!px-2 !pb-1' sx={{ color: '#86A039' }}>
              {validateBrandMutation?.isPending ? (
                <CircularProgress size={14}  />
              ) : (
                <Icon color={'#86A039'} icon='mdi:check' fontSize={19} />
              )}
              Valider
            </MenuItem>
          ) : (
            <MenuItem onClick={validateBrands} className='!px-2 !pb-1' sx={{ fontSize: '14px', color: 'red' }}>
              {validateBrandMutation?.isPending ? (
                <CircularProgress size={14} />
              ) : (
                <Icon color={'red'} icon='icomoon-free:blocked' fontSize={15} />
              )}
              Refuser
            </MenuItem>
          )
        ) : null}
        {row?.can_delete && (
          <MenuItem
            onClick={handleDelete}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: 'red' }}
          >
            <Icon color={'red'} icon='mdi:trash-can-outline' fontSize={19} />
            Supprimer
          </MenuItem>
        )}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Désactiver Marque ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledBrands}
      />
      <DialogAlert
        open={dialogDeleteOpen}
        description=''
        setOpen={setDialogDeleteOpen}
        title={`Voulez-vous vraiment supprimer Marque ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={handleDeleteBrandMuatation}
      />
    </>
  )
}

const MarqueColum = ({ userRole, resource }) => {
  const { getStateByModel } = useStates()
  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource)

  let columns = [
    {
      headerAlign: 'center',
      flex: 0.03,
      field: 'Type',
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
      field: 'Type',
      headerName: 'Validation Mar',
      align: 'center',
      renderCell: ({ row }) => (
        <CustomChip
          skin='light'
          color={row?.is_validated == '1' ? 'success' : 'error'}
          sx={{
            fontWeight: '600',
            fontSize: '.75rem',
            height: '26px'
          }}
          label={row?.is_validated == '1' ? 'Validé' : 'Non valide'}
        />
      )
    }
  ]
  if (auth?.user?.profile === 'MAR') {
    columns.push({
      headerAlign: 'center',
      flex: 0.03,
      field: 'company_name',
      headerName: 'Société',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.company_name}
        </Typography>
      )
    })
  }
  columns.push(
    {
      headerAlign: 'center',
      flex: 0.1,
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
      flex: 0.1,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* {listPermissions?.permissions.find(item => item.name == `view ${resource?.toLowerCase()}`).authorized && ( */}
          {/* <Tooltip title='Voir'>
              <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/operations/${row.id}/details`}>
                <Icon icon='mdi:eye-outline' fontSize='20px' />
              </IconButton>
            </Tooltip> */}

          {/* )} */}

          {listPermissions?.permissions.find(item => item.name == `update brands`).authorized === false &&
          listPermissions?.permissions.find(item => item.name == `delete brands`).authorized === false ? null : (
            <RowOptions row={row} resource={resource} />
          )}
        </Box>
      ),
      align: 'right'
    }
  )

  return columns
}

export default MarqueColum
