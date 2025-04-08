import { Typography } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import CustomChip from 'src/@core/components/mui/chip'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import useStates from 'src/@core/hooks/useStates'
import { useRouter } from 'next/router'

const PaymentTrackingColumn = ({ userRole, resource }) => {
  const { getStateByModel } = useStates()
  const router = useRouter()

  return [
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'reference',
      headerName: 'Ménage',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.entitled}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'reference',
      headerName: 'Référence dossier',
      align: 'center',

      renderCell: ({ row }) => (
        <div style={{ cursor: 'pointer' }} onClick={() => router.push(`/projects/${row?.id}/edit/`)}>
          <Typography
            color={`primary.active`}
            sx={{ fontSize: '14px', fontWeight: '500', textDecoration: 'underLine' }}
            variant='body2'
          >
            {row?.reference}
          </Typography>
        </div>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'type',
      headerName: 'Facture Accompagnement ',
      align: 'center',

      renderCell: ({ row }) =>
        row?.invoices?.map((invoice, key) =>
          invoice?.type == 0 ? (
            <div key={key} className='flex items-start flex-row' style={{ flexDirection: 'column' }}>
              <Typography
                color={invoice?.is_billed == '0' ? 'error' : 'primary.main'}
                sx={{ fontSize: '14px', fontWeight: '500', paddingBottom: '7px' }}
                variant='body2'
              >
                {invoice?.is_billed == '0' ? 'Facture non payée: ' : 'Facture payée:'}
              </Typography>

              {/* <div className='flex items-center' style={{ width: '7rem' }}>
                <CustomCurrencyInput custom={false} value={invoice?.TTC_total} />
              </div> */}
              <div style={{ width: '7rem' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
                  <CustomCurrencyInput displayType='text' custom={true} value={invoice?.TTC_total} />
                </Typography>
              </div>
            </div>
          ) : null
        )
    },

    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'addresse ',
      headerName: 'Facture Travaux  ',
      align: 'center',

      renderCell: ({ row }) =>
        row?.invoices?.map((invoice, key) =>
          invoice?.type == 1 ? (
            <div key={key} className='flex items-start flex-row' style={{ flexDirection: 'column' }}>
              <Typography
                color={invoice?.is_billed == '0' ? 'error' : 'primary.main'}
                sx={{ fontSize: '14px', fontWeight: '500', paddingBottom: '7px' }}
                variant='body2'
              >
                {invoice?.is_billed == '0' ? 'Facture non payée: ' : 'Facture payée:'}
              </Typography>

              <div style={{ width: '6rem' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
                  <CustomCurrencyInput displayType='text' custom={true} value={invoice?.TTC_total} />
                </Typography>
              </div>
            </div>
          ) : null
        )
    }
  ]

  // switch (userRole) {
  //   case 'admin':

  //   default:
  //     return []
  //     break
  // }
}

export default PaymentTrackingColumn
