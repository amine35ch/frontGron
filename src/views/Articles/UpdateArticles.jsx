// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, Tooltip, IconButton } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import { useRouter } from 'next/router'

import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import {
  useDeleteArticle,
  useDisabledArticles,
  useEnableArticles,
  useGetDetailArticles,
  useGetProductFile,
  useToggleAccessArticles,
  useUpdateArticles,
  useValidateArticles
} from 'src/services/articles.service'
import ContentCreateArticles from './ContentCreateArticles'
import ContentCreateProduct from './ContentCreateProduct'
import axiosClient from 'src/axiosClient'

// ** Custom Components Imports

// ** Styled Components

const UpdateArticles = ({ path, type }) => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()

  const listPermissions = user?.permissions?.find(item => item.resource_name == 'Articles')

  // ** States
  const [formInput, setFormInput] = useState({
    designation: '',
    description: '',
    unit_price: 0,
    unit: '',
    type: type,
    d_brand_id: '',
    work_id: '',
    files: [],
    category: 'Autre',
    sub_category: 'Autre',
    tva: 'non_specifie',
    prix_achat_ht: 0,
    prix_achat_ttc: 0,
    prix_vente_ht: 0,
    bars: []
  })

  const [formErrors, setFormErrors] = useState(false)
  const updateArticlesMutation = useUpdateArticles({ id, type })

  const [formInputFile, setformInputFile] = useState({
    files: []
  })

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)

  // const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)
  // ** Query
  const {
    data: detailsArticles,
    isLoading: detailsArticlesIsLoading,
    isSuccess: detailsArticlesIsSuccess,
    isFetching: detailsArticlesIsFetching
  } = useGetDetailArticles({ id, type })

  // const disabledInput = user?.company?.id === detailsArticles?.d_company_id ? false : true
  const [disabledInput, setDisabledInput] = useState(false)
  const validateArticleMutation = useValidateArticles({ id, type })
  const toggleAccessArticlesMutation = useToggleAccessArticles({ id, type })
  const disabledArticleMutation = useDisabledArticles({ id, type })
  const enableArticleMutation = useEnableArticles({ id, type })
  const deleteArticleMutation = useDeleteArticle()

  // ** GET PRODUCT FILES

  useEffect(() => {
    const fetchProductFile = async (productId, fileName) => {
      const response = await axiosClient.get(`products/${productId}/file/${fileName}`, { responseType: 'blob' })
      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }
      const blob = response.data
      const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition']
      console
      const mimeType = response.headers['content-type']
      let fileNameFromHeader = ''
      if (contentDisposition && contentDisposition.includes('filename=')) {
        fileNameFromHeader = contentDisposition.split('filename=')[1].split(';')[0].trim().replace(/"/g, '')
      }

      return new File([blob], fileNameFromHeader, { type: mimeType })
    }

    const fetchAllFiles = async () => {
      let acerniFile = ''
      let certitiaFile = ''
      let avisTechFile = ''
      let ficheTechFile = ''
      try {
        acerniFile = await fetchProductFile(id, 'doc_acerni')
      } catch (error) {
        console.error('Error fetching files:', error)
      }
      try {
        certitiaFile = await fetchProductFile(id, 'doc_certita')
      } catch (error) {
        console.error('Error fetching files:', error)
      }
      try {
        avisTechFile = await fetchProductFile(id, 'doc_avis_tech')
      } catch (error) {
        console.error('Error fetching files:', error)
      }
      try {
        ficheTechFile = await fetchProductFile(id, 'fiche_tech')
      } catch (error) {
        console.error('Error fetching files:', error)
      }

      setFormInput(prev => {
        return {
          ...prev,
          doc_acerni: acerniFile,
          doc_certita: certitiaFile,
          doc_avis_tech: avisTechFile,
          fiche_tech: ficheTechFile
        }
      })
    }
    if (detailsArticlesIsSuccess) {
      fetchAllFiles()
    }
  }, [detailsArticlesIsSuccess])

  // Handle function
  useEffect(() => {
    if (detailsArticlesIsSuccess) {
      setFormInput(prev => {
        return {
          ...prev,
          ...detailsArticles,
          unit_price: type == '1' ? 0 : detailsArticles?.unit_price,
          unit: detailsArticles?.unit?.type,
          files: [],
          work_id: detailsArticles?.works?.map(work => work.id),
          d_brand_id: detailsArticles?.brand?.id || ''
        }
      })
      setDisabledInput(!detailsArticles?.can_update)
    }
  }, [detailsArticlesIsSuccess])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const data = {
      ...formInput,
      prix_achat_ht: parseFloat(String(formInput.prix_achat_ht).replace(',', '.')),
      prix_achat_ttc: parseFloat(String(formInput.prix_achat_ttc).replace(',', '.')),
      prix_vente_ht: parseFloat(String(formInput.prix_vente_ht).replace(',', '.'))
    }

    const formData = new FormData()
    for (let key in data) {
      if (key == 'files') {
        data?.files?.map((file, index) => {
          formData.append(`file`, file.file)
          formData.append(`doc_name`, file.nom)
        })
      } else if (key == 'work_id') {
        data?.work_id?.map((work, index) => {
          formData.append(`work_id[${index}]`, work)
        })
      } else if (key === 'fiche_tech' || key === 'doc_certita' || key === 'doc_avis_tech' || key === 'doc_acerni') {
        formData.append(key, data[key] || '')
      } else if (key === 'scales') {
        data?.scales?.map((scale, index) => {
          let parsedValue = scale?.value
          if (parsedValue === 'null') {
            parsedValue = ''
          }
          formData.append(`scales[${index}][value]`, parsedValue ?? '')
          formData.append(`scales[${index}][unit]`, scale?.unit ?? '')
          formData.append(`scales[${index}][scale_reference]`, scale?.scale_reference)
        })
      } else if (key === 'bars') {
        formData.append(`bars`, JSON.stringify(data?.bars) ?? '')
      } else {
        formData.append(key, data[key] || '')
      }
    }
    if (type == '1') {
      formData.append('unit_price', 0)
    }

    try {
      await updateArticlesMutation.mutateAsync(formData)
      if (type == '0') {
        router.push(`/Catalog/products`)
      } else if (type == '1') {
        router.push(`/Catalog/services`)
      } else if (type == '2') {
        router.push(`/Catalog/prestations-mar/`)
      }
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject || {})
    }
  }

  const handledeleteArticles = () => {
    setSuspendDialogOpen(true)
  }

  const deleteArticles = async event => {
    try {
      if (event) {
        await deleteArticleMutation.mutateAsync({ id: id, type: type })
        if (type == '0') {
          router.push(`/Catalog/products`)
        } else if (type == '1') {
          router.push(`/Catalog/services`)
        } else if (type == '2') {
          router.push(`/Catalog/prestations-mar/`)
        }
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const disabledArticles = async event => {
    try {
      await disabledArticleMutation.mutateAsync()

      setDisabledDialogOpen(false)
      if (type == '0') {
        router.push(`/Catalog/products`)
      } else if (type == '1') {
        router.push(`/Catalog/services`)
      } else if (type == '2') {
        router.push(`/Catalog/prestations-mar/`)
      }
    } catch (error) {}
  }

  const handleEnabledArticlesMuatation = async event => {
    try {
      await enableArticleMutation.mutateAsync()
    } catch (error) {}
  }

  const handleValidateArticlesMuatation = async event => {
    setSuspendDialogOpen(false)

    try {
      await validateArticleMutation.mutateAsync()
      if (type == '0') {
        router.push(`/Catalog/products`)
      } else if (type == '1') {
        router.push(`/Catalog/services`)
      } else if (type == '2') {
        router.push(`/Catalog/prestations-mar/`)
      }
    } catch (error) {}
  }

  const handleToggleAccesArticlesMuatation = async event => {
    setSuspendDialogOpen(false)

    try {
      await toggleAccessArticlesMutation.mutateAsync()
    } catch (error) {}
  }

  const articleCreationContent = {
    0: (
      <ContentCreateProduct
        detailsArticlesIsLoading={detailsArticlesIsLoading}
        detailsArticlesIsFetching={detailsArticlesIsFetching}
        path={path}
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        onSubmit={onSubmit}
        handleChange={handleChange}
        update={true}
        id={id}
        formInputFile={formInputFile}
        setformInputFile={setformInputFile}
        handleToggleAccesArticlesMuatation={handleToggleAccesArticlesMuatation}
        toggleAccessArticlesMutation={toggleAccessArticlesMutation}
        disabledInput={disabledInput}
        type={type}
      />
    ),
    1: (
      <ContentCreateArticles
        detailsArticlesIsLoading={detailsArticlesIsLoading}
        path={path}
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        onSubmit={onSubmit}
        handleChange={handleChange}
        update={true}
        id={id}
        formInputFile={formInputFile}
        setformInputFile={setformInputFile}
        handleToggleAccesArticlesMuatation={handleToggleAccesArticlesMuatation}
        toggleAccessArticlesMutation={toggleAccessArticlesMutation}
        disabledInput={disabledInput}
        type={type}
      />
    ),
    2: (
      <ContentCreateArticles
        detailsArticlesIsLoading={detailsArticlesIsLoading}
        path={path}
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        onSubmit={onSubmit}
        handleChange={handleChange}
        update={true}
        id={id}
        formInputFile={formInputFile}
        setformInputFile={setformInputFile}
        handleToggleAccesArticlesMuatation={handleToggleAccesArticlesMuatation}
        toggleAccessArticlesMutation={toggleAccessArticlesMutation}
        disabledInput={disabledInput}
        type={type}
      />
    )
  }

  return (
    <div>
      {articleCreationContent[type]}
      {true ? (
        <Grid container item xs={12} mb={2} justifyContent={'flex-end'}>
          {formInput?.can_update && (
            <LoadingButton
              variant='contained'
              loading={updateArticlesMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[150px]'
              sx={{ fontSize: '12px', cursor: 'pointer', ml: 4 }}
              onClick={() => onSubmit()}
              startIcon={<IconifyIcon icon='mdi:pencil-outline' />}
            >
              Modifier
            </LoadingButton>
          )}
        </Grid>
      ) : null}

      <Grid container item xs={12} justifyContent={'flex-start'}>
        {detailsArticles?.state == 1 ? (
          <LoadingButton
            variant='outlined'
            color='error'
            loading={disabledArticleMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[115px] !ml-3'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => disabledArticles()}
            startIcon={<IconifyIcon icon='mi:notification-off' />}
          >
            Désactiver
          </LoadingButton>
        ) : (
          <LoadingButton
            variant='outlined'
            color='success'
            loading={enableArticleMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[115px] !ml-3'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => handleEnabledArticlesMuatation()}
            startIcon={<IconifyIcon icon='material-symbols-light:notifications-active-rounded' />}
          >
            Activer
          </LoadingButton>
        )}
        {user?.profile == 'MAR' ? (
          detailsArticles?.is_validated == 1 ? (
            <LoadingButton
              variant='outlined'
              color='error'
              loading={validateArticleMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[150px] !ml-3'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleValidateArticlesMuatation()}
              startIcon={<IconifyIcon icon='icomoon-free:blocked' />}
            >
              Refuser
            </LoadingButton>
          ) : (
            <LoadingButton
              variant='contained'
              color='success'
              loading={validateArticleMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[150px] !ml-3'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleValidateArticlesMuatation()}
              startIcon={<IconifyIcon icon='mdi:check' />}
            >
              Valider
            </LoadingButton>
          )
        ) : null}

        {formInput?.can_delete && (
          <LoadingButton
            variant='contained'
            color='error'
            loading={deleteArticleMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[150px] !ml-3'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => handledeleteArticles()}
            startIcon={<IconifyIcon icon='mdi:trash-can-outline' />}
          >
            Supprimer
          </LoadingButton>
        )}
      </Grid>
      {formInput?.can_update_price && detailsArticles?.is_validated == 1 && disabledInput && (
        <Grid container item xs={12} mt={2} justifyContent={'flex-end'}>
          <LoadingButton
            variant='contained'
            loading={updateArticlesMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[200px]'
            sx={{ fontSize: '12px', cursor: 'pointer', ml: 4 }}
            onClick={() => onSubmit()}
            startIcon={<IconifyIcon icon='mdi:pencil-outline' />}
          >
            Modifier le prix
          </LoadingButton>
        </Grid>
      )}
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Voulez-vous Supprimer ${type == '0' ? 'Produit' : 'Prestations'} ${formInput?.designation} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteArticles}
      />

      <DialogAlert
        open={disabledDialogOpen}
        description=''
        setOpen={setDisabledDialogOpen}
        title={`${detailsArticles?.state == 0 ? 'Activer' : 'Désactiver'}
        ${type == '0' ? 'Produit' : 'Prestations'} ${formInput?.designation}  ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledArticles}
      />
    </div>
  )
}

export default UpdateArticles
