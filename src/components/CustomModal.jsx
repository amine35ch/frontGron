import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import IconifyIcon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'
import CircularProgress from '@mui/material/CircularProgress'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: 'white !important',
    zIndex: '1 !important'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(3)
  }
}))

export default function CustomModal({
  open,
  handleCloseOpen,
  children,
  btnTitle,
  ModalTitle,
  isLoading,
  action,
  bottomAction = true,
  edit,
  widthModal,
  btnTitleClose,
  btnCanceledTitle
}) {
  const handleAction = async () => {
    if (await action()) {
      handleCloseOpen()
    }
  }

  return (
    <React.Fragment>
      <BootstrapDialog
        fullWidth={true}
        maxWidth={widthModal ? widthModal : 'xl'}
        aria-labelledby='customized-dialog-title'
        open={open}
        disableBackdropClick // Disable click outside to close the dialog
      >
        <DialogTitle
          className='!text-[17px]'
          sx={{ m: 0, py: 3, px: 4, fontSize: '17px !important' }}
          id='customized-dialog-title'
        >
          {ModalTitle}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleCloseOpen}
          sx={{
            position: 'absolute',
            right: 8,
            top: 7,
            color: theme => theme.palette.grey[500]
          }}
        >
          <IconifyIcon icon='mdi:close' />
        </IconButton>
        <DialogContent dividers>{children}</DialogContent>
        {bottomAction ? (
          <DialogActions className='!py-2'>
            {btnTitleClose ? (
              <LoadingButton
                type='submit'
                color='error'
                loadingPosition='start'
                sx={{
                  fontSize: '12px !important '
                }}
                variant='outlined'
                size='small'
                onClick={handleCloseOpen}
                startIcon={isLoading && <CircularProgress size={14} color='inherit' />}
              >
                {btnCanceledTitle ? btnCanceledTitle : 'Annuler'}
              </LoadingButton>
            ) : null}
            {btnTitle ? (
              <LoadingButton
                type='submit'
                loadingPosition='start'
                sx={{
                  fontSize: '12px !important '
                }}
                size='small'
                loading={isLoading}
                variant='contained'
                onClick={() => handleAction()}
                startIcon={isLoading && <CircularProgress size={14} color='inherit' />}
              >
                {edit ? 'Modifier' : btnTitle}
              </LoadingButton>
            ) : null}
          </DialogActions>
        ) : null}
      </BootstrapDialog>
    </React.Fragment>
  )
}
