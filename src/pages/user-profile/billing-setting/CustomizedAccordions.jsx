import * as React from 'react'
import { styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { Grid, Radio, Box } from '@mui/material'
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'
import StripePayment from './StripePayment'

const Accordion = styled(props => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}))

const AccordionSummary = styled(props => <MuiAccordionSummary {...props} />)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  },
  paddingLeft: 1
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))

export default function CustomizedAccordions({ data, children }) {
  const [expanded, setExpanded] = React.useState('panel1')
  const [paymentMethode, setPaymentMethode] = React.useState(null)

  const handleChange = (panel, payMethode) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
    setPaymentMethode(payMethode?.type)
  }

  return (
    <div>
      {data?.map((payMethode, key) => (
        <Accordion
          key={key}
          expanded={expanded === payMethode?.name}
          onChange={handleChange(payMethode?.name, payMethode)}
        >
          <AccordionSummary
            aria-controls='panel3d-content'
            expanded={expanded === payMethode?.name}
            id='panel3d-header'
          >
            <div className='flex justify-between items-center w-full'>
              <div className='flex items-center'>
                <Radio size='small' checked={expanded === payMethode?.name} />
                <div className='bg bg-white px-2 p-1 border border-gray-200 rounded-md '>
                  <img height='20' width='35' src={payMethode?.icon} />
                </div>
                <Typography ml={2} fontWeight={700}>
                  {payMethode?.name}
                </Typography>
              </div>
              {payMethode?.name === 'Stripe' && (
                <div className='bg bg-white px-2 p-1 border border-gray-200 rounded-md '>
                  <img height='20' width='25' alt='master-card' src={'/images/logos/mastercard.png'} />
                </div>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {payMethode?.name === 'Stripe' ? (
              <Grid item xs={12}>
                <StripePayment payment_method={paymentMethode} />
              </Grid>
            ) : (
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
