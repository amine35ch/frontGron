import { Typography } from '@mui/material'
import { dateFormater } from 'src/@core/utils/utilities'

const OccupantColumn = () => {
  return [
    {
      headerAlign: 'center',
      flex: 0.09,
      field: 'civility',
      headerName: 'Civilité',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.civility}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'name',
      headerName: 'Nom et prénom',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.last_name} {row?.first_name}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'year_of_birth',
      headerName: 'Année de naissance',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.year_of_birth}
        </Typography>
      )
    }
  ]
}

export default OccupantColumn
