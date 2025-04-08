import { CardElement, PaymentElement, CardNumberElement } from '@stripe/react-stripe-js'

const CheckoutForm = () => {
  const cardElementOptions = {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a'
      }
    }
  }

  return (
    <form>
      {/* <PaymentElement /> */}
      {/* <CardElement options={cardElementOptions} /> */}
      <div>
        <CardNumberElement />
      </div>
    </form>
  )
}

export default CheckoutForm
