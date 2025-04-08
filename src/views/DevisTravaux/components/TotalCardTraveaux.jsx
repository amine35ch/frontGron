import PropTypes from 'prop-types'

// material-ui
import { Box, Card, Divider, Grid, Typography } from '@mui/material'
import Image from 'next/image'

// third-party

// project imports

import { lighten, useTheme } from '@mui/material/styles'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'

// ==============================|| TOTAL-SUBCARD PAGE ||============================== //

function TotalCardTraveaux({ allAmounts }) {
  const theme = useTheme()

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          mx: 0,
          mb: 0,
          p: 5,

          // bgcolor: '#F1F6F9',
          // border: `1px solid ${theme.palette.primary.main}`,

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
          <Grid item md={5}>
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
          <Grid item md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={1}>
                  <Grid item xs={5} md={8}>
                    <Typography fontWeight={'bold'} align='left' variant='subtitle1'>
                      Coût des travaux HT (Є) :
                    </Typography>
                  </Grid>
                  <Grid item xs={7} md={4}>
                    <Typography fontWeight={'bold'} align='right' variant='subtitle1'>
                      <CustomCurrencyInput displayType='text' value={allAmounts?.amount_ht} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={12}>
                <Grid container spacing={1}>
                  <Grid item xs={5} md={9}>
                    <Typography fontWeight={'bold'} align='left' variant='subtitle1'>
                      Montant TVA (Є) :
                    </Typography>
                  </Grid>
                  <Grid item xs={7} md={3}>
                    <Typography fontWeight={'bold'} align='right' variant='subtitle1'>
                      <CustomCurrencyInput displayType='text' value={allAmounts?.amount_tva} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container spacing={1}>
                  <Grid item xs={5} md={9}>
                    <Typography fontWeight={'bold'} align='left' variant='subtitle1'>
                      Montant TTC (Є) :
                    </Typography>
                  </Grid>
                  <Grid item xs={7} md={3}>
                    <Typography fontWeight={'bold'} align='right' variant='subtitle1'>
                      <CustomCurrencyInput displayType='text' value={allAmounts?.amount_ttc} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container spacing={1}>
                  <Grid item xs={5} md={9}>
                    <Typography fontWeight={'bold'} align='left' variant='subtitle1'>
                      Montant d'aide HT (Є) :
                    </Typography>
                  </Grid>
                  <Grid item xs={7} md={3}>
                    <Typography fontWeight={'bold'} align='right' variant='subtitle1'>
                      <CustomCurrencyInput displayType='text' value={allAmounts?.HT_anah} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ bgcolor: 'dark.main' }} />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <Typography fontWeight={'bold'} align='left' color='error.dark' variant='subtitle1'>
                      Reste à charge TTC (Є) :
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography fontWeight={'bold'} align='right' color={'error.dark'} variant='subtitle1'>
                      <CustomCurrencyInput displayType='text' value={allAmounts?.TTC_rest} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

TotalCardTraveaux.propTypes = {
  productsData: PropTypes.array,
  allAmounts: PropTypes.object
}

export default TotalCardTraveaux
