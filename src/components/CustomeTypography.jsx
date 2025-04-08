import { Typography } from '@mui/material'

const CustomeTypography = props => {
  const { children, ...rest } = props

  return (
    <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }} {...rest}>
      {children}
    </Typography>
  )
}

export default CustomeTypography
