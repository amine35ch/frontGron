import { Typography } from '@mui/material'
import { dateFormater } from 'src/@core/utils/utilities'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'

const WorksColumn = () => {
  return [
    {
      headerAlign: 'center',
      flex: 0.09,
      field: 'reference',
      headerName: 'Référence',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.work?.reference}
        </Typography>
      )
    },

    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'qty',
      headerName: 'Quantité',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.qty_simulation}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'year_of_birth',
      headerName: 'Prix unitaire H.T',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          <CustomCurrencyInput displayType='text' custom={true} value={row?.price_unit_ht_simulation} />
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'year_of_birth',
      headerName: 'Montant H.T',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          <CustomCurrencyInput displayType='text' custom={true} value={row?.cost_ht_simulation} />
        </Typography>
      )
    }
  ]
}

export default WorksColumn
