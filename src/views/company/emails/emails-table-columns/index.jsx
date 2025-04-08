import { useState } from 'react'
import { Box, Switch, Tooltip, Typography } from '@mui/material'
import toast from 'react-hot-toast'

import { useEnableOrDisableEmail, useEnableOrDisablePlatform } from 'src/services/company.service'

const EmailsTableColumns = () => {
  const [rowId, setRowId] = useState(null)

  const { mutateAsync: updateEmailStatus, isPending: isEmailPending } = useEnableOrDisableEmail()
  const { mutateAsync: updatePlatformStatus, isPending: isPlatformPending } = useEnableOrDisablePlatform()

  const handleEnableOrDisableEmail = (id, status) => {
    setRowId(id)

    updateEmailStatus(
      {
        id,
        status
      },
      {
        onSuccess: () => {
          toast.success(
            Number(status) === 1
              ? 'Notification par Email désactivée avec succès'
              : 'Notification par Email activée avec succès'
          )
        },
        onError: () => {
          toast.error(
            Number(status) === 1
              ? 'Erreur lors de la désactivation de notification par Email'
              : "Erreur lors de l'activation de notification par Email"
          )
        }
      }
    )
  }
  const handleEnableOrDisablePlatform = (id, statusWeb) => {
    setRowId(id)

    updatePlatformStatus(
      { id, statusWeb },
      {
        onSuccess: () => {
          toast.success(
            Number(statusWeb) === 1
              ? 'Notification sur la platforme désactivée avec succès'
              : 'Notification sur la platforme activée avec succès'
          )
        },
        onError: () => {
          toast.error(
            Number(statusWeb) === 1
              ? 'Erreur lors de la désactivation de la notification sur la platforme'
              : "Erreur lors de l'activation de la notification sur la platforme"
          )
        }
      }
    )
  }

  return [
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'sujet',
      headerName: 'Sujet',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.notification?.subject}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      sortable: false,
      field: 'notification par Email',
      headerName: 'Notification par Email',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={row.status === 1 ? 'Désactiver' : 'Activer'}>
            <Switch
              disabled={isEmailPending && row.id === rowId}
              checked={Number(row.status) === 1}
              onClick={() => handleEnableOrDisableEmail(row.id, row.status)}
            />
          </Tooltip>
        </Box>
      ),
      align: 'center'
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      sortable: false,
      field: 'notification sur la Plateforme',
      headerName: 'Notification sur la Plateforme',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={row.statusWeb === 1 ? 'Désactiver' : 'Activer'}>
            <Switch
              disabled={isPlatformPending && row.id === rowId}
              checked={Number(row.statusWeb) === 1}
              onClick={() => handleEnableOrDisablePlatform(row.id, row.statusWeb)}
            />
          </Tooltip>
        </Box>
      ),
      align: 'center'
    }
  ]
}

export default EmailsTableColumns
