import React from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { Typography, Grid, Stack } from '@mui/material'
import moment from 'moment'
import CardBgBorderGreen from 'src/components/CardBgBorderGreen'
import { useTheme } from '@emotion/react'

const InvoiceHeader = ({ detailsInvoices }) => {
  const { user } = useAuth()
  const theme = useTheme()

  return (
    <>
      <Grid item xs={12} md={7}></Grid>
      <Grid item xs={0} md={2}></Grid>
      <Grid item xs={12} md={3}>
        <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 'bold' }}>{detailsInvoices?.reference}</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {moment(detailsInvoices?.invoice_date).format('DD/MM/YYYY')}
            </Typography>
          </Stack>
        </CardBgBorderGreen>
      </Grid>
      <Grid item xs={12} md={3}>
        <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {' '}
              <strong>Raison Social: </strong> {user?.trade_name}
            </Typography>
            <Typography>
              {' '}
              <strong>Ville: </strong>
              {user?.city}
            </Typography>
            <Typography>
              {' '}
              <strong>Adresse: </strong>
              {user?.address}
            </Typography>
            <Typography>
              {' '}
              <strong>Code Postale: </strong>
              {user?.zip_code}
            </Typography>
          </Stack>
        </CardBgBorderGreen>
      </Grid>
      <Grid item xs={12} md={6}></Grid>
      <Grid item xs={12} md={3}>
        <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 'bold' }}>{user?.company?.reference}</Typography>
            <Typography sx={{}}>{`${user?.first_name} ${user?.last_name}`}</Typography>
            <Typography sx={{}}>{user?.address}</Typography>
            <Typography sx={{}}>{user?.email}</Typography>
            <Typography sx={{}}>{user?.phone_number}</Typography>
          </Stack>
        </CardBgBorderGreen>
      </Grid>
    </>
  )
}

export default InvoiceHeader
