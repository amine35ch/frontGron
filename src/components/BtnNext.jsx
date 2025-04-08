import React from 'react'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'

const BtnNext = ({ isLoading, handleNext, processEnded, titleBtn, disabled }) => {
  return (
    <LoadingButton
      variant='contained'
      color='primary'
      loading={isLoading}
      disabled={!disabled}
      loadingPosition='start'
      size='small'
      sx={{ fontSize: '12px', cursor: 'pointer', maxHeight: '30px' }}
      onClick={() => handleNext()}
      endIcon={<IconifyIcon icon='material-symbols:double-arrow' />}
    >
      {titleBtn ? titleBtn : 'Suivant'}
    </LoadingButton>
  )
}

export default BtnNext
