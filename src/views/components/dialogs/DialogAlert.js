// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

const DialogAlert = ({
  color = 'error',
  open,
  setOpen,
  handleAction,
  title,
  description,
  acceptButtonTitle,
  declineButtonTitle
}) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'xs'}
        fullWidth={true}
        className='!px-10'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle className='!text-base' id='alert-dialog-title '>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='error' onClick={() => handleAction(false)}>
            {declineButtonTitle}
          </Button>
          <Button color='success' onClick={() => handleAction(true)}>
            {acceptButtonTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogAlert
