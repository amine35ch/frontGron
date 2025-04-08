import { Grid, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import IconifyIcon from 'src/@core/components/icon'
import CountDown from 'src/components/CountDown'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { useGetProjectInvoice, useUpdateProjectInvoiceBilling } from 'src/services/project.service'

const StepTrackPayments = ({ detailsProject }) => {
  const [countdown, setCountdown] = useState(null)

  const {
    data: projectInvoiceList,
    isLoading: isProjectInvoiceLoading,
    isSuccess: isProjectInvoiceSuccess
  } = useGetProjectInvoice({ id: detailsProject?.id })
  const updateInvoiceMutation = useUpdateProjectInvoiceBilling({ id: detailsProject?.id })

  const handleTogglePayed = async (billed, invoice) => {
    try {
      await updateInvoiceMutation.mutateAsync({
        payed_amount: invoice?.payed_amount,
        is_billed: billed ? 1 : 0,
        d_project_header_invoice_id: invoice?.id
      })
    } catch (error) {}
  }

  return (
    <Grid container spacing={5} className='!mt-5 '>
      <Grid item xs={12} md={12} className='flex items-center justify-center '>
        <CountDown start={detailsProject?.anah_date} />
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          item
          sx={{
            padding: '3px',
            mb: 2
          }}
          justifyItems={'center'}
        >
          <Grid item className='flex items-center text-center' xs={5} md={2}>
            <Typography className='!font-medium  !mt-2 !ml-2' sx={{ color: '#2a2e34' }}>
              Type
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} className='flex items-center '>
            <Typography className='!font-medium  !mt-2 !ml-2' sx={{ color: '#2a2e34' }}>
              Rest a charge HT
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} className='flex items-center '>
            <Typography className='!font-medium  !mt-2 !ml-2' sx={{ color: '#2a2e34' }}>
              Total TTC
            </Typography>
          </Grid>

          <Grid item xs={2} md={2} className='flex items-center justify-center'>
            <Typography className='!font-medium  !mt-2 !ml-2' sx={{ color: '#2a2e34' }}>
              Etat
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} className='flex items-center justify-end'></Grid>
        </Grid>
        {projectInvoiceList?.map((invoice, index) => (
          <Grid
            key={index}
            container
            item
            sx={{
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
              padding: '3px'
            }}
            justifyItems={'center'}
          >
            <Grid item className='flex items-center text-center' xs={5} md={2}>
              <Typography className='!font-semibold  !mt-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Payment {invoice?.type === 0 ? 'Accompagnement' : 'Travaux'}
              </Typography>
            </Grid>
            <Grid item xs={2} md={2} className='flex items-center '>
              <Typography className='!font-medium  !mt-2 !ml-2' color={'primary.main'}>
                <CustomCurrencyInput displayType='text' value={invoice?.HT_rest} />
              </Typography>
            </Grid>
            <Grid item xs={2} md={2} className='flex items-center '>
              <Typography className='!font-medium  !mt-2 !ml-2' color={'secondary.main'}>
                <CustomCurrencyInput displayType='text' value={invoice?.TTC_total} />
              </Typography>
            </Grid>
            <Grid item xs={2} md={2} className='flex items-center justify-center '>
              <Typography className='!font-medium !ml-2 !mt-2'>
                {invoice?.is_billed === 0 ? 'Non payé' : 'Payé'}
              </Typography>
            </Grid>

            <Grid item xs={2} md={2} className='flex items-center justify-end'>
              <IconButton
                disabled={isProjectInvoiceLoading}
                onClick={() => handleTogglePayed(!invoice?.is_billed, invoice)}
                color={invoice?.is_billed === 0 ? 'success' : 'error'}
              >
                {invoice?.is_billed === 0 ? <IconifyIcon icon='icons8:checked' /> : <IconifyIcon icon='icons8:minus' />}
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export default StepTrackPayments
