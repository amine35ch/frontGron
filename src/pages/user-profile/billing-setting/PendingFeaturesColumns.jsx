import { Box, Typography, Stack } from '@mui/material'
import { IconButton } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import CustomChip from 'src/@core/components/mui/chip'
import moment from 'moment'
import { useRemoveFeatures } from 'src/services/subscription.service'

const PendingFeaturesColumns = ({ userRole }) => {
  const removeFeaturesMutation = useRemoveFeatures()

  const handleDeleteClick = async row => {
    const data = {
      d_subscriber_feature: row?.id
    }

    try {
      await removeFeaturesMutation.mutateAsync(data)
    } catch (error) {}
  }
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'features',
          headerName: 'Nom du fonctionnalité',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.feature}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Date',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.created_at)?.format('DD/MM/YYYY')}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Quantité',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.quantity}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Montant HT',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} gap={1}>
                <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
                  <CustomCurrencyInput displayType='text' value={row?.amount_ht} />
                </Typography>
              </Stack>
            </Stack>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Montant TTC',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} gap={1}>
                <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
                  <CustomCurrencyInput displayType='text' value={row?.amount_ttc} />{' '}
                </Typography>
              </Stack>
            </Stack>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'state',
          headerName: 'État',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={row?.active === 0 ? 'warning' : 'success'}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={row?.active === 0 ? 'En attente' : 'Payé'}
            />
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box>
              <IconButton color='error' onClick={() => handleDeleteClick(row)}>
                <IconifyIcon icon='mdi:minus' />
              </IconButton>
            </Box>
          ),
          align: 'right'
        }
      ]

    default:
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'features',
          headerName: 'Nom du fonctionnalité',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.feature}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Date',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.created_at)?.format('DD/MM/YYYY')}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Quantité',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.quantity}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Montant HT',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} gap={1}>
                <CustomCurrencyInput displayType='text' value={row?.amount_ht} />
              </Stack>
            </Stack>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Montant TTC',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} gap={1}>
                <CustomCurrencyInput displayType='text' value={row?.amount_ttc} />
              </Stack>
            </Stack>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'state',
          headerName: 'État',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={row?.active === 0 ? 'warning' : 'success'}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={row?.active === 0 ? 'Non payé' : 'Payé'}
            />
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ item, index, rowIndex, row }) => (
            <Box>
              <IconButton color='error' onClick={() => handleDeleteClick(item, index, rowIndex, row)}>
                <IconifyIcon icon='mdi:minus' />
              </IconButton>
            </Box>
          ),
          align: 'right'
        }
      ]
      break
  }
}

export default PendingFeaturesColumns
