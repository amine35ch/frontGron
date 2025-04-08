import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 10,
  width: '13.5vw',
  maxHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  columnGap: '8px',
  [theme.breakpoints.down('md')]: {
    minWidth: '10vw',
    maxWidth: '20vw',
    maxHeight: '160px'
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '10vw',
    maxWidth: '20vw',
    maxHeight: '120px'
  },
  [theme.breakpoints.down('xs')]: {
    minWidth: '10vw',
    maxWidth: '20vw',
    maxHeight: 'auto'
  }
}))

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
})

const StyledIcon = styled('div')({
  fontSize: 48
})

const StyledHeader = styled(CardHeader)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
})

const StyledTotalNumber = styled(Typography)({
  alignSelf: 'flex-end',
  fontSize: 12,
  '& span': {
    color: '#ff9800'
  }
})

const DashCard = ({ icon, number, label, total }) => {
  return (
    <StyledCard className='w-full'>
      <StyledHeader avatar={<StyledIcon>{icon}</StyledIcon>} />
      <StyledCardContent>
        <Typography color={'#4f5d70'} variant='h3'>
          {number}
        </Typography>
        <Typography variant='subtitle1'>{label}</Typography>
        <StyledTotalNumber variant='caption'>
          <span>{total}</span>
        </StyledTotalNumber>
      </StyledCardContent>
    </StyledCard>
  )
}

export default DashCard
