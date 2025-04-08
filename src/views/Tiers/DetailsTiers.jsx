import React, { useState } from 'react'

import { useRouter } from 'next/router'
import { Grid, Card, CardContent, Box, Typography, CardHeader, Divider } from '@mui/material'

import {
  useDeleteDocumentCompanySpecificVersion,
  useDeleteDocumentForCompany,
  useDeleteTiers,
  useDisabledTiers,
  useGetDetailTiers,
  useUploadDocumentForCompany
} from 'src/services/tiers.service'
import UserViewCardDetails from '../components/Cards/UserViewCardDetails'
import TabsDetailsClient from '../clients/TabsDetailsClient'
import TabsDetailsEntites from '../components/tabs/TabsDetailsEntites'
import { useGetDetailCompany, useGetListQualification } from 'src/services/company.service'
import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'
import { dateFormater, dateFormaterWithTime } from 'src/@core/utils/utilities'

const DetailsTiers = ({ path, profile }) => {
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

  // query
  const { data, isLoading } = useGetDetailCompany({ id, profile: profile })
  const { data: listQualifications, isLoading: loadingQualification } = useGetListQualification({ type: '2' })

  const uploadDocumentToCompanyMutation = useUploadDocumentForCompany({ id })
  const deleteUserMutation = useDeleteTiers()
  const disabledUserMutation = useDisabledTiers()
  const deleteDocumentCompanyMutation = useDeleteDocumentForCompany()
  const deleteSpecificVersionDocumentThirdPartyMutation = useDeleteDocumentCompanySpecificVersion()

  // function
  const uploadDocumentToTiers = async nameOfVersion => {
    const formData = new FormData()

    for (let key in formInputFile) {
      if (key == 'files') {
        formInputFile?.files?.map((file, index) => {
          // formData.append(`signature`, file)
          formData.append(`documents[${index}][file]`, file?.file)

          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else if (nameOfVersion !== undefined) {
            formData.append(`documents[${index}][name]`, nameOfVersion)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      }
    }

    try {
      await uploadDocumentToCompanyMutation.mutateAsync(formData)
      setopenModalFile(false)
      setFormInput({ ...formInput, files: [] })
      setformInputFile({ ...formInputFile, files: [] })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const deleteTiers = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: id })
      }
      router.push('/Tiers')
    } catch (error) {}
  }

  const handleDisabled = () => {
    setDisabledDialogOpen(true)
  }

  const disabledTiers = async event => {
    setDisabledDialogOpen(false)
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      if (path == '/entreprise') {
        router.push('/entreprise')
      } else {
        router.push('/Tiers')
      }
    } catch (error) {}
  }

  const deleteDocument = async idDoc => {
    try {
      await deleteDocumentCompanyMutation.mutateAsync({ id: idDoc })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const deleteSpecificVersion = async idVersion => {
    try {
      await deleteSpecificVersionDocumentThirdPartyMutation.mutateAsync({ id: idVersion })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <UserViewCardDetails
          dataDetails={data}
          path={path}
          isLoading={isLoading}
          handleDelete={handleDelete}
          handleDisabled={handleDisabled}
          disabledUser={disabledTiers}
          deleteUser={deleteTiers}
          deleteUserMutation={deleteUserMutation}
          disabledUserMutation={disabledUserMutation}
          state={data?.state}
          resource={'tiers'}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <Card sx={{ minHeight: '100%' }}>
          <CardContent>
            <TabsDetailsEntites
              tabsDocumentTitle={path}
              dataDetails={data}
              uploadDocuments={uploadDocumentToTiers}
              formInput={formInput}
              setFormInput={setFormInput}
              formErrors={formErrors}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Box display='flex' flexDirection='column' gap={2}>
          <Card>
            <CardContent>
              <AttachFileModalWithTable
                openModalFile={openModalFile}
                setopenModalFile={setopenModalFile}
                formInput={formInputFile}
                setFormInput={setformInputFile}
                arrayDocuments={data?.documents || []}
                uploadDocument={uploadDocumentToTiers}
                maxHeight='100%'
                deleteDocument={deleteDocument}
                deleteSpecificVersion={deleteSpecificVersion}
                authorizeDelete={true}
                showInputName={true}
                border={'none'}
                showDivider={true}
                paddingTitle={'0'}
                formErrors={formErrorsFiles}
                onlyOthers={true}
              />
            </CardContent>
          </Card>
          {data?.profile !== 'MAN' && (
            <Card>
              <CardContent>
                <CardHeader
                  title={
                    <>
                      <Typography color='#4c4e64de' fontSize={'15px'} sx={{ fontWeight: '600' }}>
                        RGE
                      </Typography>
                      <Divider />
                    </>
                  }
                  className='!pt-3 !pb-1'
                  titleTypographyProps={{ fontSize: '15px !important', fontWeight: '600 !important' }}
                />
                {data?.rges?.map((item, index) => (
                  <Box key={index} mb={2}>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='body1'>{item?.rge}</Typography>
                      <Box display='flex' alignItems='center'>
                        {item?.qualifications?.map((qualif, index) => (
                          <>
                            <Typography key={index} variant='body2' color='text.secondary'>
                              {listQualifications?.find(qualifItem => qualifItem?.id == qualif)?.entitled}
                            </Typography>
                            {index !== item?.qualifications?.length - 1 && (
                              <Typography mx={1} variant='body2' color='text.secondary'>
                                |
                              </Typography>
                            )}
                          </>
                        ))}
                      </Box>
                    </Box>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='body2' color='text.secondary'>
                        {dateFormater(item?.start_date)}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {dateFormater(item?.end_date)}
                      </Typography>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default DetailsTiers
