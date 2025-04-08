import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DisplayFileDialog from './DisplayFileDialog'

import AttachPDocumentDialog from './AttachPDocumentDialog'

import { Box, Grid, IconButton, Typography } from '@mui/material'

const AttachDocumentsFromList = ({
  documentsList,
  formErrorsFiles,
  documents,
  handleSetDocument,
  setFormErrorsFiles
}) => {
  // ** theme
  const [singleFile, setSingleFile] = useState([])

  //** STATES
  const [open, setOpen] = useState(false)
  const [attachFileDialog, setAttachFileDialog] = useState(false)
  const [documentToAttach, setDocumentToAttach] = useState(null)
  const [fileToDisplay, setFileToDisplay] = useState(null)

  const handleAttacheDocument = async file => {
    const localeFile = {
      name: documentToAttach?.entitled,
      type: documentToAttach?.type,
      file: file
    }

    if (file) handleSetDocument(localeFile)
    handleCloseAttachFileDialog()
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleDisplayFile = async file => {
    setOpen(true)
    setFileToDisplay(file)
  }

  const handleCloseAttachFileDialog = () => {
    setAttachFileDialog(false)
    setSingleFile([])
  }

  const handleAttachFileDialog = document => {
    setAttachFileDialog(true)
    setDocumentToAttach(document)
  }

  return (
    <>
      {documentsList?.map((stepDoc, index) => (
        <Grid
          key={index}
          container
          item
          sx={{
            padding: '3px'
          }}
          justifyItems={'center'}
        >
          <Grid item className='flex items-center text-center' xs={5} md={5}>
            <Typography className='!font-semibold  !mt-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              {stepDoc?.entitled}
            </Typography>
            <Typography className='!font-medium  !mt-2 !ml-1' sx={{ fontSize: '13px', color: 'secondary.main' }}>
              {stepDoc?.required == 1 ? '(Obligatoire)' : '(Facultatif)'}
            </Typography>
          </Grid>

          <Grid item xs={5} md={5} className='flex items-center justify-evenly'>
            <Box width={50}>
              {documents?.find(doc => doc?.type === stepDoc?.type)?.type ? (
                <IconButton
                  onClick={() => handleDisplayFile(documents?.find(doc => doc?.type === stepDoc?.type))}
                  color='secondary'
                  title='Voir Document'
                >
                  <IconifyIcon icon='carbon:data-view-alt' />
                </IconButton>
              ) : null}
            </Box>

            <Box width={50}>
              <IconButton onClick={() => handleAttachFileDialog(stepDoc)} color='secondary' title='Attacher Document'>
                <IconifyIcon icon='ion:document-attach-outline' />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}
      {open ? (
        <DisplayFileDialog
          src={URL?.createObjectURL(fileToDisplay?.file)}
          open={open}
          handleCloseOpen={handleCloseDialog}
          file={fileToDisplay}
        />
      ) : null}
      {attachFileDialog ? (
        <AttachPDocumentDialog
          actionIsLoading={false}
          handleActionClick={handleAttacheDocument}
          handleCloseOpen={handleCloseAttachFileDialog}
          open={attachFileDialog}
          loading={false}
          document={documentToAttach}
          formErrors={formErrorsFiles}
          singleFile={singleFile}
          setSingleFile={setSingleFile}
          setformErrorsFiles={setFormErrorsFiles}
        />
      ) : null}
    </>
  )
}

export default AttachDocumentsFromList
