// material-ui
import { Card, CardActions, CardContent, IconButton, Typography, Box } from '@mui/material'
import React from 'react'
import { cloneDeep } from 'lodash'
import { LoadingButton } from '@mui/lab'

import moment from 'moment/moment'

import CircularProgress from '@mui/material/CircularProgress'

import {
  useDeleteImage,
  useGetFormulaireForProject,
  usePostFormulaireForProject,
  useStoreImage
} from 'src/services/formulaire.service'
import { useRouter } from 'next/router'
import LigneTypeOne from 'src/views/components/Formulaire/form-inputs/LigneTypeOne'
import LigneTypeTwo from 'src/views/components/Formulaire/form-inputs/LigneTypeTwo'
import LigneTypeFour from 'src/views/components/Formulaire/form-inputs/LigneTypeFour'
import LigneTypeSix from 'src/views/components/Formulaire/form-inputs/LigneTypeSix'
import LigneTypeThree from 'src/views/components/Formulaire/form-inputs/LigneTypeThree'
import LigneTypeSeven from 'src/views/components/Formulaire/form-inputs/LigneTypeSeven'
import LigneTypeNine from 'src/views/components/Formulaire/form-inputs/LigneTypeNine'
import Title from 'src/views/components/Formulaire/form-inputs/Title'
import SubTitle from 'src/views/components/Formulaire/form-inputs/SubTitle'
import EditorComponent from 'src/views/components/Formulaire/form-inputs/EditorComponent'
import { returnFieldAfterChange } from 'src/views/components/Formulaire/form-inputs/HandleChangeFcuntions'
import IconifyIcon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'

const FormulaireCardUpdate = ({ idProject, document, typeProject, redirect }) => {
  const router = useRouter()
  const theme = useTheme()

  const { data, isFetching: getFormulaireIsFetching } = useGetFormulaireForProject({
    id: idProject,
    document: document
  })
  const [localData, setLocalData] = React.useState([])
  const [formImages, setFormImages] = React.useState({})
  const postFormMutation = usePostFormulaireForProject({ id: idProject, document: document })

  const storeImageMutation = useStoreImage()

  const deleteImageMutation = useDeleteImage()

  const [date, setDate] = React.useState({
    start: new Date(),
    end: new Date()
  })
  const [images, setImages] = React.useState([])

  const [isLoading, setIsLoading] = React.useState(false)

  const [formErrors, setFormErrors] = React.useState({
    latitude: '',
    longitude: ''
  })

  // React.useEffect(() => {}, [cordinates]);
  React.useEffect(() => {
    setLocalData(cloneDeep(data))
    setDate({
      // start: moment.utc(inspectionData?.data?.start_date).format('YYYY-MM-DD HH:mm:ss'),
      // end: moment.utc(inspectionData?.data?.end_date).format('YYYY-MM-DD HH:mm:ss')
    })
  }, [data])

  React.useEffect(() => {
    const images = {}
    data?.blocs?.forEach(bloc => {
      bloc?.lines?.forEach(line => {
        if (line?.type === 2 || line?.type === 11) {
          if (line?.form_response[0]?.path_photos?.length > 0) {
            images[line?.id] = [...line?.form_response[0]?.path_photos]

            // images[line?.id].push(line?.form_response[0]?.photos_chemin?.name);
            // images.push({ name: line?.form_response[0]?.photos_chemin?.name });
          }
        }
      })
    })
    setFormImages(images)

    // setIsImageLoading(
    //   new Array(data?.blocs?.slice(-1)?.slice(-1)[0]?.lines?.slice(-1)[0]?.form_response[0]?.photos_chemin?.length).fill(false)
    // );
  }, [data])

  const handleRemoveFile = (ligneId, index) => {
    const updatedList = [...images]
    const imageIndex = images?.findIndex(item => item?.line === ligneId)
    updatedList[imageIndex]?.images?.splice(index, 1)
    setImages(updatedList)
  }

  const [isImageLoading, setIsImageLoading] = React.useState([])

  const handleDeleteImage = async (ligneId, index) => {
    setIsImageLoading(prevIsImageLoading => {
      const updatedLoading = [...prevIsImageLoading]
      updatedLoading[index] = true

      return updatedLoading
    })
    setIsLoading(true)
    try {
      await deleteImageMutation.mutateAsync({
        id: inspectionData?.data?.id,
        values: { indice: index, line_id: ligneId }
      })
      const updatedFormImages = { ...formImages }
      updatedFormImages[ligneId].splice(index, 1)
      setFormImages({ ...updatedFormImages })
    } catch (error) {
      console.log(error)

      // console.error('API call failed:', error);
    }
    setIsLoading(false)
    setIsImageLoading(prevIsImageLoading => {
      const updatedLoading = [...prevIsImageLoading]
      updatedLoading[index] = false

      return updatedLoading
    })
  }

  const handleChange = (event, blocIndex, ligneIndex, fieldIndex, subLineIndex = false, subFieldIndex = false) => {
    let newPermissions = cloneDeep(localData)

    // newPermissions.blocs[blocIndex].lignes[ligneIndex] = 0;
    if (subLineIndex !== false) {
      const line = newPermissions.blocs[blocIndex].lines[ligneIndex].content.data.fields[fieldIndex].ajout[subLineIndex]
      returnFieldAfterChange(line.type, line, subFieldIndex, event)
    } else {
      const line = newPermissions.blocs[blocIndex].lines[ligneIndex]

      returnFieldAfterChange(line.type, line.content.data, fieldIndex, event)
    }

    setLocalData(newPermissions)
  }

  const handleImage = async (event, blocIndex, ligneIndex, fieldIndex) => {
    let newPermissions = cloneDeep(localData)
    let ligne = newPermissions.blocs[blocIndex].lines[ligneIndex].id
    const imageIndex = images.findIndex(item => item.line === ligne)
    if (imageIndex !== -1) {
      let cloneImages = [...images]
      cloneImages[imageIndex] = {
        ...cloneImages[imageIndex],
        line: ligne,
        images: [...cloneImages[imageIndex].images, ...event.target.files]
      }
      setImages(cloneImages)
    } else {
      setImages([...images, { line: ligne, images: [...event.target.files] }])
    }
  }

  const handleSubmit = async e => {
    e?.preventDefault()
    setIsLoading(true)

    setIsLoading(true)

    try {
      // for (let i = 0; i < images.length; i++) {
      //   const formData = new FormData()
      //   const array = { ...images[i] }

      //   formData.append('line_id', array.line)

      //   for (let index = 0; index < array.images.length; index++) {
      //     formData.append(`files[${index}]`, array.images[index])
      //   }

      //   await storeImageMutation.mutateAsync({
      //     id: inspectionData?.data?.id,
      //     values: formData
      //   })
      // }
      await postFormMutation.mutateAsync({
        form: localData
      })

      if (redirect) router.push(`/${typeProject}/${idProject}/edit`)
    } catch (error) {
      setIsLoading(false)
      setIsLoading(false)
    }

    setIsLoading(false)
    setIsLoading(false)
  }

  const calculeType7 = field => {
    const results = []

    field?.formules?.forEach(item => {
      let x = 0
      let y = 0

      if (typeof item.x !== 'number') {
        if (typeof item.x !== 'string') {
          x =
            localData.blocs[item.x.indice_bloc].lines[item.x.indice_ligne].content.data.fields[item.x.indice_field]
              .value
        } else {
          const index = item.x.split('_')[1]
          x = results[index - 1]
        }
      } else {
        x = item.x
      }
      if (typeof item.y !== 'number') {
        if (typeof item.y !== 'string') {
          y =
            localData?.blocs[item.y.indice_bloc]?.lines[item.y.indice_ligne].content.data.fields[item.y.indice_field]
              .value
        } else {
          const index = item.y.split('_')[1]
          y = results[index - 1]
        }
      } else {
        y = item.y
      }
      const result = calcule(x, y, item.operation)
      results.push(result)
    })
    let x = 0
    let y = 0

    if (typeof field?.formule_finale.x !== 'number') {
      if (typeof field?.formule_finale.x !== 'string') {
        x =
          localData.blocs[field?.formule_finale.x.indice_bloc].lines[field?.formule_finale.x.indice_ligne].content.data
            .fields[field?.formule_finale.x.indice_field].value
      } else {
        const index = field?.formule_finale.x.split('_')[1]
        x = results[index - 1]
      }
    } else {
      x = field?.formule_finale.x
    }
    if (typeof field?.formule_finale.y !== 'number') {
      if (typeof field?.formule_finale.y !== 'string') {
        y =
          localData.blocs[field?.formule_finale.y.indice_bloc].lines[field?.formule_finale.y.indice_ligne].content.data
            .fields[field?.formule_finale.y.indice_field].value
      } else {
        const index = field?.formule_finale.y.split('_')[1]
        y = results[index - 1]
      }
    } else {
      y = field?.formule_finale.y
    }

    return typeof calcule(x, y, field?.formule_finale.operation) === 'number'
      ? parseFloat(calcule(x, y, field?.formule_finale.operation).toFixed(2))
      : 0
  }

  const calulateInputSeven = (blocIndex, ligneIndex, fieldIndex, field) => {
    let newPermissions = cloneDeep(localData)
    newPermissions.blocs[blocIndex].lines[ligneIndex].content.data.fields[fieldIndex].value = calculeType7(field)
    setLocalData(newPermissions)
  }

  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className='flex justify-end'>
            <CardActions style={{ padding: 1 }}>
              <LoadingButton
                loadingPosition='start'
                disabled={getFormulaireIsFetching}
                loading={isLoading}
                color={'primary'}
                variant='contained'
                type='submit'
                form='test'
              >
                {'Enregistrer'}
              </LoadingButton>
            </CardActions>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', padding: '1px !important' }}>
            <div
              style={{
                zIndex: getFormulaireIsFetching ? 0 : 1,
                opacity: getFormulaireIsFetching ? 0.5 : 1
              }}
            >
              <div
                style={{
                  // padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* {!getFormulaireIsFetching && ( */}
                <form id='test' onSubmit={handleSubmit}>
                  {!getFormulaireIsFetching && (
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 5 }}>
                      {Array.isArray(localData?.blocs) &&
                        localData?.blocs?.map((bloc, blocIndex) => (
                          <div
                            key={bloc?.id}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              columnGap: 10,
                              marginTop: 10
                            }}
                          >
                            <div>
                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: 14
                                }}
                              >
                                {`${bloc?.title}`}
                              </Typography>
                            </div>
                            {Array.isArray(bloc?.lines) &&
                              bloc?.lines?.map((ligne, ligneIndex) => (
                                <div key={ligne?.id}>
                                  {returnInput(
                                    ligne?.type,
                                    blocIndex,
                                    ligne,
                                    ligneIndex,
                                    handleChange,
                                    formErrors,
                                    setFormErrors,
                                    calulateInputSeven,
                                    handleRemoveFile,
                                    handleDeleteImage,
                                    isLoading,
                                    isImageLoading,
                                    images,
                                    formImages,
                                    handleImage
                                  )}
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  )}
                </form>
                {/* )} */}
              </div>
            </div>
            {getFormulaireIsFetching && (
              <div className='overlay' style={{ alignSelf: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <CircularProgress size={60} />
              </div>
            )}
          </div>
          <CardActions style={{ display: 'inline-flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              loadingPosition='start'
              loading={isLoading}
              color={'primary'}
              variant='contained'
              type='submit'
              form='test'
              disabled={getFormulaireIsFetching}
            >
              {'Enregistrer'}
            </LoadingButton>
          </CardActions>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormulaireCardUpdate

const returnInput = (
  type,
  blocIndex,
  ligne,
  ligneIndex,
  handleChange,
  formErrors,
  setFormErrors,
  calulateInputSeven,
  handleRemoveFile,
  handleDeleteImage,
  isLoading,
  isImageLoading,
  images,
  formImages,
  handleImage
) => {
  switch (type) {
    case 1:
      return (
        <LigneTypeOne
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      )
    case 2:
      return (
        <LigneTypeTwo
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          handleRemoveFile={handleRemoveFile}
          handleDeleteImage={handleDeleteImage}
          isLoading={isLoading}
          isImageLoading={isImageLoading}
          images={images}
          formImages={formImages}
          handleImage={handleImage}
        />
      )

    // case 11:
    //   return (
    //     <LigneTypeEleven
    //       blocIndex={blocIndex}
    //       ligne={ligne}
    //       ligneIndex={ligneIndex}
    //       handleChange={handleChange}
    //       formErrors={formErrors}
    //       setFormErrors={setFormErrors}
    //       handleRemoveFile={handleRemoveFile}
    //       handleDeleteImage={handleDeleteImage}
    //       isLoading={isLoading}
    //       isImageLoading={isImageLoading}
    //       images={images}
    //       formImages={formImages}
    //       handleImage={handleImage}
    //     />
    //   )
    case 4:
      return (
        <LigneTypeFour
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      )
    case 6:
      return (
        <LigneTypeSix
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      )
    case 3:
      return (
        <LigneTypeThree
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      )
    case 7:
      return (
        <LigneTypeSeven
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          calulateInputSeven={calulateInputSeven}
        />
      )
    case 8:
      return (
        <EditorComponent
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      )
    case 9:
      return (
        <LigneTypeNine
          blocIndex={blocIndex}
          ligne={ligne}
          ligneIndex={ligneIndex}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          calulateInputSeven={calulateInputSeven}
        />
      )
    case 5:
      return <Title blocIndex={blocIndex} ligne={ligne} ligneIndex={ligneIndex} />
    case 10:
      return <SubTitle blocIndex={blocIndex} ligne={ligne} ligneIndex={ligneIndex} />

    default:
      break
  }
}

const calcule = (x, y, o) => {
  switch (o) {
    case '*':
      return x * y
    case '-':
      return x - y
    case '+':
      return x + y
    case '/':
      return x / y
    default:
      return 0
  }
}
