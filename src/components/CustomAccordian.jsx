import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import IconifyIcon from 'src/@core/components/icon'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { alpha, Box, FormControlLabel, Switch, Typography } from '@mui/material'
import { useEffect } from 'react'

export default function CustomAccordian(props) {
  const { children, titleAccordian, height, secondary, open = true, isSpecialCase = false, ...rest } = props
  const [first, setfirst] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    setfirst(open)
  }, [open])

  const handleChangeStateOpen = () => {
    setfirst(!first)
  }

  return (
    <Accordion sx={{ marginBottom: '10px !important' }} {...rest} expanded={first}>
      <AccordionSummary
        onClick={() => handleChangeStateOpen()}
        sx={{
          backgroundColor: isSpecialCase ? alpha('#FFAF91', 0.2) : theme.palette.primary.secondary,

          fontWeight: '700',
          paddingLeft: '15px !important',
          minHeight: '40px !important'
        }}
        expandIcon={
          secondary ? null : (
            <IconifyIcon icon='ic:sharp-expand-more' color={isSpecialCase ? '#FFAF91' : 'primary.dark'} />
          )
        }
        aria-controls='panel1-content'
        id='panel1-header'
      >
        <div className='flex items-center justify-between !w-full'>
          <Typography
            color={'primary.dark'}
            variant='body2'
            sx={{ fontSize: '17px', color: isSpecialCase ? '#FFAF91' : theme.palette.primary.dark }}
            textTransform={'uppercase'}
          >
            {titleAccordian}
          </Typography>
          {secondary ? secondary : null}
        </div>
      </AccordionSummary>
      <AccordionDetails className={` ${height ? height : ''} `}>{children}</AccordionDetails>
    </Accordion>
  )
}
