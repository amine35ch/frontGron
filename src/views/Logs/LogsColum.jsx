import { Typography } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'

const LogsColum = ({ userRole, resource }) => {
  const router = useRouter()
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'msg',
          headerName: 'Message',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.message}
            </Typography>
          )
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.09,
        //   field: 'name',
        //   headerName: 'Route',
        //   align: 'center',

        //   renderCell: ({ row }) => (
        //     <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
        //       {row?.route}
        //     </Typography>
        //   )
        // },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Date',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.updated_at).format('DD/MM/YYYY HH:mm')}
            </Typography>
          )
        }
      ]

    default:
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'msg',
          headerName: 'Message',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.message}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Route',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.route}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Date',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {moment(row?.updated_at).format('DD/MM/YYYY')}
            </Typography>
          )
        }
      ]
      break
  }
}

export default LogsColum
