// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { useRouter } from 'next/router'
import ContentCreateArticles from './ContentCreateArticles'
import { useCreateArticles, useCreateProduct } from 'src/services/articles.service'
import ContentCreateProduct from './ContentCreateProduct'

// ** Custom Components Imports

// ** Styled Components

const CreateArticles = ({ type }) => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    scales: [],
    category: 'Autre',
    sub_category: 'Autre',
    tva: 'non_specifie',
    prix_achat_ht: 0,
    prix_achat_ttc: 0,
    prix_vente_ht: 0,
    unit_price: 0,
    type,
    bars: [],
    designation: '',
    files: []
  })
  const [formErrors, setFormErrors] = useState(false)
  const createArticlesMutation = useCreateArticles()
  const createProductMutation = useCreateProduct()

  // ** Query

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const formData = new FormData()

    const data = {
      ...formInput,
      prix_achat_ht: parseFloat(String(formInput.prix_achat_ht).replace(',', '.')),
      prix_achat_ttc: parseFloat(String(formInput.prix_achat_ttc).replace(',', '.')),
      prix_vente_ht: parseFloat(String(formInput.prix_vente_ht).replace(',', '.'))
    }
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
        formData.append(key, data[key])
      } else if (key === 'scales') {
        data?.scales?.map((scale, index) => {
          formData.append(`scales[${index}][value]`, scale?.value)
          formData.append(`scales[${index}][unit]`, scale?.unit ?? '')
          formData.append(`scales[${index}][scale_reference]`, scale?.scale_reference)
        })
      } else if (key === 'bars') {
        formData.append(`bars`, JSON.stringify(data?.bars) ?? '')
      } else {
        formData.append(key, data[key])
      }
    }

    try {
      if (type == '0') {
        await createProductMutation.mutateAsync(formData)
      } else {
        await createArticlesMutation.mutateAsync(formData)
      }
      if (type == '0') {
        router.push(`/Catalog/products`)
      } else if (type == '1') {
        router.push(`/Catalog/services`)
      } else {
        router.push(`/Catalog/prestations-mar`)
      }
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject || {})
    }
  }

  const articleCreationContent = {
    0: (
      <ContentCreateProduct
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        onSubmit={onSubmit}
        handleChange={handleChange}
        detailsArticlesIsLoading={false}
        type={type}
      />
    ),
    1: (
      <ContentCreateArticles
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        onSubmit={onSubmit}
        handleChange={handleChange}
        detailsArticlesIsLoading={false}
        type={type}
      />
    ),
    2: (
      <ContentCreateArticles
        formInput={formInput}
        setFormInput={setFormInput}
        formErrors={formErrors}
        onSubmit={onSubmit}
        handleChange={handleChange}
        detailsArticlesIsLoading={false}
        type={type}
      />
    )
  }

  return (
    <div>
      {articleCreationContent[type]}
      <Grid container className='mt-6'>
        <Grid item xs={6}></Grid>
        <Grid item xs={5} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createArticlesMutation?.isPending || createProductMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Créer
          </LoadingButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateArticles
