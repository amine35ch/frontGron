// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { LoadingButton } from '@mui/lab'

// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { useStorePaymentMethod } from 'src/services/subscription.service'
import { Button } from '@mui/material'

const CreditCardWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('xl')]: {
    '& > div:first-of-type': {
      marginBottom: theme.spacing(6)
    }
  },
  [theme.breakpoints.up('xl')]: {
    alignItems: 'center',
    flexDirection: 'row',
    '& > div:first-of-type': {
      marginRight: theme.spacing(6)
    }
  }
}))

const StripePayment = ({ payment_method }) => {
  // ** States
  const [name, setName] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [focus, setFocus] = useState()
  const [expiry, setExpiry] = useState('')
  const [defaultCard, setDefaultCard] = useState(1)
  const [formErrors, setFormErrors] = useState({})
  const handleBlur = () => setFocus(undefined)
  const storePaymentMethodeMutation = useStorePaymentMethod()

  const handleInputChange = ({ target }) => {
    if (target.name === 'cardNumber') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }

  const storeMethodePayment = async () => {
    const data = {
      payment_method: payment_method,
      default: defaultCard,

      data: [
        {
          name_card: name,
          number_card: cardNumber,
          expiration_year: expiry.slice(3),
          expiration_month: expiry.slice(0, 2),
          default: 1
        }
      ]
    }

    try {
      await storePaymentMethodeMutation.mutateAsync(data)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)

      return false
    }
  }

  return (
    <>
      <Grid container spacing={6} p={4}>
        <Grid item xs={6}>
          <CreditCardWrapper>
            <CardWrapper>
              <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
            </CardWrapper>
          </CreditCardWrapper>
        </Grid>
        <Grid xs={6} item container spacing={4}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                name='cardNumber'
                value={cardNumber}
                autoComplete='off'
                label='Numéro de carte'
                size='small'
                onBlur={handleBlur}
                onChange={handleInputChange}
                placeholder='0000 0000 0000 0000'
                onFocus={e => setFocus(e.target.name)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              name='name'
              value={name}
              autoComplete='off'
              onBlur={handleBlur}
              label='Nom sur la carte'
              size='small'
              onChange={e => setName(e.target.value)}
              onFocus={e => setFocus(e.target.name)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name='expiry'
              label="Date d'expiration"
              value={expiry}
              size='small'
              onBlur={handleBlur}
              placeholder='MM/YY'
              onChange={handleInputChange}
              inputProps={{ maxLength: '5' }}
              onFocus={e => setFocus(e.target.name)}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              fullWidth
              name='cvc'
              label='CVC'
              value={cvc}
              autoComplete='off'
              onBlur={handleBlur}
              onChange={handleInputChange}
              size='small'
              onFocus={e => setFocus(e.target.name)}
              placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              onChange={e => setDefaultCard(e.target.checked == true ? 1 : 0)}
              control={<Switch defaultChecked checked={defaultCard === 1 ? true : false} />}
              label='Utilisée comme carte par défaut'
              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} display={'flex'} justifyContent={'end'}>
          <LoadingButton
            variant='contained'
            loading={storePaymentMethodeMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => storeMethodePayment()}
          >
            Confirmer
          </LoadingButton>
          {/* <Button type='reset' variant='outlined' color='secondary' onClick={handleResetForm}>
            Reset
          </Button> */}
        </Grid>
      </Grid>
    </>
  )
}

export default StripePayment
