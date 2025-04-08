// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { Typography, Card, CardContent, Grid, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetDocuments, useGetProjctDocuments } from 'src/services/settings.service'
import CustomeAutoCompleteSelect from './CustomeAutoCompleteSelect'
import { set } from 'nprogress'

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

const CustomFileUploadRestrictions = ({
  fileTypes,
  limit,
  formInput,
  setFormInput,
  disabled,
  fileName,
  showInputName,
  titleFiles,
  formErrors,
  onlyOthers = false
}) => {
  // ** State
  const theme = useTheme()
  const [nameOfFile, setnameOfFile] = useState(fileName)
  const [fileType, setFileType] = useState([])

  const {
    data: projectDocumentsData,
    isSuccess: projectDocumentsIsSuccess,
    isFetching: projectDocumentsIsFetching
  } = useGetDocuments()

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: limit,
    maxSize: 209715200,

    accept: fileTypes,

    onDrop: acceptedFiles => {
      const filesWithDefaultNames = acceptedFiles.map(file => {
        return { file, nom: fileName }
      })

      setFormInput(f => {
        return { ...f, files: [...formInput?.files, ...filesWithDefaultNames] }
      })
      setFileType(prev => {
        return [...prev, ...filesWithDefaultNames.map(file => -1)]
      })

      return 0

      // handleInputChange('0', fileName)

      setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file))])
    },
    onDropRejected: err => {
      toast.error(
        `Le fichier est trop volumineux pour être importé. Veuillez choisir un fichier de taille inférieure.`,
        {
          duration: 5000
        }
      )
    }
  })
  useEffect(() => {
    if (fileName) {
      setnameOfFile(fileName)
    } else {
      setnameOfFile('')
    }
  }, [fileName])

  const handleInputChange = (index, value) => {
    setFormInput(f => {
      const updatedFiles = [...f?.files]
      updatedFiles[index].nom = value // Assuming 'nom' is the property to store the input value

      return { ...f, files: updatedFiles }
    })
    setnameOfFile(value)
  }

  const renderFilePreview = file => {
    if (file && file.type && file.type.startsWith('image')) {
      return <img className='' width={58} height={58} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = formInput?.files

    const filtered = uploadedFiles.filter(i => i.file.name !== file.file.name)

    setFormInput(f => {
      return { ...f, files: [...filtered] }
    })
  }

  const fileList = formInput?.files?.map((file, index) => (
    <div key={file.name} className='flex items-center'>
      <div
        className='flex  !w-full justify-between !my-2 px-2 !ml-1 py-2 '
        style={{ borderRadius: '10px', border: `1px dashed ${theme.palette.primary.secondary}`, width: 'auto' }}
      >
        <Grid container>
          <Grid item xs={6}>
            <ListItem className='flex !justify-between !p-0 h-full'>
              <div className='file-details  !flex'>
                <div className='ml-2 file-preview'>{renderFilePreview(file.file)}</div>
                <div className='ml-5'>
                  <Typography className='' sx={{ fontSize: '14px', fontWeight: '600' }}>
                    {file?.file?.name}
                  </Typography>
                  <Typography className='file-size' variant='body2'>
                    {Math.round(file?.file?.size / 100) / 10 > 1000
                      ? `${(Math.round(file?.file?.size / 100) / 10000).toFixed(1)} mb`
                      : `${(Math.round(file?.file?.size / 100) / 10).toFixed(1)} kb`}
                  </Typography>
                </div>
              </div>
            </ListItem>
          </Grid>
          {!showInputName ? (
            <></>
          ) : (
            <>
              <Grid item xs={3} pt={1}>
                {!onlyOthers && (
                  <CustomeAutoCompleteSelect
                    value={fileType[index]}
                    onChange={value => {
                      setFileType(prev => {
                        const types = [...prev]
                        types[index] = value

                        return [...types]
                      })
                      if (value !== -1) {
                        const nom = projectDocumentsData.find(doc => doc.type === value)?.entitled
                        setFormInput(f => {
                          const updatedFiles = [...f?.files]
                          updatedFiles[index].nom = nom

                          return { ...f, files: updatedFiles }
                        })
                      }
                    }}
                    data={[{ type: -1, entitled: 'Autre' }, ...projectDocumentsData]}
                    option={'type'}
                    formError={formErrors}
                    displayOption={'entitled'}
                  />
                )}
              </Grid>
              <Grid item xs={3}>
                {fileType[index] === -1 ? (
                  <div className='!py-0 px-2'>
                    <TextField
                      placeholder='Nom Du fichier'
                      size='small'
                      variant='outlined'
                      className='w-full  !mt-1'
                      label='Nom Du fichier'
                      disabled={disabled}
                      value={fileName ? fileName : null}
                      onChange={e => handleInputChange(index, e.target.value)}
                      InputLabelProps={{ fontSize: '10px  !important' }}
                      sx={{ fontSize: '10px !important', mb: 1 }}
                      error={formErrors?.[`documents.${index}.name`]}
                      helperText={renderArrayMultiline(formErrors?.[`documents.${index}.name`])}
                    />
                    {/* <CustomeAutoCompleteSelect /> */}
                  </div>
                ) : null}
                {/* {errorMessages} */}
              </Grid>
            </>
          )}
          <Typography mt={2} ml={3} color={'error'}>
            {' '}
            {formErrors?.[`documents.${index}.file`]}{' '}
          </Typography>
        </Grid>
      </div>
      <div>
        <IconButton onClick={() => handleRemoveFile(file)}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </div>
    </div>
  ))

  const handleRemoveAllFiles = () => {
    setFormInput(f => {
      return { ...f, files: [] }
    })
  }

  return (
    <>
      <Card className='!h-[235px]' sx={{}}>
        <Typography className='!font-semibold !m-3  !ml-3 ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
          {titleFiles ? titleFiles : limit > 1 ? 'Importer des fichiers' : 'Importer un fichier'}
        </Typography>
        <CardContent display='flex' justifyContent='center' alignItems='center'>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
              <img src={'/images/icons/file-icons/filesSvg.png'} width={'100'} />
              {/* <FileSvg /> */}
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                <HeadingTypography sx={{ fontSize: '15px', mb: 0, fontWeight: '600' }}>
                  Déposez les fichiers ici ou cliquez pour télécharger.
                </HeadingTypography>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography className='font-semibold' sx={{ fontSize: '14px', mr: 2 }}>
                    <strong>Extensions de fichiers:</strong>
                  </Typography>
                  {fileTypes?.map((typeFile, index) => (
                    <Typography color='textSecondary' sx={{ fontSize: '14px' }} key={index} className='!mr-2'>
                      {typeFile}
                    </Typography>
                  ))}
                </Box> */}

                {/* <Typography color='textSecondary' sx={{ fontSize: '14px', mt: 1 }}>
              Max {limit} Fichier{' '}
            </Typography> */}
              </Box>
            </Box>
          </div>
        </CardContent>
      </Card>
      {formInput?.files?.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className='flex justify-end buttons'>
            <Button
              className='h-[24px] '
              color='error'
              variant='contained'
              sx={{ fontSize: '12px' }}
              onClick={handleRemoveAllFiles}
            >
              Supprimer tout
            </Button>
          </div>
        </Fragment>
      ) : null}
    </>
  )
}

export default CustomFileUploadRestrictions
