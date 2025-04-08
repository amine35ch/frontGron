import { Card, CardContent } from '@mui/material'

const CardBgBorderGreen = props => {
  const { children, bgColor, borderColor } = props

  return (
    <Card
      className='w-full'
      sx={{
        bgcolor: bgColor

        // border: `1px solid ${borderColor}`
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default CardBgBorderGreen
