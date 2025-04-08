import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import IconifyIcon from 'src/@core/components/icon'
import CustomModal from './CustomModal'
import { Box, Typography } from '@mui/material'

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

export default function CustomBtnUpload({ titleBtnUpload, formInput, setFormInput, name }) {
  const [fileSignature, setFileSignature] = useState(null)
  const [openModalOneFile, setOpenModalOneFile] = React.useState(false)
  const [openModalWithDrawer, setOpenModalWithDrawer] = React.useState(false)

  const showOnlyDocument = () => {
    setOpenModalOneFile(true)
  }

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      setFormInput({ ...formInput, [name]: [file] })
    }
  }
  useEffect(() => {
    formInput && setFileSignature(formInput?.documents?.find(item => item.name == 'Signature_doc'))
  }, [formInput])

  // Check if formInput and formInput.signature exist before accessing properties
  const signatureName = formInput && formInput.signature && formInput.signature[0] ? formInput.signature[0]?.name : ''

  return (
    <div className='flex items-center'>
      <Box>
        {/* {fileSignature && (
          <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => showOnlyDocument()}>
            <Typography color={'secondary'} sx={{ textDecoration: 'underline' }}>
              {fileSignature?.name}
            </Typography>
            <IconifyIcon fontSize='18px' icon='ic:round-open-in-new' color='#585ddb' />
          </Box>
        )} */}
        <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
          {fileSignature && (
            <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => showOnlyDocument()}>
              {/* <Typography color={'secondary'} sx={{ textDecoration: 'underline' }}>
                {fileSignature?.name}
              </Typography> */}
              <Button
                sx={{ mr: 2 }}
                component='label'
                size='small'
                variant='outlined'
                className='h-[29px] mr-4'
                startIcon={<IconifyIcon fontSize='18px' icon='ic:round-open-in-new' />}
              >
                Voir Signature
              </Button>
            </Box>
          )}

          <Button
            component='label'
            size='small'
            variant='contained'
            className='h-[29px]'
            startIcon={<IconifyIcon icon='ic:sharp-cloud-upload' color='white' />}
          >
            {fileSignature && 'Modifier'} {titleBtnUpload}
            <VisuallyHiddenInput type='file' accept='image/*' onChange={handleFileChange} />
          </Button>
          <p className='ml-2'> {signatureName || 'Sélectionnez un fichier'} </p>
        </Box>
      </Box>

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
        {fileSignature?.versions?.map(
          (docVersion, index) =>
            fileSignature?.versions?.length - 1 == index && (
              <img src={docVersion?.download_path} style={{ height: '100%', height: '100%' }} />
            )
        )}
      </CustomModal>
    </div>
  )
}
