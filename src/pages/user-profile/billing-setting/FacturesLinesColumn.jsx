import { Box, Avatar, Tooltip, Typography, Stack } from '@mui/material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'

import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import CustomChip from 'src/@core/components/mui/chip'
import useStates from 'src/@core/hooks/useStates'
import { dateFormat } from 'src/@core/utils/utilities'
import moment from 'moment'
import { useRemoveProjectFromInvoice } from 'src/services/subscription.service'

const RowOptions = ({ row, resource, resource_name, type }) => {
  const router = useRouter()
  const auth = useAuth()

  return <></>
}

const FacturesLinesColumn = ({ userRole, resource, type, resource_name }) => {
  const auth = useAuth()
  const { getStateByModel } = useStates()

  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)
  const removeLineFromInvoiceMutation = useRemoveProjectFromInvoice()

  const handleDeleteClick = async (item, index, rowIndex, row) => {


    try {
      await removeLineFromInvoiceMutation.mutateAsync({ invoiceId: row?.id, lineId: item?.id })
    } catch (error) {}
  }
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'description',
          label: 'Description',
          align: 'center',

          renderCell: ({ item }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {item?.description}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          label: 'Date',
          align: 'center',

          renderCell: ({ item }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(item?.invoice_date)?.format('DD/MM/YYYY')}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          label: 'Montant HT',
          align: 'center',

          renderCell: ({ item }) => (
            <Stack>
              <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
                <CustomCurrencyInput displayType='text' value={item?.amount_ht} />
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

          renderCell: ({ item }) => (
            <Stack>
              <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
                <CustomCurrencyInput displayType='text' value={item?.amount_ttc} />
              </Stack>
            </Stack>
          )
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'address',
        //   label: 'État',
        //   align: 'center',

        //   renderCell: ({ item }) => (
        //     <CustomChip
        //       skin='light'
        //       color={getStateByModel('DProjectInvoiceHeader', item?.state)?.color}
        //       sx={{
        //         fontWeight: '600',
        //         fontSize: '.75rem',
        //         height: '26px'
        //       }}
        //       label={getStateByModel('DProjectInvoiceHeader', item?.state)?.name}
        //     />
        //   )
        // },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          label: 'Actions',
          renderCell: ({ item, index, rowIndex, row }) => (
            <Box>
              {row?.state == 0 && (
                <IconButton color='error' onClick={() => handleDeleteClick(item, index, rowIndex, row)}>
                  <IconifyIcon icon='mdi:minus' />
                </IconButton>
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

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'address',
        //   label: 'État',
        //   align: 'center',

        //   renderCell: ({ row }) => (
        //     <CustomChip
        //       skin='light'
        //       color={getStateByModel('DProjectInvoiceHeader', row?.state)?.color}
        //       sx={{
        //         fontWeight: '600',
        //         fontSize: '.75rem',
        //         height: '26px'
        //       }}
        //       label={getStateByModel('DProjectInvoiceHeader', row?.state)?.name}
        //     />
        //   )
        // },

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

export default FacturesLinesColumn
