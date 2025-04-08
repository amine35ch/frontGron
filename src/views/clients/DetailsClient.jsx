import React, { useState } from 'react'

import { useRouter } from 'next/router'
import {
  useDeleteClient,
  useDeleteDocumentClient,
  useDeleteDocumentClientSpecificVersion,
  useDisabledClient,
  useGetDetailClient,
  useUploadDocumentForClient
} from 'src/services/client.service'
import { Grid, Card, CardContent } from '@mui/material'
import TabsDetailsEntites from '../components/tabs/TabsDetailsEntites'
import { useGetTypeDocumentForClient } from 'src/services/document.service'
import UserViewCardDetailsClient from './UserViewCardDetailsClient'
import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'
import TabsDetailsClient from './TabsDetailsClient'

const DetailsClient = () => {
  const router = useRouter()
  const { id } = router.query

  const [formInput, setFormInput] = useState({
    files: []
  })
  const [formErrorsFiles, setformErrorsFiles] = useState(false)

  const [formErrors, setFormErrors] = useState(null)
  const [openModalFile, setopenModalFile] = useState(false)

  const [formInputFile, setformInputFile] = useState({
    files: []
  })
  const { data, isLoading } = useGetDetailClient({ id })
  const uploadDocumentToCientMutation = useUploadDocumentForClient({ id })

  const deleteUserMutation = useDeleteClient()
  const disabledUserMutation = useDisabledClient()
  const { data: listTypeDocumentClient } = useGetTypeDocumentForClient({ id })

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteClient = async event => {
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: id })
      }
      router.push('/beneficiaries')
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledClient = async event => {
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      setDisabledDialogOpen(false)
      router.push('/beneficiaries')
    } catch (error) {}
  }

  const uploadDocumentToCient = async fileName => {
    const formData = new FormData()

    for (let key in formInputFile) {
      if (key == 'files') {
        formInputFile?.files?.map((file, index) => {
          // formData.append(`signature`, file)
          formData.append(`documents[${index}][file]`, file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else if (fileName) {
            formData.append(`documents[${index}][name]`, fileName)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      }
    }
    try {
      await uploadDocumentToCientMutation.mutateAsync(formData)
      setformInputFile({ files: [] })
      setopenModalFile(false)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors

      setformErrorsFiles(errorsObject)
    }
  }

  const deleteDocumentCientMutation = useDeleteDocumentClient()
  const deleteSpecificVersionDocumentCientMutation = useDeleteDocumentClientSpecificVersion()

  const deleteDocument = async idDoc => {
    try {
      await deleteDocumentCientMutation.mutateAsync({ id: idDoc })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const deleteSpecificVersion = idVersion => {
    try {
      deleteSpecificVersionDocumentCientMutation.mutateAsync({ id: idVersion })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  return (
    <Grid className='!h-full' container spacing={4}>
      <Grid className='' item xs={12} md={4}>
        <UserViewCardDetailsClient
          dataDetails={data}
          path={'/beneficiaries'}
          handleDelete={handleDelete}
          handleDisabled={handleDisabled}
          disabledUser={disabledClient}
          deleteUser={deleteClient}
          deleteUserMutation={deleteUserMutation}
          disabledUserMutation={disabledUserMutation}
          state={data?.state}
          deleteDocument={deleteDocument}
          deleteSpecificVersion={deleteSpecificVersion}
          openModalFile={openModalFile}
          setopenModalFile={setopenModalFile}
          formInput={formInput}
          setFormInput={setFormInput}
          resource={'clients'}
        />

        <Card sx={{ boxShadow: 'none', mt: 3, border: theme => `2px solid ${theme.palette.primary.main}` }}>
          <AttachFileModalWithTable
            addNewFile={true}
            openModalFile={openModalFile}
            setopenModalFile={setopenModalFile}
            formInput={formInputFile}
            setFormInput={setformInputFile}
            arrayDocuments={data?.documents || []}
            uploadDocument={uploadDocumentToCient}
            maxHeight='100%'
            authorizeDelete={false}
            showInputName={true}
            border={'none'}
            showDivider={true}
            paddingTitle={'10px'}
            isLoading={uploadDocumentToCientMutation.isPending}
            formErrors={formErrorsFiles}
            deleteDocument={deleteDocument}
            deleteSpecificVersion={deleteSpecificVersion}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <TabsDetailsClient
          tabsDocumentTitle={'Client'}
          dataDetails={data}
          formInput={formInput}
          formErrors={formErrors}
          listTypeDocumentClient={listTypeDocumentClient}
        />
      </Grid>
    </Grid>
  )
}

export default DetailsClient
