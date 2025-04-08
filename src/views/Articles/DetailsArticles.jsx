import React, { useState } from 'react'

import { useRouter } from 'next/router'

import { Grid, CardContent } from '@mui/material'

const DetailsArticles = () => {
  const router = useRouter()
  const { id } = router.query

  const [formInput, setFormInput] = useState({
    files: []
  })
  const [formErrors, setFormErrors] = useState(null)
  const [openModalFile, setopenModalFile] = useState(false)
  const [formErrorsFiles, setformErrorsFiles] = useState(false)

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteClient = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: id })
      }
      router.push('/beneficiaries')
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledClient = async event => {
    setDisabledDialogOpen(false)
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      router.push('/beneficiaries')
    } catch (error) {}
  }

  const uploadDocumentToCient = async () => {
    const formData = new FormData()

    for (let key in formInput) {
      if (key == 'files') {
        formInput?.files?.map((file, index) => {
          // formData.append(`signature`, file)
          formData.append(`documents[${index}][file]`, file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      }
    }
    try {
      await uploadDocumentToCientMutation.mutateAsync(formData)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const deleteDocument = async idDoc => {
    try {
      await deleteDocumentCientMutation.mutateAsync({ id: idDoc })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const deleteSpecificVersion = async idVersion => {
    try {
      await deleteSpecificVersionDocumentCientMutation.mutateAsync({ id: idVersion })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  return <Grid className='!h-full' container spacing={4}></Grid>
}

export default DetailsArticles
