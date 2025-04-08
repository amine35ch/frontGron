import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Radio, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import Icon from 'src/@core/components/icon'
import { useGetAllPaymentMethodesByCompany, useGetPaymentMethods } from 'src/services/subscription.service'
import CustomChip from 'src/@core/components/mui/chip'
import CustomModal from 'src/components/CustomModal'
import CheckoutForm from './CheckoutForm'
import CustomizedAccordions from './CustomizedAccordions'

const data = [
  {
    cardCvc: '587',
    name: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    badgeColor: 'primary',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png',
    default: true
  },
  {
    cardCvc: '681',
    imgAlt: 'Visa card',
    expiryDate: '02/24',
    name: 'Mildred Wagner',
    cardNumber: '4532 3616 2070 5678',
    imgSrc: '/images/logos/visa.png',
    default: false
  },
  {
    cardCvc: '3845',
    expiryDate: '08/20',
    badgeColor: 'error',
    cardStatus: 'Expiré',
    name: 'Lester Jennings',
    imgAlt: 'American Express card',
    cardNumber: '3700 000000 00002',
    imgSrc: '/images/logos/american-express.png',
    default: false
  }
]

const PaymentsMethode = () => {
  const [openModal, setOpenModal] = useState(false)
  const [radioCheked, setRadioCheked] = useState(false)
  const [radioIndex, setRadioIndex] = useState(null)
  const [idPayment, setIdPayment] = useState(null)

  const [cardInformation, setCardInformation] = useState({
    name_card: '',
    number_card: '',
    expiration_year: '',
    expiration_month: '',
    default: false
  })
  const { data: listPaymentMethods } = useGetPaymentMethods()
  const { data: listAllPaymentMethodesByCompany } = useGetAllPaymentMethodesByCompany()
  useEffect(() => {
    listAllPaymentMethodesByCompany &&
      listAllPaymentMethodesByCompany?.data?.map(item => console.log(typeof item?.data?.expiration_year))
  }, [listAllPaymentMethodesByCompany])

  return (
    <Grid item xs={12} mt={4}>
      <Card>
        <CardHeader
          title='Mes méthodes de paiement'

          // action={
          //   <Button
          //     onClick={() => setOpenModal(true)}
          //     variant='contained'
          //     size='small'
          //     color='secondary'
          //     sx={{ '& svg': { mr: 1 } }}
          //   >
          //     <Icon icon='mdi:plus' fontSize='1.125rem' />
          //     Ajouter
          //   </Button>
          // }
        />
        <CardContent>
          <Grid container spacing={4}>
            {listAllPaymentMethodesByCompany?.data?.map((item, index) => (
              <Grid key={index} item xs={12} md={4}>
                <Box
                  sx={{
                    px: 5,
                    py: 2,
                    display: 'flex',
                    borderRadius: 1,
                    flexDirection: ['column', 'row'],
                    justifyContent: ['space-between'],
                    alignItems: ['flex-start', 'center'],
                    height: '7rem',
                    width: '100%',
                    mb: index !== data.length - 1 ? 4 : undefined,
                    border: theme => (item?.default ? '1px solid #004AEA' : `1px solid ${theme.palette.divider}`),
                    backgroundColor: item?.default ? '#ebf0fb' : ''
                  }}
                >
                  <div className='w-full'>
                    <div className='flex items-center justify-between'>
                      <img height='20' width='50' alt={item?.icon} src={item?.paymentMethod?.icon} />
                      {item?.default ? <Radio color='secondary' checked={true} /> : null}
                    </div>

                    <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                      <Typography color={'secondary'} fontSize={18} sx={{ fontWeight: 700, ml: 2 }}>
                        {item?.paymentMethod?.name}
                      </Typography>
                      {item?.cardStatus ? (
                        <CustomChip
                          skin='light'
                          size='small'
                          label={item?.cardStatus}
                          color={item?.badgeColor}
                          sx={{ height: 20, ml: 2, fontSize: '0.75rem', fontWeight: 600, borderRadius: '10px', px: 2 }}
                        />
                      ) : null}
                    </Box>
                    {item?.data && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body2' mt={1}>
                          **** **** **** &nbsp;
                        </Typography>
                        <Typography variant='body2'>
                          {item?.data?.number_card?.substring(item?.data?.number_card?.length - 4)}
                        </Typography>
                      </Box>
                    )}
                  </div>
                  {listAllPaymentMethodesByCompany?.data?.length > 1 && (
                    <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                      <Tooltip title='Supprimer'>
                        <IconButton sx={{ p: 1 }}>
                          <IconifyIcon icon='mdi:trash-can-outline' color='red' />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Modifier'>
                        <IconButton sx={{ p: 1 }}>
                          <IconifyIcon icon='mdi:pencil-outline' color='#86A039' />
                        </IconButton>
                      </Tooltip>
                      {item?.data && (
                        <Typography variant='body2' sx={{ mt: 5 }}>
                          La carte expire à {item?.data?.expiration_month}/{item?.data?.expiration_year}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <CustomModal
        open={openModal}
        handleCloseOpen={() => setOpenModal(false)}
        handleActionModal={() => setOpenModal(false)}
        btnTitle={'Fermer'}
        ModalTitle={'Méthode de paiement'}
        widthModal={'md'}
        btnTitleClose={false}
        action={() => setOpenModal(false)}
      >
        <div>
          <div className='text-center'>
            <Typography variant='h5'>Choisissez parmi ces méthodes de paiement.</Typography>
          </div>

          <Grid container spacing={8} px={8} mt={2}>
            {/* {listPaymentMethods?.data?.map((payMethode, key) => (
              <Grid item xs={12} md={4} key={key}>
                <Card>
                  <CardContent
                    sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <img height='20' width='60' src={payMethode?.icon} />

                    <Typography mt={2}>{payMethode?.name}</Typography>
                    <Radio
                      checked={radioCheked && key == radioIndex ? true : false}
                      onChange={e => handleChangePaymentsMethode(e.target.checked, key, payMethode)}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))} */}

            <CustomizedAccordions data={listPaymentMethods?.data} />
          </Grid>
        </div>
      </CustomModal>
    </Grid>
  )
}

export default PaymentsMethode
