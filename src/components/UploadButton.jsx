import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import IconifyIcon from 'src/@core/components/icon'
import CustomModal from './CustomModal'
import { Box, FormHelperText, Typography } from '@mui/material'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default function UploadButton({ titleBtnUpload, formInput, setFormInput, name, error, helperText }) {
  const [fileSignature, setFileSignature] = useState(null)
  const [openModalOneFile, setOpenModalOneFile] = React.useState(false)

  const showOnlyDocument = () => {
    setOpenModalOneFile(true)
  }

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      setFormInput({ ...formInput, [name]: file })
    }
  }

  return (
    <>
      <Box display='flex' gap={2}>
        {formInput[name]?.name && (
          <Button
            onClick={() => showOnlyDocument()}
            sx={{ mr: 2 }}
            component='label'
            size='small'
            variant='outlined'
            className='h-[29px] mr-4'
            startIcon={<IconifyIcon fontSize='18px' icon='ic:round-open-in-new' />}
          >
            Voir
          </Button>
        )}

        <Button
          component='label'
          size='small'
          variant='contained'

          // startIcon={}
        >
          <Box display='flex' alignItems='center' gap={2}>
            <IconifyIcon icon='ic:sharp-cloud-upload' color='white' />
            {titleBtnUpload}
          </Box>
          <VisuallyHiddenInput type='file' accept={['.png', '.pdf', '.jpeg', '.xlsx']} onChange={handleFileChange} />
        </Button>
        <Typography> {formInput[name]?.name ? formInput[name]?.name : 'Sélectionnez un fichier'} </Typography>
      </Box>
      {error && <FormHelperText error>{helperText}</FormHelperText>}
      <Box></Box>

      <CustomModal
        open={openModalOneFile}
        handleCloseOpen={() => setOpenModalOneFile(false)}
        handleActionModal={() => setOpenModalOneFile(false)}
        btnTitle={'Fermer'}
        ModalTitle={'Visualiser'}
        widthModal={'lg'}
        btnTitleClose={false}
        action={() => setOpenModalOneFile(false)}
      >
        {formInput[name]?.type === 'application/pdf' && (
          <iframe height='700px' src={URL.createObjectURL(formInput[name])} width='100%' allowFullScreen></iframe>
        )}

        {formInput[name]?.type === 'image/jpeg' && (
          <img src={URL.createObjectURL(formInput[name])} alt='image' className='w-full h-full' />
        )}
      </CustomModal>
    </>
  )
}
