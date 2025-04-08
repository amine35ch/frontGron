// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Card, CardContent, CircularProgress, IconButton, TextField, Typography } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'

// ** Third Party Imports

// ** Icon Imports

// ** Custom Components Imports
import AppCalendar from 'src/components/calendar'

// ** Styled Components
import CustomStepper from 'src/components/CustomStepper'
import BtnNext from 'src/components/BtnNext'
import BtnPrevious from 'src/components/BtnPrevious'
import {
  useDecideEndProject,
  useDeleteDocumentProject,
  useDeleteDocumentProjectSpecificVersion,
  useGetDetailProject,
  useGetListStepsForProject,
  useSendAnahFolder,
  useUpdateProject,
  useUploadDocumentToProject,
  useUploadGeneralDocumentToProject
} from 'src/services/project.service'
import { useRouter } from 'next/router'
import { useGoToNextStepInProject, useGoToPrevStepInProject } from 'src/services/steps.service'

import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'

// import CustomCalendar from 'src/components/CustomCalendar'
import useTabs from 'src/hooks/useTabs'

import DetailsProject from '../detailsProject/DetailsProject'
import StepContainer from './StepContainer'
import StepsSideBar from '../components/stepsSideBar'
import ProjectSteperSkeleton from './ProjectSteperSkeleton'
import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

const StepperProject = React.memo(() => {
  const router = useRouter()
  const { id } = router.query
  const { initTabs, activeTab } = useTabs()
  const { user } = useAuth()

  // ** States
  const [activeStep, setActiveStep] = useState(null)
  const [prevStep, setprevStep] = useState(null)
  const [nextStep, setnextStep] = useState(null)
  const [nameActiveStep, setNameActiveStep] = useState(null)
  const [activeStepError, setActiveStepError] = useState(null)
  const [stepError, setStepError] = useState(false)
  const [clearedStep, setClearedStep] = useState(1)
  const [formErrors, setFormErrors] = useState(null)
  const [formErrorsFile, setFormErrorsFile] = useState(null)
  const [processEnded, setProcessEnded] = useState(null)
  const [openModalFile, setopenModalFile] = useState(false)

  const [formInput, setFormInput] = useState({
    d_client_id: '',
    project_type: 0,
    process: 0,
    performance_energy_before_work: '',
    project_residence: '',
    project_nature: '',
    project_income_class: '',
    demande_project: '',
    d_third_party_id: null,
    operations: [],
    files: [],
    anah_folder: null
  })

  // ** Query
  const { data: listSteps, isSuccess } = useGetListStepsForProject({ id })
  const sendAnahFolderMutation = useSendAnahFolder({ id })

  const {
    data: detailsProject,
    isLoading: getDetailsIsLoading,
    isSuccess: getDetailsIsSuccess,
    isFetching: getDetailsIsFetching,
    isRefetching: getDetailsIsRefetching,
    refetch: refetchProject
  } = useGetDetailProject({ id })

  const nextStepMutation = useGoToNextStepInProject({ id })
  const prevStepMutation = useGoToPrevStepInProject({ id })
  const uploadGeneralDocumentMutation = useUploadGeneralDocumentToProject({ id })
  const decideEndProjectMutation = useDecideEndProject({ id })
  const deleteProjectDocument = useDeleteDocumentProject()
  const deleteProjectVersionDocument = useDeleteDocumentProjectSpecificVersion()

  // Handle Stepper
  useEffect(() => {
    if (getDetailsIsSuccess && !getDetailsIsFetching) {
      const tabs =
        detailsProject.project_type === 0
          ? [{ label: 'Information ménage', disabled: false }]
          : [
              { label: 'Information ménage', disabled: false },
              { label: detailsProject?.step?.display_name, disabled: detailsProject?.state === 3 ? true : false },
              { label: 'Calendrier', disabled: detailsProject?.state === 3 ? true : false }
            ]
      setFormInput({
        ...formInput,
        anah_folder: detailsProject?.anah_folder?.anah_folder
      })
      initTabs(
        tabs,
        detailsProject.project_type === 0 ? 0 : detailsProject?.state === 3 ? 0 : 1,
        `/projects/${id}/edit`,
        `/projects/[id]/`
      )

      setProcessEnded(detailsProject?.state === 3)
      setActiveStep(detailsProject?.step?.order)
      setNameActiveStep(detailsProject?.step?.display_name)
      setnextStep(detailsProject?.next_step?.id)
      setprevStep(detailsProject?.prev_step?.id)
      setClearedStep(detailsProject?.cleared_step_order)
    }
  }, [getDetailsIsSuccess, getDetailsIsFetching])

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const uploadDocumentToProject = async () => {
    const formData = new FormData()
    const files = formInput.files

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
      await uploadGeneralDocumentMutation.mutateAsync(formData)
      setFormInput({
        ...formInput,
        files: []
      })
      setopenModalFile(false)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors

      setFormErrorsFile(errorsObject)
    }
  }

  const onSubmitNextStep = async () => {
    try {
      // if (formInput?.files.length !== 0) {
      //   uploadDocumentToProject()
      // }

      await nextStepMutation.mutateAsync()

      // setActiveStep(activeStep + 1)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const onSubmitPrevStep = async () => {
    try {
      await prevStepMutation.mutateAsync()

      // setActiveStep(activeStep - 1)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handlePrevStepSecond = async () => {
    if (detailsProject?.step?.decision) {
      try {
        await decideEndProjectMutation.mutateAsync()
      } catch (error) {}

      return null
    }

    try {
      await prevStepMutation.mutateAsync()

      setActiveStep(activeStep - 1)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const onSubmitAnahFolder = async () => {
    const data = {
      anah_folder: formInput?.anah_folder
    }

    try {
      await sendAnahFolderMutation.mutateAsync(data)
    } catch (error) {}
  }

  const deleteDocument = async idDoc => {
    try {
      await deleteProjectDocument.mutateAsync({ id: idDoc })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const deleteSpecificVersion = idVersion => {
    try {
      deleteProjectVersionDocument.mutateAsync({ id: idVersion })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }
  
return (
    <>
      {getDetailsIsLoading ? (
        <ProjectSteperSkeleton />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            display: 'flex',
            minHeight: '95vh'
          }}
        >
          <Grid container>
            {activeTab === 1 ? (
              <Grid item xs={12} md={0.3}>
                <StepsSideBar
                  isLoading={getDetailsIsFetching}
                  id={detailsProject?.id}
                  clearedStep={clearedStep}
                  currentStep={activeStep}
                  steps={listSteps ? listSteps : []}
                  changeBetweenStep={true}
                  detailsProject={detailsProject}
                />
              </Grid>
            ) : null}
            <Grid item xs={12} md={11.7}>
              <TabContext value={activeTab}>
                <Card sx={{ border: 0, width: '100%', height: '100%' }}>
                  <CardContent sx={{ width: '100%', height: '100%' }}>
                    <TabPanel value={0}>
                      <DetailsProject detailsProject={detailsProject} />
                    </TabPanel>
                    <TabPanel value={1}>
                      <Grid container>
                        <Grid container xs={12}>
                          <Grid item xs={2}>
                            {getDetailsIsSuccess ? (
                              <BtnPrevious
                                disabled={detailsProject?.prev_step?.authorized}
                                activeStep={activeStep}
                                handleBack={handleBack}
                                isLoading={prevStepMutation?.isPending}
                                processEnded={processEnded}
                                onSubmitPrevStep={onSubmitPrevStep}
                                titleBtn='Retour'
                              />
                            ) : null}
                          </Grid>
                          <Grid item xs={8}>
                            <CustomStepper
                              activeStep={activeStep}
                              steps={listSteps ? listSteps : []}
                              activeStepError={activeStepError}
                              stepError={stepError}
                              currentStep={detailsProject?.step?.ordre}
                              prevStep={prevStep}
                              nextStep={nextStep}
                              detailsProject={detailsProject}
                            />
                          </Grid>
                          <Grid item xs={2} className='flex justify-end'>
                            {getDetailsIsSuccess ? (
                              <BtnNext
                                disabled={detailsProject?.next_step?.authorized}
                                isLoading={nextStepMutation?.isPending}
                                handleNext={onSubmitNextStep}
                                processEnded={processEnded}
                                titleBtn={detailsProject?.step?.next_entitled_btn}
                              />
                            ) : null}
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider className='my-3' />
                        </Grid>
                        <Grid container item xs={12} alignItems='center'>
                          <Box display='flex' alignItems='center'>
                            <Typography
                              xs={2}
                              textTransform={'uppercase'}
                              variant='h5'
                              sx={{ color: 'primary.main', mr: 2, width: '100%' }}
                            >
                              N° Dossier Anah
                            </Typography>
                            <TextField
                              placeholder='N° Dossier Anah'
                              size='small'
                              variant='standard'
                              sx={{ fontSize: '10px !important', width: '15rem' }}
                              error={formErrors?.anah_folder}
                              value={formInput?.anah_folder}
                              disabled={detailsProject?.anah_folder?.editable ? false : true}
                              onChange={e => {
                                setFormInput({
                                  ...formInput,
                                  anah_folder: e.target.value
                                })
                              }}
                              fullWidth
                            />
                            {detailsProject?.anah_folder?.editable ? (
                              sendAnahFolderMutation?.isPending ? (
                                <Box ml={5}>
                                  <CircularProgress size={20} />
                                </Box>
                              ) : (
                                <IconButton aria-label='send' onClick={onSubmitAnahFolder}>
                                  <IconifyIcon icon={'mdi:content-save'} color='#86A039' fontSize={'28px'} />
                                </IconButton>
                              )
                            ) : null}
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider className='my-3' />
                        </Grid>
                        <Grid item xs={12}>
                          <StepContainer
                            listSteps={listSteps}
                            isSuccess={isSuccess}
                            nameActiveStep={nameActiveStep}
                            detailsProject={detailsProject}
                            refetchProject={refetchProject}
                          />
                          <div className='mt-20'>
                            {detailsProject?.step?.reference !== 'StepDepotAnnah' && (
                              <AttachFileModalWithTable
                                openModalFile={openModalFile}
                                setopenModalFile={setopenModalFile}
                                formInput={formInput}
                                setFormInput={setFormInput}
                                arrayDocuments={detailsProject?.documents || []}
                                uploadDocument={uploadDocumentToProject}
                                authorizeDelete={user?.role?.includes('::admin')}
                                showInputName={true}
                                formErrors={formErrorsFile}
                                deleteDocument={deleteDocument}
                                deleteSpecificVersion={deleteSpecificVersion}
                                isLoading={uploadGeneralDocumentMutation.isPending}
                                detailsProject={detailsProject}
                              />
                            )}
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container item mt={15} xs={12}>
                        <Grid item xs={4}>
                          {getDetailsIsSuccess ? (
                            <BtnPrevious
                              disabled={detailsProject?.prev_step?.authorized}
                              activeStep={activeStep}
                              isLoading={prevStepMutation?.isPending}
                              handleBack={handleBack}
                              processEnded={processEnded}
                              onSubmitPrevStep={handlePrevStepSecond}
                              currentStep={detailsProject?.step}
                            />
                          ) : null}
                        </Grid>
                        <Grid item xs={4} className='flex justify-center'></Grid>
                        <Grid item xs={4} className='flex justify-end'>
                          {getDetailsIsSuccess ? (
                            <BtnNext
                              disabled={detailsProject?.next_step?.authorized}
                              isLoading={nextStepMutation?.isPending}
                              handleNext={onSubmitNextStep}
                              processEnded={processEnded}
                              titleBtn={detailsProject?.step?.next_entitled_btn}
                            />
                          ) : null}
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value={2}>
                      <AppCalendar project={id} />
                    </TabPanel>
                  </CardContent>
                </Card>
              </TabContext>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  )
})

export default StepperProject
