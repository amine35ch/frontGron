import { Box, Switch, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useUpdateMarSelfCheckIn } from 'src/services/root-access.service'

const BusinessListColumns = () => {
  const [rowId, setRowId] = useState(null)

  const { mutate, isPending } = useUpdateMarSelfCheckIn()

  const handleUpdateSelfCheckIn = (rowId, rowSelfCheckIn) => {
    setRowId(rowId)

    mutate({
      id: rowId,
      selfCheckIn: rowSelfCheckIn === 1 ? 0 : 1
    })
  }

  return [
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
      headerName: 'Raison Social',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.trade_name}
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
      flex: 0.16,
      minWidth: 100,
      field: 'contact',
      headerName: 'contact',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.representative_last_name} {row?.representative_first_name}
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
          {row?.phone_number_1}
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
          <Tooltip title={row.selfCheckIn === 1 ? 'Désactiver' : 'Activer'}>
            <Switch
              disabled={isPending && row.id === rowId}
              checked={row.selfCheckIn === 1}
              onClick={() => handleUpdateSelfCheckIn(row.id, row.selfCheckIn)}
            />
          </Tooltip>
        </Box>
      ),
      align: 'center'
    }
  ]
}

export default BusinessListColumns
