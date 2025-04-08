import React, { useState } from 'react'

import { useRouter } from 'next/router'

// import CardDetails from '../components/Cards/CardDetails'
import { Grid } from '@mui/material'
import {
  useDeleteCollaborator,
  useDisabledCollaborator,
  useGetDetailCollaborators,
  useUploadDocumentForCollaborator
} from 'src/services/collaborators.service'
import UserViewCardDetails from '../components/Cards/UserViewCardDetails'
import TabsDetailsEntites from '../components/tabs/TabsDetailsEntites'

const DetailsCollaborators = () => {
  const router = useRouter()
  const { id } = router.query

  const [formInput, setFormInput] = useState({
    files: []
  })
  const [formErrorsFiles, setformErrorsFiles] = useState(false)

  const [formErrors, setFormErrors] = useState(null)
  const { data, isLoading } = useGetDetailCollaborators({ id })

  const uploadDocumentToCollaboratorMutation = useUploadDocumentForCollaborator({ id })
  const deleteUserMutation = useDeleteCollaborator()
  const disabledUserMutation = useDisabledCollaborator()

  const uploadDocumentToCollaborator = async () => {
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
      await uploadDocumentToCollaboratorMutation.mutateAsync(formData)
      setFormInput({
        files: []
      })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setformErrorsFiles(errorsObject)
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteCollaborator = async () => {
    try {
      await deleteUserMutation.mutateAsync({ id: id })
      router.push('/collaborators')
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledCollaborator = async event => {
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      setDisabledDialogOpen(false)
      router.push('/collaborators')
    } catch (error) {}
  }

  return (
    <Grid className='!h-full' container spacing={4}>
      <Grid className='!h-full' item xs={12} md={4}>
        <UserViewCardDetails
          dataDetails={data}
          path={'/collaborators'}
          handleDelete={handleDelete}
          handleDisabled={handleDisabled}
          disabledUser={disabledCollaborator}
          deleteUser={deleteCollaborator}
          deleteUserMutation={deleteUserMutation}
          disabledUserMutation={disabledUserMutation}
          state={data?.state}
          resource={'collaborators'}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <TabsDetailsEntites
          tabsDocumentTitle={'Colaborateur'}
          dataDetails={data}
          uploadDocuments={uploadDocumentToCollaborator}
          formInput={formInput}
          setFormInput={setFormInput}
          formErrors={formErrors}
        />
      </Grid>
    </Grid>
  )
}

export default DetailsCollaborators
