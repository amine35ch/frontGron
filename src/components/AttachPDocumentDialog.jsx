import { FormProvider, useForm } from 'react-hook-form'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Switch,
  Typography
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'
import AttachPDocument from './AttachPDocument'

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

const AttachPDocumentDialog = ({
  actionIsLoading,
  handleActionClick,
  open,
  handleCloseOpen,
  name,
  document,
  formErrors,
  singleFile,
  setSingleFile,
  setformErrorsFiles,
  checked,
  showExternal = false,
  onExternalChange
}) => {
  const methods = useForm({})

  const handleAddButtonClick = async () => {
    try {
      await handleActionClick(singleFile[0])

      // setSingleFile([])

      // handleCloseOpen()
    } catch (error) {}
  }

  const handleFilesChange = files => {
    // setSingleFile(files[0])
  }

  const handleDeleteFile = files => {
    // setFile(null)
  }
  const label = { inputProps: { 'aria-label': 'Color switch demo' } }

  return (
    <React.Fragment>
      <BootstrapDialog
        fullWidth={true}
        onClose={handleCloseOpen}
        aria-labelledby='customized-dialog-title'
        open={open}

        // sx={{ backgroundColor: 'white !important' }}
      >
        <DialogTitle>
          <div className='flex justify-between max-h-5'>
            {document?.entitled}
            <DialogActions>
              <IconButton
                onClick={handleCloseOpen}
                sx={{
                  color: theme => theme.palette.grey[500]
                }}
              >
                <IconifyIcon icon='mdi:close' />
              </IconButton>
            </DialogActions>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <FormProvider {...methods}>
            <Box component='form' noValidate autoComplete='off'>
              <AttachPDocument
                onFileDelete={handleDeleteFile}
                handleFilesChange={handleFilesChange}
                document={document}
                singleFile={singleFile}
                setSingleFile={setSingleFile}
                formErrors={formErrors}
                setformErrorsFiles={setformErrorsFiles}
              />
            </Box>
          </FormProvider>
          {showExternal && (
            <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Hors Gron <Switch {...label} color='warning' onChange={e => onExternalChange?.(e)} checked={checked} />{' '}
                Devis Gron
              </Typography>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <div className='flex justify-end p-2'>
            <LoadingButton loading={actionIsLoading} variant='outlined' onClick={handleAddButtonClick}>
              Ajouter
            </LoadingButton>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  )
}

export default AttachPDocumentDialog
