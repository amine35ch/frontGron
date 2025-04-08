import { Box, Typography } from '@mui/material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useState } from 'react'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'

import DialogAlert from '../components/dialogs/DialogAlert'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import CustomChip from 'src/@core/components/mui/chip'
import useStates from 'src/@core/hooks/useStates'
import {
  useDeleteArticle,
  useDisabledArticles,
  useEnableArticles,
  useValidateArticles
} from 'src/services/articles.service'

const RowOptions = ({ row, resource, resource_name, type }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const deleteArticleMutation = useDeleteArticle()
  const enableArticleMutation = useEnableArticles({ id: row?.id, type: type })
  const disabledArticleMutation = useDisabledArticles({ id: row?.id, type: type })
  const validateArticleMutation = useValidateArticles({ id: row?.id, type: type })

  const auth = useAuth()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleValidateArticles = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = type => {
    if (type == '0') {
      router.push(`/Catalog/products/${row?.id}/edit`)
    } else if (type == '1') {
      router.push(`/Catalog/services/${row?.id}/edit`)
    } else if (type == '2') {
      router.push(`/Catalog/prestations-mar/${row?.id}/edit`)
    }
  }

  const handleValidateArticlesMuatation = async event => {
    setSuspendDialogOpen(false)
    if (!event) return
    try {
      await validateArticleMutation.mutateAsync()
    } catch (error) {}
  }

  const handleDisabledArticlesMuatation = async event => {
    try {
      await disabledArticleMutation.mutateAsync()
    } catch (error) {}
  }

  const handleEnabledArticlesMuatation = async event => {
    try {
      await enableArticleMutation.mutateAsync()
    } catch (error) {}
  }

  const handleDelete = () => {
    setDialogDeleteOpen(true)
  }

  const handleDeleteArticlesMuatation = async event => {
    setDialogDeleteOpen(false)
    if (!event) return
    try {
      await deleteArticleMutation.mutateAsync({ id: row.id, type: type })
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
        {listPermissions?.permissions.find(item => item.name == `update ${resource?.toLowerCase()}`).authorized && (
          <MenuItem
            onClick={() => handleEdit(type)}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}
          >
            <Icon icon='mdi:pencil-outline' fontSize={18} />
            Modifier
          </MenuItem>
        )}
        {row?.state === 0 ? (
          <MenuItem
            onClick={handleEnabledArticlesMuatation}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#86A039' }}
          >
            <Icon color={'#86A039'} icon='material-symbols-light:notifications-active-rounded' fontSize={19} />
            Activer
          </MenuItem>
        ) : row?.state === 1 ? (
          <MenuItem
            onClick={handleDisabledArticlesMuatation}
            className='!px-2 !pb-1'
            color='warning'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#FDB528' }}
          >
            <Icon color={'#FDB528'} icon='material-symbols-light:notifications-active-rounded' fontSize={19} />
            Désactiver
          </MenuItem>
        ) : null}

        {listPermissions?.permissions.find(item => item.name == `validate ${resource?.toLowerCase()}`).authorized &&
          (auth?.user?.profile == 'MAR' ? (
            row?.is_validated === 0 ? (
              <MenuItem
                onClick={handleValidateArticles}
                className='!px-2 !pb-1'
                sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#86A039' }}
              >
                <Icon color={'#86A039'} icon='mdi:check' fontSize={19} />
                Valider
              </MenuItem>
            ) : (
              <MenuItem
                onClick={handleValidateArticles}
                className='!px-2 !pb-1'
                sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: 'red' }}
              >
                <Icon color={'red'} icon='icomoon-free:blocked' fontSize={15} />
                Refuser
              </MenuItem>
            )
          ) : null)}
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
        title={`Voulez-vous vraiment valider produit ${type === '0' ? row?.reference : row?.designation} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={handleValidateArticlesMuatation}
      />

      <DialogAlert
        open={dialogDeleteOpen}
        description=''
        setOpen={setDialogDeleteOpen}
        title={`Voulez-vous vraiment supprimer produit ${type === '0' ? row?.reference : row?.designation} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={handleDeleteArticlesMuatation}
      />
    </>
  )
}

const ArticlesColum = ({ userRole, resource, type, resource_name }) => {
  const auth = useAuth()
  const { getStateByModel } = useStates()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  let columns = [
    {
      headerAlign: 'center',
      flex: 0.03,
      field: 'etat',
      headerName: 'État',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin='light'
            color={getStateByModel('DArticlePrice', parseInt(row?.state))?.color}
            sx={{
              fontWeight: '600',
              fontSize: '.75rem',
              height: '26px'
            }}
            label={getStateByModel('DArticlePrice', parseInt(row?.state))?.name}
          />
        )
      }
    },
    {
      headerAlign: 'center',
      flex: 0.03,
      field: 'validation',
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

  if (type === '0') {
    columns.push({
      headerAlign: 'center',
      flex: 0.03,
      field: 'Type',
      headerName: 'Référence',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.reference}
        </Typography>
      )
    })
  }
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
  if (type !== '0') {
    columns.push({
      headerAlign: 'center',
      flex: 0.03,
      field: 'Type',
      headerName: 'Désignation',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.designation}
        </Typography>
      )
    })
  }
  if (type === '1') {
    columns.push({
      headerAlign: 'center',
      flex: 0.03,
      field: 'Geste',
      headerName: 'Geste',
      align: 'center',
      renderCell: ({ row }) =>
        row?.works?.map((work, index) => (
          <Typography key={index} sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
            - {work?.reference}
          </Typography>
        ))
    })
  }
  if (type === '0') {
    columns.push(
      {
        headerAlign: 'center',
        flex: 0.03,
        field: 'Marque',
        headerName: 'Marque',
        align: 'center',
        renderCell: ({ row }) => (
          <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
            {row?.brand?.entitled}
          </Typography>
        )
      },
      {
        headerAlign: 'center',
        flex: 0.03,
        field: 'category',
        headerName: 'Catégorie',
        align: 'center'
      },
      {
        headerAlign: 'center',
        flex: 0.03,
        field: 'sub_category',
        headerName: 'Prix de vente',
        align: 'center',
        renderCell: ({ row }) => (
          <div style={{ width: '5rem' }}>
            <CustomCurrencyInput displayType='text' custom={true} value={row?.prix_vente_ht} />
          </div>
        )
      }
    )
  }
  if (type === '2') {
    columns.push({
      headerAlign: 'center',
      flex: 0.09,
      field: 'unit_price',
      headerName: 'Prix de vente',
      align: 'center',

      renderCell: ({ row }) => (
        <div style={{ width: '5rem' }}>
          <CustomCurrencyInput displayType='text' custom={true} value={row?.unit_price} />
        </div>
      )
    })
  }
  columns.push({
    headerAlign: 'center',
    flex: 0.1,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {listPermissions?.permissions.find(item => item.name == `update articles`).authorized === false &&
        listPermissions?.permissions.find(item => item.name == `delete articles`).authorized === false ? (
          '___'
        ) : (
          <RowOptions row={row} resource={resource} resource_name={resource_name} type={type} />
        )}
      </Box>
    ),
    align: 'right'
  })

  return columns
}

export default ArticlesColum
