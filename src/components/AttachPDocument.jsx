import { Box, FormHelperText, IconButton, Stack, Typography, Card, CardContent, CardHeader } from '@mui/material'
import { styled } from '@mui/material/styles'
import { forwardRef, useCallback, useRef, useState } from 'react'
import { useController, useForm, useFormContext } from 'react-hook-form'

// import { toast } from 'react-toastify'

import IconifyIcon from 'src/@core/components/icon'
import DocumentSvg from 'src/@core/svg/DocumentSvg'

import FileSvg from 'src/@core/svg/FileSvg'
import PdfSvg from 'src/@core/svg/PdfSvg'
import renderArrayMultiline from 'src/@core/utils/utilities'

// 👇 FileUpload Component
const AttachPDocument = (
  {
    singleFile,
    setSingleFile,
    document,
    handleFilesChange,
    onFileDelete,
    fileTypes = [],
    formErrors,
    setformErrorsFiles
  },
  fileRef
) => {
  // 👇 Form Context

  const {
    control,
    formState: { isSubmitting, errors }
  } = useFormContext()

  // 👇 State with useState()

  const { field } = useController({ name: document?.entitled, control })
  const [fileList, setFileList] = useState([])

  const isInputDisabled = !!(Array.isArray(singleFile) && singleFile?.length)

  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png']

  // 👇 Image Upload Service
  const onFileDrop = useCallback(
    e => {
      const target = e.target
      if (!target.files) {
        return
      }

      const newFile = Object.values(target.files).map(file => file)
      const invalidFiles = newFile.filter(file => !allowedFileTypes.includes(file.type))

      if (invalidFiles.length > 0) {
        setformErrorsFiles(true)
        alert('Only PDF and image files are allowed!')
        
return
      }

      // if (singleFile.length >= 1) return toast.warning('Un seul fichier est autorisé')
      setSingleFile(newFile)
      field.onChange(newFile[0])
      handleFilesChange(target.files)
    },
    [field, fileList, handleFilesChange, singleFile.length]
  )

  // 👇 remove single image
  const fileSingleRemove = () => {
    setSingleFile([])
    setformErrorsFiles(false)
    onFileDelete()
  }

  const calcSize = size => {
    return size < 1000000 ? `${Math.floor(size / 1000)} KB` : `${Math.floor(size / 1000000)} MB`
  }

  return (
    <>
      <Card className='!h-full' isInputDisabled={isInputDisabled}>
        <CardContent
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{
            position: 'relative',
            width: '100%'
          }}
        >
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Importer un fichier
          </Typography>
          <div className='flex items-center justify-center p-1'>
            {/* <FileSvg /> */}
            <img src={'/images/icons/file-icons/filesSvg.png'} width={'110'} alt='upload-file' />

            <Typography className='font-semibold' sx={{ fontSize: '14px' }}>
              <strong>Extensions de fichiers</strong>
            </Typography>
            <Typography variant='body2' component='span'>
              {fileTypes?.map(e => '.' + e?.toUpperCase() + ' ')}
            </Typography>
          </div>

          <input
            disabled={isInputDisabled}
            ref={fileRef}
            type='file'
            name={document?.entitled}
            onChange={onFileDrop}
            accept='application/pdf,image/png,image/jpeg'
            style={{
              opacity: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: isInputDisabled ? 'not-allowed' : 'pointer'
            }}
          />
        </CardContent>
      </Card>

      <FormHelperText sx={{ textAlign: 'center', my: 1 }} error={!!errors[name]}>
        {errors[name] ? errors[name]?.message : ''}
      </FormHelperText>

      {/* 👇Image Preview 👇 */}
      {fileList.length > 0 || singleFile.length > 0 ? (
        <Stack spacing={2} sx={{ my: 2 }}>
          {singleFile.map((item, index) => {
            const fileType = item.type

            return (
              <Card
                key={index}
                sx={{
                  position: 'relative',
                  borderRadius: '8px',
                  px: 2,
                  py: 1
                }}
                className='flex items-center justify-between'
              >
                <Box display='flex'>
                  {fileType === 'application/pdf' ? (
                    <PdfSvg />
                  ) : fileType.startsWith('image/') ? (
                    <img width={100} height={100} alt={item.name} src={URL.createObjectURL(item)} />
                  ) : (
                    <DocumentSvg />
                  )}

                  <div className='flex items-center ml-1 ' sx={{ ml: 1 }}>
                    <Typography className='' sx={{ fontSize: '12px', fontWeight: '600' }}>
                      {item.name}
                    </Typography>
                    <Typography className='!ml-2' variant='body2'>
                      {calcSize(item.size)}
                    </Typography>
                  </div>
                </Box>
                <IconButton onClick={fileSingleRemove}>
                  <IconifyIcon fontSize='20px' icon='mdi:delete' color='red' />
                </IconButton>
              </Card>
            )
          })}
          <FormHelperText sx={{ my: 1, color: 'red' }} error={!!errors[name]}>
            {renderArrayMultiline(formErrors?.file)}
          </FormHelperText>
        </Stack>
      ) : null}
    </>
  )
}

export default forwardRef(AttachPDocument)
