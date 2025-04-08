import React, { useEffect, useState, useRef } from 'react'
import {
  useGetDataFicheNavetteForProject,
  usePostDataFicheNavetteForProject,
  usePostImageFicheNavetteForProject
} from 'src/services/documentQuestions.service'
import SignatureCanvas from 'react-signature-canvas'
import Image from 'next/image'
import toast from 'react-hot-toast'

// ** Data Import
import { Checkbox, Typography, Grid, Card, CardContent, Button } from '@mui/material'
import {
  dataFicheNavetteOrientation,
  dataFicheNavetteVitrage,
  dataMateriauxFenetre,
  dataMateriauxPorte,
  dataType
} from './dataFicheNavetteSelect'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useRouter } from 'next/router'
import { TextField, Stack } from '@mui/material'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { LoadingButton } from '@mui/lab'
import { useTheme } from '@emotion/react'
import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import CustomInputYear from 'src/components/CustomInputYear'
import IconifyIcon from 'src/@core/components/icon'
import CustomModal from 'src/components/CustomModal'
import { convertAllBase64ToFiles } from 'src/@core/utils/utilities'

const FicheNavette = ({ redirect = false, idProject = '', document }) => {
  const router = useRouter()
  const { id } = router.query
  const signatureCanvasRef = useRef(null)
  const theme = useTheme()
  const dataTypeS = dataType()
  const dataMateriauxFenetreS = dataMateriauxFenetre()
  const dataFicheNavetteOrientationS = dataFicheNavetteOrientation()
  const dataMateriauxPorteS = dataMateriauxPorte()
  const dataFicheNavetteVitrageS = dataFicheNavetteVitrage()

  // state

  const [formInput, setformInput] = useState({
    // type: 'Fenêtre',
    // vitrage: '',
    // Matériaux: 'Inconnu',
    // Largeur: '1',
    // Hauteur: '1',
    // Nombre: '1',
    // Orientation: '',
    // Volet: 'Aucun',

    hauteur: '1',
    largeur: '1',
    materiaux: 'Inconnu',
    nombre: '',
    orientation: '',
    type: 'Fenêtre',
    vitrage: '',
    volet: 'Aucun',
    largeur: ''
  })
  const [formErrorsInput, setFormErrorsInput] = useState(false)

  const [typeSwitch, setTypeSwitch] = useState('Fenêtre')
  const [formErrors, setFormErrors] = useState({})
  const [signatureUrl, setSignatureUrl] = useState('')
  const [defaultSignature, setDefaultSignature] = useState('')
  const [parois_images, setParois_images] = useState({ files: [] })
  const [parois_imagesArray, setParois_imagesArray] = useState([])
  const [chauffage_images, setChauffage_images] = useState({ files: [] })
  const [chauffage_imagesArray, setChauffage_imagesArray] = useState([])
  const [autres, setAutres] = useState({ files: [] })
  const [autresArray, setAutresArray] = useState([])

  const [modifiedData, setModifiedData] = useState([])
  const [openModalFile, setopenModalFile] = useState(false)
  const [urlImage, setUrlImage] = useState(null)

  // querry
  const postFicheNavetteMuattion = usePostDataFicheNavetteForProject({ id })
  const postImagesFicheNavetteMuattion = usePostImageFicheNavetteForProject({ id, idDoc: document })

  const {
    data: dataFicheNavette,
    isFetching: getFormulaireIsFetching,
    isSuccess
  } = useGetDataFicheNavetteForProject({
    id
  })

  // function

  useEffect(() => {
    dataFicheNavette && isSuccess && setModifiedData(dataFicheNavette)
  }, [dataFicheNavette, isSuccess])
  useEffect(() => {
    const imagesfunction = async lastElement => {
      const parois = lastElement[0]?.answer || []
      const chauffage = lastElement[1]?.answer || []
      const autres = lastElement[2]?.answer || []
      const newParois = await convertAllBase64ToFiles(parois)
      const newChauffage = await convertAllBase64ToFiles(chauffage)
      const newAutres = await convertAllBase64ToFiles(autres)
      setParois_images({ files: [...newParois] })
      setChauffage_images({ files: [...newChauffage] })
      setAutres({ files: [...newAutres] })
    }
    if (dataFicheNavette !== undefined) {
      let lastElement = dataFicheNavette[dataFicheNavette?.length - 1]?.response?.content

      const signature = lastElement[lastElement?.length - 1]?.answer
      const parois = lastElement[0]?.answer
      const chauffage = lastElement[1]?.answer
      setSignatureUrl(signature ? signature[0] : '')

      // setParois_imagesArray(parois ? parois : [])
      // setChauffage_imagesArray(chauffage ? chauffage : [])
      imagesfunction(lastElement)
      if (signature !== null) {
        signatureCanvasRef.current.fromDataURL(...signature)
        setDefaultSignature(...signature)
      }
    }
  }, [dataFicheNavette, isSuccess])

  const saveSignature = () => {
    const signatureImage = signatureCanvasRef.current.toDataURL()
    setSignatureUrl(signatureImage)
  }

  const clearCanvas = () => {
    signatureCanvasRef.current.clear()
  }

  const calculateColumnWidth = column => {
    const numColumns = column?.length || 1

    return `${100 / numColumns}%`
  }

  const handleInputChange = (newValue, index, rowIndex, colIndex, item) => {
    const newData = [...dataFicheNavette]
    const targetItem = newData[index].response.content[rowIndex]

    if (targetItem.hasOwnProperty(item)) {
      targetItem[item] = newValue
      setModifiedData(newData)
    } else {
      console.error(`La clé "${item}" n'existe pas dans l'objet cible.`)
    }
  }

  const handleChecked = (newValue, index, rowIndex, colIndex) => {
    const newData = [...dataFicheNavette]

    newData[rowIndex] = newData[rowIndex]
    newData[index].response.content[rowIndex].answer[colIndex] = newValue
    setModifiedData(newData)
  }

  const handleChangeType = checked => {
    setformInput({ ...formInput, type: checked ? 'Porte' : 'Fenêtre' })
    setTypeSwitch(checked ? 'Porte' : 'Fenêtre')
  }

  const handleChange = (key, value) => {
    setformInput({ ...formInput, [key]: value })
  }

  const addLine = index => {
    let newData = [...dataFicheNavette]

    let errors = {}
    for (const property in formInput) {
      if (formInput[property] === '') {
        errors[property] = ['error message']
      }
    }

    if (Object.keys(errors).length !== 0) {
      toast.error(`Merci de compléter les champs obligatoire.`, {
        duration: 2000
      })
      setFormErrorsInput(errors)
    } else {
      newData[index].response.content.push({ ...formInput })

      setModifiedData(newData)

      setformInput({
        hauteur: '1',
        largeur: '1',
        materiaux: 'Inconnu',
        nombre: '',
        orientation: '',
        type: 'Fenêtre',
        vitrage: '',
        volet: 'Aucun',
        largeur: ''
      })
      setTypeSwitch('Fenêtre')
      setFormErrorsInput({})
    }
  }

  const onSubmit = async () => {
    const data = dataFicheNavette.pop()
    try {
      const images = await onSubmitImages()
      if (!images) return
      await postFicheNavetteMuattion.mutateAsync({ responses: dataFicheNavette })

      if (redirect) router.push(`/projects/${idProject}/edit`)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const onSubmitImages = async () => {
    const formData = new FormData()

    formData.append(`signature[0]`, signatureUrl)

    // formData.append(`responses`, JSON.stringify(dataFicheNavette))
    let paroisImage = parois_images.files
    let chauffageImages = chauffage_images.files
    let autresImages = autres.files

    for (let i = 0; i < paroisImage.length; i++) {
      const element = paroisImage[i]
      formData.append(`parois_images[${i}]`, element.file)
    }
    for (let i = 0; i < chauffageImages.length; i++) {
      const element = chauffageImages[i]
      formData.append(`chauffage_images[${i}]`, element.file)
    }
    for (let i = 0; i < autresImages.length; i++) {
      const element = autresImages[i]
      formData.append(`autres[${i}]`, element.file)
    }
    try {
      await postImagesFicheNavetteMuattion.mutateAsync(formData)

      return true
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)

      return false
    }
  }

  const showImage = url => {
    setopenModalFile(true)
    setUrlImage(url)
  }

  return (
    <Card>
      <CardContent>
        {dataFicheNavette?.map((data, index) =>
          index !== dataFicheNavette?.length - 1 ? (
            data.reference_question == '3' ? (
              <div key={index} className='flex !h-full flex-col mt-3'>
                <Typography color='#5F66F0' className='text-bold' sx={{ fontSize: '15px', fontWeight: '600' }}>
                  {data.response.blocTitle}
                </Typography>
                <div className='my-2 overflow-x-auto sm:-mx-0 !lg:-mx-8'>
                  <div className='inline-block min-w-full py-1 align-middle '>
                    <div className='overflow-hidden !border !border-gray-200 rounded-lg'>
                      <table className='h-full min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg '>
                        <thead
                          style={{
                            backgroundColor: 'rgb(245, 245, 247)',
                            borderBottom: '1px solid rgb(233, 233, 236)',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px',
                            lineHeight: '24px !important'
                          }}
                          className='text-gray-900 bg-red-400 rounded-xl'
                        >
                          {data.response.showHeader &&
                            data.response.columns.map((column, index) => (
                              <th key={index} scope='col' className='px-4 py-1 font-semibold text-left cursor-pointer'>
                                <div className='inline-flex '>
                                  <span style={{ fontSize: '13px', color: '#4c4e64de' }}>{column.DisplayName}</span>
                                  {/* Add sorting indicators here */}
                                </div>
                              </th>
                            ))}
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                          {data.response.content?.map((category, categoryIndex) =>
                            category.type.map((type, typeIndex) => (
                              <tr key={`${categoryIndex}-${typeIndex}`}>
                                {typeIndex === 0 && (
                                  <td className='text-center' rowSpan={category.type.length}>
                                    {category.question}
                                  </td>
                                )}
                                <td className='pl-2' style={{ borderLeft: '1px solid #e5e7eb' }}>
                                  {type}
                                </td>
                                <td className='text-center' style={{ borderLeft: '1px solid #e5e7eb' }}>
                                  <Checkbox
                                    checked={category.answer[typeIndex].toString() == 'false' ? false : true}
                                    onChange={e => handleChecked(e.target.checked, index, categoryIndex, typeIndex)}
                                  />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={index} className='flex !h-full flex-col mt-3'>
                <Typography color='#5F66F0' className='text-bold' sx={{ fontSize: '15px', fontWeight: '600' }}>
                  {data.response.blocTitle}
                </Typography>{' '}
                {data.reference_question == 4 ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={2}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <Typography fontSize={'13px'}>Fenêtre</Typography>
                        <FormControlLabel
                          control={<Switch onChange={e => handleChangeType(e.target.checked)} size='small' />}
                        />
                        <Typography fontSize={'13px'}>Porte</Typography>
                      </Stack>
                    </Grid>

                    {typeSwitch !== 'Porte' && (
                      <Grid item xs={12} md={2}>
                        <CustomeAutoCompleteSelect
                          data={dataTypeS}
                          value={formInput.type}
                          onChange={value => handleChange('type', value)}
                          option={'name'}
                          displayOption={'name'}
                          label={'Type'}
                          error={formErrorsInput?.type}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} md={2}>
                      <CustomeAutoCompleteSelect
                        data={formInput?.type == 'Porte' ? dataMateriauxPorteS : dataMateriauxFenetreS}
                        value={formInput.materiaux}
                        onChange={value => handleChange('materiaux', value)}
                        option={'name'}
                        displayOption={'name'}
                        label={'Matériaux'}
                        error={formErrorsInput?.materiaux}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <CustomeAutoCompleteSelect
                        data={dataFicheNavetteVitrageS}
                        value={formInput.vitrage}
                        onChange={value => handleChange('vitrage', value)}
                        option={'name'}
                        displayOption={'name'}
                        label={'Type Vitrage'}
                        error={formErrorsInput?.vitrage}
                      />
                    </Grid>

                    <Grid item xs={12} md={2} className='!mb-2 !mt-4 !pt-0'>
                      <TextField
                        placeholder='Largeur'
                        size='small'
                        variant='outlined'
                        className='w-full'
                        value={formInput.largeur}
                        onChange={e => {
                          handleChange('largeur', e.target.value)
                        }}
                        label='Largeur'
                        sx={{ fontSize: '10px !important' }}
                        error={formErrorsInput?.largeur}
                      />
                    </Grid>
                    <Grid item xs={12} md={2} className='!mb-2 !mt-4 !pt-0'>
                      <TextField
                        placeholder='hauteur'
                        size='small'
                        variant='outlined'
                        className='w-full'
                        value={formInput.hauteur}
                        onChange={e => {
                          handleChange('hauteur', e.target.value)
                        }}
                        label='Hauteur'
                        sx={{ fontSize: '10px !important' }}
                        error={formErrorsInput?.hauteur}
                      />
                    </Grid>
                    <Grid item xs={12} md={2} className='!mb-2 !mt-3 !pt-0'>
                      <TextField
                        placeholder='Nombre'
                        size='small'
                        variant='outlined'
                        className='w-full'
                        value={formInput.nombre}
                        onChange={e => {
                          handleChange('nombre', e.target.value)
                        }}
                        label='Nombre'
                        sx={{ fontSize: '10px !important' }}
                        error={formErrorsInput?.nombre}
                      />
                    </Grid>
                    <Grid item xs={12} md={2} className='!mb-2 !mt-2 !pt-0'>
                      <CustomeAutoCompleteSelect
                        data={dataFicheNavetteOrientationS}
                        value={formInput.orientation}
                        onChange={value => handleChange('orientation', value)}
                        option={'name'}
                        displayOption={'name'}
                        label={'Orientation'}
                        error={formErrorsInput?.orientation}
                      />
                    </Grid>
                    <Grid item xs={12} md={2} className='!mb-2 !mt-3 !pt-0'>
                      <TextField
                        placeholder='Volet'
                        size='small'
                        variant='outlined'
                        className='w-full '
                        value={formInput.volet}
                        onChange={e => {
                          handleChange('volet', e.target.value)
                        }}
                        label='Volet'
                        error={formErrorsInput?.volet}
                        sx={{ fontSize: '10px !important' }}
                      />
                    </Grid>

                    <Grid item xs={12} className='flex justify-end'>
                      <Button
                        variant='contained'
                        aria-label='add'
                        onClick={() => addLine(index)}
                        className='h-[29px] w-[105px]'
                        sx={{ fontSize: '12px' }}
                      >
                        Ajouter
                      </Button>
                    </Grid>
                  </Grid>
                ) : null}
                <div className='my-2 overflow-x-auto sm:-mx-0 !lg:-mx-8'>
                  <div className='inline-block min-w-full py-1 align-middle '>
                    <div className='overflow-hidden !border !border-gray-200 rounded-lg'>
                      <table className='h-full min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg '>
                        {data.response.showHeader && (
                          <thead
                            style={{
                              backgroundColor: 'rgb(245, 245, 247)',
                              borderBottom: '1px solid rgb(233, 233, 236)',
                              borderTopLeftRadius: '10px',
                              borderTopRightRadius: '10px',
                              lineHeight: '24px !important'
                            }}
                            className='text-gray-900 bg-red-400 rounded-xl'
                          >
                            {data.response.columns.map((column, index) => (
                              <th key={index} scope='col' className='px-4 py-1 font-semibold text-left cursor-pointer'>
                                <div className='inline-flex '>
                                  <span style={{ fontSize: '13px', color: '#4c4e64de' }}>{column.DisplayName}</span>
                                  {/* Add sorting indicators here */}
                                </div>
                              </th>
                            ))}
                          </thead>
                        )}
                        <tbody className='divide-y divide-gray-200'>
                          {data.response.content?.map((item, rowIndex) => (
                            <tr key={rowIndex} className={``}>
                              {data.response.columns.map((column, colIndex) => (
                                <td
                                  key={colIndex}
                                  className={`text-semiBold  !p-2    !ml-2`}
                                  style={{
                                    width: calculateColumnWidth(data.response.columns),

                                    borderLeft: colIndex == 0 ? 'none' : '1px solid #e5e7eb'
                                  }}
                                >
                                  {colIndex == 0 || data?.reference_question == 4 ? (
                                    <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                                      {item[column.reference]}
                                    </Typography>
                                  ) : data?.reference_question == 2 ? (
                                    rowIndex == 0 ? (
                                      <div className='pl-2'>
                                        <CustomInputYear
                                          value={item[column.reference] || ''}
                                          setNumber={value => {
                                            handleInputChange(value, index, rowIndex, colIndex, column.reference)
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <input
                                        placeholder='...'
                                        className='w-full h-full !border-none outline-none pl-3'
                                        type='text'
                                        value={item[column.reference] || ''}
                                        onChange={e =>
                                          handleInputChange(e.target.value, index, rowIndex, colIndex, column.reference)
                                        }
                                      />
                                    )
                                  ) : (
                                    <input
                                      placeholder='...'
                                      className='w-full h-full !border-none outline-none pl-3'
                                      type='text'
                                      value={item[column.reference] || ''}
                                      onChange={e =>
                                        handleInputChange(e.target.value, index, rowIndex, colIndex, column.reference)
                                      }
                                    />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : null
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CustomComponentFileUpload
              fileTypes={['.png', '.jpeg', '.jpg']}
              limit={50}
              multiple={true}
              formInput={parois_images}
              setFormInput={setParois_images}
              name='files'
              titleFiles={'Importer des fichiers pour parois'}
              showInputName={false}
            />
            {/* display form error */}

            {parois_imagesArray?.map((img, index) => (
              <div
                key={index}
                className='flex  !w-full justify-between !my-2 px-2 !ml-1 py-2 '
                style={{ borderRadius: '10px', border: `1px dashed ${theme.palette.primary.main}`, width: 'auto' }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <div className='file-details  !flex !justify-between items-center'>
                      <div className='ml-2 file-preview'>
                        <img key={index} src={img?.image} width={'50'} />
                      </div>
                      <div>
                        <IconifyIcon
                          onClick={() => showImage(img?.image)}
                          fontSize='18px'
                          className='!cursor-pointer'
                          icon='ic:round-open-in-new'
                          color='#585ddb'
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomComponentFileUpload
              fileTypes={['.png', '.jpeg', '.jpg']}
              limit={50}
              multiple={true}
              formInput={chauffage_images}
              setFormInput={setChauffage_images}
              titleFiles={'Importer des fichiers pour chauffage'}
              name='files'
              showInputName={false}
            />
            {chauffage_imagesArray?.map((img, index) => (
              <div
                key={index}
                className='flex  !w-full justify-between !my-2 px-2 !ml-1 py-2 '
                style={{ borderRadius: '10px', border: `1px dashed ${theme.palette.primary.main}`, width: 'auto' }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <div className='file-details  !flex !justify-between items-center'>
                      <div className='ml-2 file-preview'>
                        <img key={index} src={img?.image} width={'50'} />
                      </div>
                      <div style={{ cursor: 'pointer !important' }}>
                        <IconifyIcon
                          onClick={() => showImage(img?.image)}
                          fontSize='18px'
                          className='!cursor-pointer'
                          icon='ic:round-open-in-new'
                          color='#585ddb'
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomComponentFileUpload
              fileTypes={['.png', '.jpeg', '.jpg']}
              limit={50}
              multiple={true}
              formInput={autres}
              setFormInput={setAutres}
              titleFiles={'Autres'}
              name='files'
              showInputName={false}
            />
            {autresArray?.map((img, index) => (
              <div
                key={index}
                className='flex  !w-full justify-between !my-2 px-2 !ml-1 py-2 '
                style={{ borderRadius: '10px', border: `1px dashed ${theme.palette.primary.main}`, width: 'auto' }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <div className='file-details  !flex !justify-between items-center'>
                      <div className='ml-2 file-preview'>
                        <img key={index} src={img?.image} width={'50'} />
                      </div>
                      <div style={{ cursor: 'pointer !important' }}>
                        <IconifyIcon
                          onClick={() => showImage(img?.image)}
                          fontSize='18px'
                          className='!cursor-pointer'
                          icon='ic:round-open-in-new'
                          color='#585ddb'
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            ))}
          </Grid>
        </Grid>
        <Card
          sx={{
            p: 5,
            bgcolor: theme.palette.secondary.beigeBared,
            mt: 4
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4} md={8}>
              <Image src={'/images/logos/logo-mar.png'} width={150} height={130} alt='logo' />
            </Grid>
            <Grid item xs={12} md={4}>
              <div className='flex justify-between'>
                <Typography color='error' className='!mb-1 !font-semibold'>
                  Signature
                </Typography>
                {/* <img src={defaultSignature} alt='' /> */}
                <div className='flex'>
                  <Button
                    variant='outlined'
                    color='primary'
                    className='h-[26px] '
                    sx={{ fontSize: '11px', cursor: 'pointer' }}
                    onClick={clearCanvas}
                  >
                    Corriger
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    className='h-[26px] '
                    sx={{ fontSize: '11px', cursor: 'pointer', marginLeft: '.5rem' }}
                    onClick={saveSignature}
                  >
                    Enregistrer Signature
                  </Button>
                </div>
              </div>

              <SignatureCanvas
                penColor='black'
                ref={signatureCanvasRef}
                canvasProps={{
                  height: 200,
                  className: 'sigCanvas',
                  style: { width: '100%', backgroundColor: 'white', borderRadius: '10px', marginTop: '.5rem' }
                }}

                // defaultValue={defaultSignature}
              />
            </Grid>
          </Grid>
        </Card>

        <div className='flex justify-end mt-4'>
          <LoadingButton
            variant='contained'
            color='primary'
            loading={postFicheNavetteMuattion?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Enregistrer
          </LoadingButton>
        </div>
      </CardContent>

      <CustomModal
        open={openModalFile}
        handleCloseOpen={() => setopenModalFile(false)}
        handleActionModal={() => setopenModalFile(false)}
        btnTitle={'Fermer'}
        ModalTitle={'Visualiser'}
        widthModal={'lg'}
        btnTitleClose={false}
        action={() => setopenModalFile(false)}
      >
        <img src={urlImage} style={{ height: '100%' }} alt='imges' />

        {/* </div> */}
      </CustomModal>
    </Card>
  )
}

export default FicheNavette
