import { Button } from '@mui/material'
import React from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'

const BtnStepper = ({
  activeStep,
  handleNext,
  handleBack,
  steps,
  marginBottom,
  btn_title,
  cancelContract,
  setConfirmOpen,
  isLoading
}) => {
  return (
    <div
      className={`flex mt-8 ${marginBottom ? 'mb-8' : '0'}  ${activeStep !== 0 ? 'justify-between' : 'justify-end'} `}
    >
      {activeStep !== 0 ? (
        <Button
          className='mr-4 text-defaultColorText cursor-pointer !text-neutral-500 !font-semibold !text-base '
          onClick={() => handleBack()}
        >
          <IconifyIcon icon='ic:baseline-keyboard-double-arrow-left' className='!text-neutral-500' />
          Retour
        </Button>
      ) : (
        ''
      )}
      <div>
        {activeStep == steps?.length ? (
          <Button
            sx={{ backgroundColor: 'red.primary' }}
            className=' !text-white rounded-lg   hover:bg-red-500  cursor-pointer !ml-4 '
            onClick={() => cancelContract()}
            startIcon={<IconifyIcon icon='mdi:alert-circle-outline' />}
          >
            Annuler Contrat
          </Button>
        ) : (
          <LoadingButton
            type='submit'
            loadingPosition='start'
            sx={{
              backgroundColor: 'red.primary',
              '&:hover': {
                backgroundColor: '#BBBCC4 !important' // Change this to the desired hover color
              }
            }}
            loading={isLoading}
            className=' !text-white rounded-lg w-40 cursor-pointer !ml-4 '
            variant='contained'
            endIcon={<IconifyIcon icon='material-symbols:double-arrow' />}
            onClick={() => handleNext()}
          >
            {btn_title}
          </LoadingButton>
        )}

        {activeStep == steps?.length ? (
          <Button
            sx={{ backgroundColor: 'white', border: '1px solid' }}
            className=' !text-red-500 rounded-lg !border !border-red-500   hover:bg-red-500  cursor-pointer !ml-4 '
            onClick={() => setConfirmOpen(true)}
            startIcon={<IconifyIcon icon='mdi:check' />}
          >
            Valider Contrat
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default BtnStepper

