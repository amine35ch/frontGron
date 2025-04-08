import React from 'react'
import { LoadingButton } from '@mui/lab'

const BtnColorSecondary = ({ action, title, isLoading, disabled }) => {
  return (
    <LoadingButton
      variant='contained'
      loading={isLoading}
      disabled={disabled}
      color='secondary'
      loadingPosition='start'
      className=' h-[24px] w-[105px] !text-white'
      sx={{ fontSize: '12px' }}
      onClick={() => action()}
    >
      {title}
    </LoadingButton>
  )
}

export default BtnColorSecondary
