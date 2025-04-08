import { Divider, Typography } from '@mui/material'

const Title = ({ blocIndex, ligne, ligneIndex }) => {
  return (
    <div>
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: 15,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
        color='primary'
      >
        {`${ligne?.title}`}
      </Typography>

      <Divider />
    </div>
  )
}

export default Title
