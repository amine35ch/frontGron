import { Box, Avatar, Tooltip, Typography, CircularProgress } from '@mui/material'
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
import CustomChip from 'src/@core/components/mui/chip'
import { dateFormater } from 'src/@core/utils/utilities'
import { useAddProjectToInvoice, useSendUnpayedProjects } from 'src/services/subscription.service'
import { LoadingButton } from '@mui/lab'

const RowOptions = ({ row, resource, state, showAllColumn, acceptProject, refuseProject }) => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const deleteProjectMutation = useDeleteProject()
  const sendUnpayedProjectsMutation = useSendUnpayedProjects()
  const addProjectToInvoiceMutataion = useAddProjectToInvoice()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteProjecttValidation = async event => {
    setSuspendDialogOpen(false)

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

  const handleAccept = () => {
    acceptProject(row)
  }

  const handleRefuse = () => {
    refuseProject(row)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleGenerateInvoice = async () => {
    const data = {
      projects_ids: [row?.id]
    }
    try {
      await sendUnpayedProjectsMutation.mutateAsync(data)
      setSelectedRows([])
      setAnchorEl(null)
    } catch (error) {
      setAnchorEl(null)
    }
  }

  const handleAddProjectToInvoice = async event => {
    setSuspendDialogOpen(false)

    try {
      if (event) {
        await addProjectToInvoiceMutataion.mutateAsync({ invoiceId: id, projectID: row?.id })
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  return (
    <>
      {showAllColumn ? (
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <Icon icon='mdi:dots-vertical' fontSize='20px' />
        </IconButton>
      ) : (
        <LoadingButton size='small' variant='outlined' onClick={handleAddProjectToInvoice}>
          Générer Facture
        </LoadingButton>
      )}
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
        {/* {listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized && ( */}
        {state !== 2 && (
          <MenuItem
            onClick={handleDelete}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: 'red' }}
          >
            <Icon icon='mdi:delete-outline' color='red' fontSize={18} />
            Supprimer
          </MenuItem>
        )}
        {row?.project_type === 0 && (
          <MenuItem onClick={handleAccept} className='!px-2 !pb-1' sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}>
            <Icon icon='mdi:check-outline' fontSize={18} />
            Accepter
          </MenuItem>
        )}
        {row?.project_type === 0 && (
          <MenuItem
            onClick={handleRefuse}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: 'red' }}
          >
            <Icon icon='mdi:cancel-outline' color='red' fontSize={18} />
            Refuer
          </MenuItem>
        )}
        {state == 2 && (
          <MenuItem onClick={handleGenerateInvoice} className='!px-2 !pb-1'>
            {sendUnpayedProjectsMutation?.isPending ? (
              <CircularProgress size={17} />
            ) : (
              <IconifyIcon icon='mdi:file-document-outline' color='#86a039' fontSize={17} />
            )}
            <Typography fontSize={14} ml={2}>
              Générer Facture
            </Typography>
          </MenuItem>
        )}
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer projet ${row?.client?.first_name + ' ' + row?.client?.last_name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteProjecttValidation}
      />
    </>
  )
}

const ProjectColumn = ({ userRole, resource, resource_name, state, showAllColumn, acceptProject, refuseProject }) => {
  // const { getStateByModel } = useStates()
  const { user } = useAuth()
  const listPermissions = user?.permissions?.find(item => item.resource_name === resource_name)

  let columns = []
  if (userRole !== 'AUD') {
    columns.push({
      headerAlign: 'center',
      flex: 0.9,
      field: 'step.display_name',
      headerName: 'Étape',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.step?.display_name}
        </Typography>
      )
    })
  }
  columns.push({
    headerAlign: 'center',
    flex: 0.1,
    field: 'anah_folder.anah_folder',
    headerName: 'N° Dossier Anah',
    align: 'center',

    renderCell: ({ row }) => (
      <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
        {row?.anah_folder?.anah_folder}
      </Typography>
    )
  })
  if (userRole !== 'INS') {
    columns.push({
      headerAlign: 'center',
      flex: 0.1,
      field: 'installer_trade_name',
      headerName: 'Entreprise retenue',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.installer_trade_name}
        </Typography>
      )
    })
  }
  if (userRole !== 'AUD') {
    columns.push({
      headerAlign: 'center',
      flex: 0.1,
      field: 'type_demande_project',
      headerName: 'Source',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.type_demande_project}
        </Typography>
      )
    })
  }

  columns.push(
    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'created_at',
      headerName: 'Date du dossier',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {dateFormater(row?.created_at)}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.09,
      field: 'client.first_name',
      headerName: 'Intitulé Client',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.client?.first_name + ' ' + row?.client?.last_name}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'company_creator',
      headerName: `${userRole !== 'AUD' ? 'société' : 'Mar'}`,
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.company_creator}
        </Typography>
      )
    },
    showAllColumn && {
      headerAlign: 'center',
      flex: 0.15,
      field: 'client.address',
      headerName: 'Adresse Client',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.client?.address}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.15,
      field: 'client.phone_number_1',
      headerName: 'Numéro de télephone Client',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.client?.phone_number_1}
        </Typography>
      )
    }
  )
  if (state === 2) {
    if (user?.profile === 'MAR') {
      columns.push({
        headerAlign: 'center',
        flex: 0.1,
        field: 'payment',
        headerName: 'Statut de Paiement',
        align: 'center',
        renderCell: ({ row }) => (
          <CustomChip
            skin='light'
            color={
              row?.invoice_mar && row?.invoice_installer == '0'
                ? 'error'
                : row?.invoice_mar && row?.invoice_installer == '3'
                ? 'success'
                : 'warning'
            }
            sx={{
              fontWeight: '600',
              fontSize: '.75rem',
              height: '26px'
            }}
            label={
              row?.invoice_mar && row?.invoice_installer == '0'
                ? 'Non Payé'
                : row?.invoice_mar && row?.invoice_installer == '3'
                ? 'Payé'
                : 'Partiellement Payé'
            }
          />
        )
      })
    } else if (user.profile === 'INS') {
      columns.push({
        headerAlign: 'center',
        flex: 0.1,
        field: 'payment',
        headerName: 'Statut de Paiement',
        align: 'center',
        renderCell: ({ row }) => (
          <CustomChip
            skin='light'
            color={row?.invoice_installer == '0' ? 'error' : row?.invoice_installer == '3' ? 'success' : 'warning'}
            sx={{
              fontWeight: '600',
              fontSize: '.75rem',
              height: '26px'
            }}
            label={
              row?.invoice_installer == '0' ? 'Non Payé' : row?.invoice_installer == '3' ? 'Payé' : 'Partiellement Payé'
            }
          />
        )
      })
    }
    columns.push({
      headerAlign: 'center',
      flex: 0.1,
      field: 'payment',
      headerName: 'Statut de Facturation',
      align: 'center',
      renderCell: ({ row }) => (
        <div>
          <CustomChip
            skin='light'
            color={row?.project_billed == '0' ? 'error' : 'success'}
            sx={{
              fontWeight: '600',
              fontSize: '.75rem',
              height: '26px'
            }}
            label={row?.project_billed == '0' ? 'Non Facturée' : 'Facturée'}
          />
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
        {showAllColumn && (
          <Tooltip title='Voir'>
            <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/projects/${row.id}/edit`}>
              <Icon icon='mdi:eye-outline' fontSize='20px' />
            </IconButton>
          </Tooltip>
        )}
        {listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized &&
          state !== 3 && (
            <RowOptions
              row={row}
              state={state}
              showAllColumn={showAllColumn}
              acceptProject={acceptProject}
              refuseProject={refuseProject}
            />
          )}
      </Box>
    ),
    align: 'right'
  })

  return columns
}

export default ProjectColumn
