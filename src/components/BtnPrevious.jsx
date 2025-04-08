import React from 'react'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'

const BtnPrevious = ({
  disabled,
  currentStep = null,
  isLoading,
  handleBack,
  activeStep,
  processEnded,
  onSubmitPrevStep
}) => {
  return (
    <LoadingButton
      variant='outlined'
      color='error'
      loading={isLoading}
      disabled={!disabled}
      loadingPosition='start'
      className='h-[29px] !cursor-pointer'
      sx={{ fontSize: '12px' }}
      onClick={onSubmitPrevStep}
      startIcon={<IconifyIcon icon='ic:baseline-keyboard-double-arrow-left' />}
    >
      {currentStep?.decision ? <>{currentStep?.cancel_entitled_btn}</> : 'Retour'}
    </LoadingButton>
  )
}

export default BtnPrevious
