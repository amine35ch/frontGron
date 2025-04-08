// import DeleteIcon from '@mui/icons-material/Delete'
import { Box, FormHelperText, IconButton, Stack, Typography, Card, CardContent, CardHeader } from '@mui/material'
import { styled } from '@mui/material/styles'
import { forwardRef, useCallback, useRef, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'

// import { toast } from 'react-toastify'

import IconifyIcon from 'src/@core/components/icon'
import DocumentSvg from 'src/@core/svg/DocumentSvg'

import FileSvg from 'src/@core/svg/FileSvg'
import PdfSvg from 'src/@core/svg/PdfSvg'

// 👇 FileUpload Component
const CustomFileUpload = (
  {
    limit,
    multiple,
    name,
    handleFilesChange,
    onFileDelete,
    fileTypes = [],
    type,
    heightProps,
    handleFilesChangeMultiple
  },
  fileRef
) => {
  // 👇 Form Context
  const {
    control,
    formState: { isSubmitting, errors }
  } = useFormContext()

  // 👇 State with useState()
  const { field } = useController({ name, control })
  const [singleFile, setSingleFile] = useState([])
  const [fileList, setFileList] = useState([])

  const wrapperRef = useRef(null)

  const isInputDisabled = !!(Array.isArray(singleFile) && singleFile?.length)

  // 👇 Toggle the dragover class

  // 👇 Image Upload Service
  const onFileDrop = useCallback(
    e => {
      const target = e.target
      if (!target.files) {
        return
      }

      if (limit === 1) {
        const newFile = Object.values(target.files).map(file => file)

        // if (singleFile.length >= 1) return toast.warning('Un seul fichier est autorisé')
        setSingleFile(newFile)
        field.onChange(newFile[0])
        handleFilesChange(target.files)
      }

      if (multiple) {
        const newFiles = Object.values(target.files).map(file => file)
        if (newFiles) {
          const updatedList = [...fileList, ...newFiles]

          // if (updatedList.length > limit || newFiles.length > 3) {
          //   return alert(`Image must not be more than ${limit}`)
          // }
          handleFilesChangeMultiple(target.files)
          setFileList(updatedList)
          field.onChange(updatedList)
        }
      }
    },
    [field, fileList, handleFilesChange, limit, multiple, singleFile.length]
  )

  // 👇 remove multiple images
  const fileRemove = file => {
    const updatedList = [...fileList]
    updatedList.splice(fileList.indexOf(file), 1)
    setFileList(updatedList)
    onFileDelete()
    handleFilesChange([])
  }

  // 👇 remove single image
  const fileSingleRemove = () => {
    setSingleFile([])
    onFileDelete()
    handleFilesChange([])
  }

  // 👇 TypeScript Type
  // type CustomType = 'jpg' | 'png' | 'svg';

  // 👇 Calculate Size in KiloByte and MegaByte
  const calcSize = size => {
    return size < 1000000 ? `${Math.floor(size / 1000)} KB` : `${Math.floor(size / 1000000)} MB`
  }

  return (
    <>
      <Card className='!h-full' isInputDisabled={isInputDisabled}>
        {/* <CardHeader
          title={limit > 1 ? 'Importer des fichiers' : 'Importer un fichier'}
          titleTypographyProps={{ fontSize: '10px !important', color: 'red' }}
        /> */}

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
            {limit > 1 ? 'Importer des fichiers' : 'Importer un fichier'}
          </Typography>
          <div className='flex items-center justify-center p-1'>
            <FileSvg />
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
            name={name}
            onChange={onFileDrop}
            multiple={multiple}
            accept={fileTypes?.map(e => '.' + e)}
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
          {(multiple ? fileList : singleFile).map((item, index) => {
            const imageType = item.name.split('.')[1]

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
                  {/* <img
                    src={`/images/filesType/${type ? type : imageType}.png`}
                    alt='upload'
                    style={{
                      height: '2rem',
                      objectFit: 'contain'
                    }}
                  /> */}
                  {imageType == 'pdf' ? (
                    <PdfSvg />
                  ) : imageType == 'PNG' ? (
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
                <IconifyIcon
                  onClick={() => {
                    if (multiple) {
                      fileRemove(item)
                    } else {
                      fileSingleRemove()
                    }
                  }}
                  className='!cursor-pointer'
                >
                  <IconifyIcon fontSize='20px' icon='mdi:delete' color='red' />
                </IconifyIcon>
              </Card>
            )
          })}
        </Stack>
      ) : null}
    </>
  )
}

export default forwardRef(CustomFileUpload)
