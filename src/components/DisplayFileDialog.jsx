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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: 'white !important'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(3)
  }
}))

export default function DisplayFileDialog({ src, open, handleCloseOpen, file, ModalTitle, widthModal }) {
  return (
    <React.Fragment>
      <BootstrapDialog
        fullWidth={true}
        maxWidth={widthModal ? widthModal : 'xl'}
        onClose={handleCloseOpen}
        aria-labelledby='customized-dialog-title'
        open={open}

        // sx={{ backgroundColor: 'white !important' }}
      >
        <DialogTitle
          className='!text-[17px]'
          sx={{ m: 0, py: 3, px: 4, fontSize: '17px !important' }}
          id='customized-dialog-title'
        >
          {ModalTitle}
        </DialogTitle>
        <DialogActions>
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
        </DialogActions>
        <DialogContent dividers>
          <iframe
            style={{
              borderRadius: 10,
              borderColor: '#90caf975',
              boxShadow:
                '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
              border: '0px solid'
            }}
            title='contrat-pdf'
            src={src}
            width='100%'
            height='700px'
          ></iframe>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  )
}
