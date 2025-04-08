import Iconify from '@iconify/iconify'
import { Card, CardContent, IconButton } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { Icon } from '@iconify/react'

const workModalProductColumns = (
  selectedProductsIds,
  handleSelectProduct,
  productsData,
  disabledInput,
  handleRemoveProductRow,
  handleAddProductRow
) => {
  return [
    {
      field: 'reference',
      label: 'Reference',
      width: 300,
      align: 'center',
      renderCell: ({ row, index }) => {
        return (
          <CustomeAutoCompleteSelect
            getOptionDisabled={option => selectedProductsIds?.includes(option.id)}
            option='id'
            disabled={disabledInput}
            value={row?.id}
            onChange={value => handleSelectProduct(value, index)}
            data={productsData}
            displayOption={'reference'}
          />
        )
      }
    },
    {
      field: 'qte',
      label: 'Prix unitaire HT',
      width: 100,
      align: 'center',
      renderCell: ({ row, index }) =>
        row?.prix_vente_ht ? (
          <Card sx={{ padding: 1 }}>
            <CustomCurrencyInput displayType='text' value={row?.prix_vente_ht} />
          </Card>
        ) : null
    },
    {
      field: 'action',
      label: (
        <IconButton
          sx={{
            color: 'white',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
          onClick={handleAddProductRow}
        >
          <IconifyIcon icon='fa-solid:plus' width='0.7em' height='0.7em' />
        </IconButton>
      ),
      width: 100,
      align: 'center',
      renderCell: ({ row, index }) => (
        <IconButton
          sx={{
            color: 'white',
            backgroundColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
          onClick={() => handleRemoveProductRow(index)}
        >
          <IconifyIcon icon='oi:minus' width='0.7em' height='0.7em' />
        </IconButton>
      )
    }
  ]
}

const workModalServiceColumns = (
  selectedServicesIds,
  handleSelectService,
  ServicesData,
  disabledInput,
  handleRemoveServiceRow,
  handleAddServiceRow
) => {
  return [
    {
      field: 'designation',
      label: 'Désignation',
      width: 300,
      align: 'center',
      renderCell: ({ row, index }) => (
        <CustomeAutoCompleteSelect
          getOptionDisabled={option => selectedServicesIds?.includes(option.id)}
          option='id'
          disabled={disabledInput}
          value={row?.id}
          onChange={value => handleSelectService(value, index)}
          data={ServicesData}
          displayOption={'designation'}
        />
      )
    },

    {
      field: 'action',
      label: (
        <IconButton
          sx={{
            color: 'white',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
          onClick={handleAddServiceRow}
        >
          <IconifyIcon icon='fa-solid:plus' width='0.7em' height='0.7em' />
        </IconButton>
      ),
      width: 100,
      align: 'center',
      renderCell: ({ row, index }) => (
        <IconButton
          sx={{
            color: 'white',
            backgroundColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
          onClick={() => handleRemoveServiceRow(index)}
        >

          <IconifyIcon icon='oi:minus' width='0.7em' height='0.7em' />
        </IconButton>
      )
    }
  ]
}

export { workModalProductColumns, workModalServiceColumns }
