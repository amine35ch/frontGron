import { Divider, Typography } from '@mui/material'

const SubTitle = ({ blocIndex, ligne, ligneIndex }) => {
  return (
    <div>
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: 15,
          marginLeft: 3,
          marginTop:4,
          marginBottom:2
        }}
        color='secondary'
      >
        {`${ligne?.title}`}
      </Typography>


    </div>
  )
}

export default SubTitle
