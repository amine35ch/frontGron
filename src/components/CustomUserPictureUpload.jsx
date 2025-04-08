// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import IconifyIcon from 'src/@core/components/icon'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const CustomUserPictureUpload = ({ fileTypes, limit, formInput, setFormInput, name, update }) => {
  // ** State
  const theme = useTheme()

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: limit,
    maxSize: 2000000,
    accept: {
      'image/*': fileTypes
    },
    onDrop: acceptedFiles => {
      setFormInput(f => {
        return { ...f, [name]: [...acceptedFiles] }
      })
    },
    onDropRejected: () => {
      toast.error(`You can only upload ${limit} files & maximum size of 2 MB.`, {
        duration: 2000
      })
    }
  })

  return (
    <>
      <div
        className='flex justify-center items-center md:h-[8rem] md:w-[8rem]'
        style={{ border: '2px dashed #86A039', borderRadius: '50%' }}
      >
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {update ? (
              formInput?.logo?.length > 0 ? (
                formInput?.logo?.map((file, key) => (
                  <img
                    className='h-[125px] w-[125px]'
                    style={{ borderRadius: '50%' }}
                    key={key}
                    alt={file?.name}
                    src={URL.createObjectURL(file)}
                  />
                ))
              ) : formInput?.download_logo == null ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: ['center', 'center', 'inherit']
                  }}
                >
                  <IconifyIcon icon='ic:sharp-cloud-upload' color='#FCE8CD' fontSize='50px' />
                  <HeadingTypography sx={{ fontSize: '12px', mb: 0, fontWeight: '600' }}>
                    Déposez votre logo
                  </HeadingTypography>
                  <HeadingTypography sx={{ fontSize: '12px', mb: 0, fontWeight: '600', textAlign: 'center' }}>
                    ici .
                  </HeadingTypography>
                </Box>
              ) : (
                <img
                  className='h-[125px] w-[125px]'
                  style={{ borderRadius: '50%' }}
                  alt={'logo'}
                  src={formInput?.download_logo}
                />
              )
            ) : formInput?.logo.length > 0 ? (
              formInput?.logo?.map((file, key) => (
                <img
                  className='h-[125px] w-[125px]'
                  style={{ borderRadius: '50%' }}
                  key={key}
                  alt={file?.name}
                  src={URL.createObjectURL(file)}
                />
              ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: ['center', 'center', 'inherit']
                }}
              >
                <IconifyIcon icon='ic:sharp-cloud-upload' color='#FCE8CD' fontSize='50px' />
                <HeadingTypography sx={{ fontSize: '12px', mb: 0, fontWeight: '600' }}>
                  Déposez votre logo
                </HeadingTypography>
                <HeadingTypography sx={{ fontSize: '12px', mb: 0, fontWeight: '600', textAlign: 'center' }}>
                  ici .
                </HeadingTypography>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </>
  )
}

export default CustomUserPictureUpload
