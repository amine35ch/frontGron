import { Box, Typography, Stack } from '@mui/material'
import { IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import CustomChip from 'src/@core/components/mui/chip'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import useStates from 'src/@core/hooks/useStates'
import moment from 'moment'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { useCancelInvoice } from 'src/services/subscription.service'

const RowOptions = ({ row, resource, resource_name, type }) => {
  const router = useRouter()
  const auth = useAuth()
  const cancelInvoiceMutation = useCancelInvoice()

  const DownloadInvoices = async () => {
    window.open(`${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/subscription/invoice/${row?.id}/download`, '_blank')
  }

  const cancelFacture = async () => {
    const data = {
      sub_invoice_id: row?.id,
      reference: row?.reference
    }
    try {
      await cancelInvoiceMutation.mutateAsync(data)
    } catch (error) {}
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* <Tooltip title='Voir'> */}
      <IconButton sx={{ p: 1 }} href={`/invoices/${row.id}/details`} color='secondary' title='Voir Document'>
        <IconifyIcon icon='carbon:data-view-alt' />
      </IconButton>

      <IconButton sx={{ p: 1 }} onClick={() => DownloadInvoices()} color='secondary' title='Télécharger Document'>
        <IconifyIcon icon='akar-icons:cloud-download' />
      </IconButton>
      {row?.state == 0 && (
        <IconButton sx={{ p: 1 }} onClick={() => cancelFacture()} color='error' title='Annuler Facture'>
          <IconifyIcon icon='mdi:cancel-circle-outline' />
        </IconButton>
      )}
    </Box>
  )
}

const FacturesColumns = ({ userRole, resource, type, resource_name }) => {
  const auth = useAuth()
  const { getStateByModel } = useStates()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'reference',
          label: 'Référence',
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
          label: 'Date',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.invoice_date).format('DD/MM/YYYY')}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          label: 'Montant HT',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
                <CustomCurrencyInput displayType='text' value={row?.amount_ht} />
              </Stack>
            </Stack>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number',
          label: 'Montant TTC',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
                <CustomCurrencyInput displayType='text' value={row?.amount_ttc} />
              </Stack>
            </Stack>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          label: 'État',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={getStateByModel('DProjectInvoiceHeader', row?.state)?.color}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={getStateByModel('DProjectInvoiceHeader', row?.state)?.name}
            />
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          label: 'Statut de paiement',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={row?.state === 0 ? 'error' : 'success'}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={row?.state === 0 ? 'Non payé' : 'Payé'}
            />
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          p: 0,
          sortable: false,
          field: 'actions',
          label: 'Actions',
          renderCell: ({ row }) => (
            <Box>
              {/*
            // <Box sx={{ display: 'flex', alignItems: 'center' }}>
            //   {listPermissions?.permissions.find(item => item.name == `view ${resource?.toLowerCase()}`).authorized && (
            //     <Tooltip title='Voir'>
            //       <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/beneficiaries/${row.id}/details`}>
            //         <Icon icon='mdi:eye-outline' fontSize='20px' />
            //       </IconButton>
            //     </Tooltip>
            //   )} */}

              <RowOptions row={row} resource={resource} />
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
          field: 'reference',
          label: 'Référence',
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
          label: 'Date',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.invoice_date).format('DD/MM/YYYY')}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          label: 'Montant HT',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
                <CustomCurrencyInput displayType='text' value={row?.amount_ht} />
              </Stack>
            </Stack>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number',
          label: 'Montant TTC',
          align: 'center',

          renderCell: ({ row }) => (
            <Stack>
              <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
                <CustomCurrencyInput displayType='text' value={row?.amount_ttc} />
              </Stack>
            </Stack>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          label: 'État',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={getStateByModel('DProjectInvoiceHeader', row?.state)?.color}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={getStateByModel('DProjectInvoiceHeader', row?.state)?.name}
            />
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          label: 'Actions',
          renderCell: ({ row }) => (
            <Box></Box>

            // <Box sx={{ display: 'flex', alignItems: 'center' }}>
            //   {listPermissions?.permissions.find(item => item.name == `view ${resource?.toLowerCase()}`).authorized && (
            //     <Tooltip title='Voir'>
            //       <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/beneficiaries/${row.id}/details`}>
            //         <Icon icon='mdi:eye-outline' fontSize='20px' />
            //       </IconButton>
            //     </Tooltip>
            //   )}
            //   {listPermissions?.permissions.find(item => item.name == `update ${resource?.toLowerCase()}`)
            //     .authorized === false &&
            //   listPermissions?.permissions.find(item => item.name == `delete ${resource?.toLowerCase()}`).authorized ===
            //     false ? null : (
            //     <RowOptions row={row} resource={resource} />
            //   )}
            // </Box>
          ),
          align: 'right'
        }
      ]
      break
  }
}

export default FacturesColumns
