// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import 'moment/locale/fr'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Component Import
import ListPricingPlans from './ListPricingPlans'
import { useGetAllPlans, useGetSubscriberSubscription } from 'src/services/subscription.service'
import moment from 'moment'
import { useAuth } from 'src/hooks/useAuth'
import AddFeaturesSub from './AddFeaturesSub'
import { styled } from '@mui/material/styles'
import CurrentPlanSkeleton from './CurrentPlanSkeleton'
import PercentageFeatures from './PercentageFeatures'

moment.locale('fr')

const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1.1rem',
  alignSelf: 'flex-end'
})

const CustomCurrentPlan = ({ data }) => {
  const { loading } = useAuth()

  // ** State
  const [openPricingDialog, setOpenPricingDialog] = useState(false)
  const [openDialogFeatures, setOpenDialogFeatures] = useState(false)

  const { data: listPlans, isSuccess: isSuccessPlans, isPending } = useGetAllPlans()

  const {
    data: detailsSubscriberSubscription,
    isSuccess: isSuccessSubscriberSubscription,
    isLoading
  } = useGetSubscriberSubscription()

  return (
    <>
      <Card sx={{ px: 2 }}>
        <CardHeader title='Plan actuel' />
        <CardContent>
          <Grid container spacing={6} pr={6} alignItems={'center'}>
            {isLoading ? (
              <Grid item xs={12} md={8}>
                <CurrentPlanSkeleton />
              </Grid>
            ) : (
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 6 }}>
                  <div className='flex items-center mb-2'>
                    <Typography sx={{ fontWeight: 500, mr: 4 }}>
                      Votre forfait actuel est de {detailsSubscriberSubscription?.data?.plan?.name}
                    </Typography>

                    {detailsSubscriberSubscription?.data?.plan?.recommended == 1 && (
                      <CustomChip label='Recommandé' size='small' color='primary' skin='light' />
                    )}
                    {Number(detailsSubscriberSubscription?.data?.plan?.real_price_ht) === 0 && (
                      <CustomChip label='Non recommandé' size='small' color='error' skin='light' />
                    )}
                  </div>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Forfait standard pour les petites entreprises
                  </Typography>
                </Box>
                <Box sx={{ mb: 6 }}>
                  <Typography sx={{ mb: 2, fontWeight: 500 }}>
                    Date d'activation {moment(detailsSubscriberSubscription?.data?.start_date).format('DD MMMM YYYY')}
                  </Typography>
                </Box>
                <Box sx={{ mb: 6 }}>
                  <Typography sx={{ mb: 2, fontWeight: 500 }}>
                    Actif jusqu'au {moment(detailsSubscriberSubscription?.data?.end_date).format('DD MMMM YYYY')}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Nous vous enverrons une notification à l'expiration de l'abonnement
                  </Typography>
                </Box>
                <div>
                  <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
                    <Sup>€</Sup>
                    <Typography
                      variant='h3'
                      sx={{
                        mb: -3.5,
                        lineHeight: 1,
                        color: 'primary.main',
                        fontSize: '2.2rem !important'
                      }}
                    >
                      {Number(detailsSubscriberSubscription?.data?.plan?.real_price_ht).toFixed(2)}
                    </Typography>
                    <Sub>/ {detailsSubscriberSubscription?.data?.payment_type?.type == 0 ? 'Mois' : 'Ans'}</Sub>
                  </Box>
                  {/* <Typography sx={{ color: 'text.secondary' }}>Standard plan for small to medium businesses</Typography> */}
                </div>
              </Grid>
            )}
            <PercentageFeatures />
            <Grid item xs={12}>
              <Box sx={{ mt: 3, gap: 3, display: 'flex', flexWrap: 'wrap' }}>
                <Button variant='outlined' size='small' color='secondary' onClick={() => setOpenDialogFeatures(true)}>
                  Ajouter des fonctionnalités{' '}
                </Button>
                <Button variant='contained' size='small' onClick={() => setOpenPricingDialog(true)}>
                  Mise à niveau
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        fullWidth
        scroll={'paper'}
        maxWidth='lg'
        open={openPricingDialog}
        onClose={() => setOpenPricingDialog(false)}
        onBackdropClick={() => setOpenPricingDialog(false)}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setOpenPricingDialog(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>

          <ListPricingPlans
            listPlans={listPlans}
            isSuccessPlans={isSuccessPlans}
            setOpenPricingDialog={setOpenPricingDialog}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        scroll={'paper'}
        maxWidth='sm'
        open={openDialogFeatures}
        onClose={() => setOpenDialogFeatures(false)}
        onBackdropClick={() => setOpenDialogFeatures(false)}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 8 }, py: { xs: 8, sm: 8 }, position: 'relative' }}>
          <div className='flex items-center justify-between '>
            <Typography variant='h6' color={'primary'}>
              Choisissez parmi ces fonctionnalités
            </Typography>
            <IconButton size='small' onClick={() => setOpenDialogFeatures(false)}>
              <Icon icon='mdi:close' />
            </IconButton>
          </div>
          <AddFeaturesSub setOpen={setOpenDialogFeatures} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CustomCurrentPlan
