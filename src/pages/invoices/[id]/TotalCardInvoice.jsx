import { Card, Typography, Grid, Box, Divider } from '@mui/material'
import React from 'react'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { useTheme } from '@emotion/react'
import Image from 'next/image'

const TotalCardInvoice = ({ detailsInvoices }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        mx: 0,
        mb: 0,
        p: 5,
        bgcolor: theme.palette.secondary.beigeBared,
        paddingLeft: {
          md: 5
        },
        paddingRight: {
          md: 5
        }
      }}
    >
      <Grid container justifyContent='space-between' alignItems={'center'} spacing={2}>
        <Grid item md={7}>
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'block'
              }
            }}
          >
            <Image src={'/images/logos/logo-mar.png'} width={120} height={100} alt='logo' />
          </Box>
        </Grid>
        <Grid item md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={1}>
                <Grid item xs={6} md={8}>
                  <Typography fontWeight={'bold'} align='left' variant='subtitle1'>
                    Totale HT (Є) :
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography fontWeight={'bold'} align='right' variant='subtitle1'>
                    {/* {allAmounts?.travaux ?? 0} € */}
                    <CustomCurrencyInput displayType='text' value={detailsInvoices?.amount_ht} />
                    {/* <CurrencyFormat
                    decimalScale={2}
                    fixedDecimalScale
                    value={allAmounts?.montant_TTC_total}
                    displayType="text"
                    thousandSeparator
                    prefix="$"
                  /> */}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid container spacing={1}>
                <Grid item xs={6} md={9}>
                  <Typography fontWeight={'bold'} align='left' variant='subtitle1'>
                    Totale TTC (Є) :
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography fontWeight={'bold'} align='right' variant='subtitle1'>
                    <CustomCurrencyInput displayType='text' value={detailsInvoices?.amount_ttc} />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ bgcolor: 'dark.main' }} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography fontWeight={'bold'} align='left' color='error.dark' variant='subtitle1'>
                    Totale à payer(Є):
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight={'bold'} align='right' color='error.dark' variant='subtitle1'>
                    <CustomCurrencyInput displayType='text' value={detailsInvoices?.amount_ttc} />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default TotalCardInvoice
