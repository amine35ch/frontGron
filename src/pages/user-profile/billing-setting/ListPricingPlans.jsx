import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputLabel,
  LinearProgress,
  Switch,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import

// ** Custom Components Imports
import {
  useGetAllPlans,
  useGetPlanPaymentTypes,
  useGetSubscriberFeatures,
  useGetSubscriberSubscription,
  useUpdatePlan
} from 'src/services/subscription.service'
import IconifyIcon from 'src/@core/components/icon'

// ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  paddingTop: theme.spacing(10),
  borderRadius: theme.shape.borderRadius
}))

// ** Styled Component for the wrapper of all the features of a plan
const BoxFeature = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  '& > :not(:first-of-type)': {
    marginTop: theme.spacing(4)
  }
}))

const renderFeatures = data => {
  return data?.map((item, index) => (
    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box component='span' sx={{ display: 'inline-flex', color: 'text.secondary', mr: 2 }}>
        <Icon icon='mdi:circle-outline' fontSize='0.75rem' />
      </Box>
      <Typography variant='body2'>
        {item?.quantity} {item?.feature?.name}
      </Typography>
    </Box>
  ))
}

const ListPricingPlans = ({ listPlans, isSuccessPlans, isPending, setOpenPricingDialog }) => {
  const [arrayOfPlans, setArrayOfPlans] = useState([])
  const [typePlan, setTypePlan] = useState('monthly')
  const { data: subscriberSubscription } = useGetSubscriberSubscription()
  const updatePlanMutation = useUpdatePlan()
  useEffect(() => {
    if (isSuccessPlans) {
      if (typePlan === 'monthly') {
        setArrayOfPlans(listPlans?.data?.monthly.sort((a, b) => a.id - b.id))
      } else {
        setArrayOfPlans(listPlans?.data?.yearly.sort((a, b) => a.id - b.id))
      }
    }
  }, [typePlan, isSuccessPlans, listPlans?.data])

  const handleChangeSwitch = e => {
    const checked = e.target.checked
    if (checked) {
      setTypePlan('yearly')
    } else {
      setTypePlan('monthly')
    }
  }

  const handleUpdatePlan = async id => {
    const data = {
      p_plan_id: id
    }
    try {
      await updatePlanMutation.mutateAsync(data)

      // setOpenPricingDialog(false)
    } catch (error) {}
  }

  return (
    <>
      <Box sx={{ mb: [10, 17.5], textAlign: 'center' }}>
        <Typography variant='h4'>Les Abonnements</Typography>
        <Box sx={{ mt: 2.5, mb: 10.75 }}>
          <Typography variant='body2'>Profitez d'une expérience premium avec nos abonnements.</Typography>
          <Typography variant='body2'>
            Découvrez nos formules et choisissez celle qui vous convient le mieux pour une expérience optimale.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <InputLabel
            htmlFor='pricing-switch'
            sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
          >
            Mensuelle
          </InputLabel>
          <Switch color='secondary' id='pricing-switch' onChange={handleChangeSwitch} />
          <InputLabel htmlFor='pricing-switch' sx={{ fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
            Annuellement
          </InputLabel>

          <Box
            sx={{
              top: -30,
              left: '50%',
              display: 'flex',
              position: 'absolute',
              transform: 'translateX(35%)',
              '& svg': { mt: 2, mr: 1, color: 'text.disabled' }
            }}
          >
            <Icon icon='mdi:arrow-down-left' />
            <CustomChip size='small' skin='light' color='primary' label="Économisez jusqu'à 20 %" />
          </Box>
        </Box>
      </Box>
      {/* Card content */}
      <Grid container justifyContent={'center'} spacing={6} px={0}>
        {isPending && (
          <Box className='w-full flex justify-center h-96 flex-col items-center'>
            <CircularProgress />
            <Typography mt={2} variant='body2'>
              Chargement ...
            </Typography>
          </Box>
        )}

        {arrayOfPlans?.map((plan, key) => (
          <Grid item xs={12} key={key} md={4}>
            <BoxWrapper
              sx={{
                border: theme =>
                  plan?.recommended == 0
                    ? `1px solid ${theme.palette.divider}`
                    : `1px solid ${hexToRGBA(theme.palette.primary.main, 0.5)}`
              }}
            >
              {plan?.recommended == 1 ? (
                <CustomChip
                  skin='light'
                  label='Recommandé'
                  color='primary'
                  sx={{
                    top: 12,
                    right: 12,
                    height: 24,
                    position: 'absolute',
                    '& .MuiChip-label': {
                      px: 1.75,
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }
                  }}
                />
              ) : null}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconifyIcon icon={plan?.icon} color='#86A039' fontSize={50} />
                </Box>
                <Typography variant='h5' sx={{ mb: 1.5 }}>
                  {plan?.name}
                </Typography>
                <Typography variant='body2'>A simple start for everyone</Typography>
                <Box sx={{ my: 7, position: 'relative' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography
                      fontSize={15}
                      variant='body2'
                      sx={{ mt: 1.4, fontWeight: 500, alignSelf: 'flex-start' }}
                    >
                      €
                    </Typography>
                    <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {Number(plan?.real_price_ht)?.toFixed(2)}
                    </Typography>

                    <Typography variant='body2' sx={{ mb: 0.9, fontWeight: 600, alignSelf: 'flex-end' }}>
                      /mois
                    </Typography>
                  </Box>
                  {typePlan == 'yearly' ? (
                    <Typography
                      variant='caption'
                      sx={{ top: 30, left: '50%', position: 'absolute', transform: 'translateX(-50%)' }}
                    >{`$ ${Number(plan?.real_price_ht) * 12}/ans`}</Typography>
                  ) : null}
                </Box>
              </Box>
              <BoxFeature>{renderFeatures(plan?.features)}</BoxFeature>
              {subscriberSubscription?.data?.plan?.id === plan.id &&
              Number(plan?.real_price_ht) === Number(subscriberSubscription?.data?.plan?.real_price_ht) ? (
                <Button
                  fullWidth
                  color={'primary'}
                  variant={'outlined'}

                  // color={data?.currentPlan ? 'primary' : 'primary'}
                  // variant={data?.popularPlan ? 'contained' : 'outlined'}
                >
                  Votre forfait actuel
                  {/* {plan?.price_ht} {subscriberSubscription?.data?.plan?.price_ht} */}
                </Button>
              ) : plan?.name === 'Contacter nous' ? (
                <Button
                  fullWidth
                  color={'primary'}
                  variant={'contained'}

                  // color={data?.currentPlan ? 'primary' : 'primary'}
                  // variant={data?.popularPlan ? 'contained' : 'outlined'}
                >
                  Contacter le service commercial
                </Button>
              ) : (
                <Button
                  fullWidth
                  color={'primary'}
                  variant={'contained'}
                  onClick={() => handleUpdatePlan(plan?.id)}

                  // color={data?.currentPlan ? 'primary' : 'primary'}
                  // variant={data?.popularPlan ? 'contained' : 'outlined'}
                >
                  Activer
                </Button>
              )}
            </BoxWrapper>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default ListPricingPlans
