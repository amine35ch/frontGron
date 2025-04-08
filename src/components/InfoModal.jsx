import React from 'react'
import {
  Modal,
  Box,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  Dialog,
  Divider,
  Paper,
  Card,
  CardContent,
  useTheme
} from '@mui/material'
import DOMPurify from 'dompurify'
import IconifyIcon from 'src/@core/components/icon'

const InfoModal = ({ open, handleClose, modelData }) => {
  const theme = useTheme()

  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': {
          border: 'none'
        }
      }}
      open={open}
      onClose={handleClose}
      maxWidth='xl'
    >
      <DialogTitle bgcolor={theme.palette.primary.main}>
        <Box textAlign='center'>
          <IconifyIcon icon='bi:info-circle-fill' color='white' width={50} height={50} />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box mt={5} />
        <Typography mx={10} mb={10} variant='h4' fontWeight='bold' align='center'>
          {modelData?.title}
        </Typography>
        <Card p={10} variant='outlined'>
          <CardContent>
            {<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(modelData?.description) }} />}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default InfoModal
