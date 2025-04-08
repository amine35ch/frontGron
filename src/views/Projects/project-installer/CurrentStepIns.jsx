import { Box, CircularProgress, Divider, Grid, IconButton, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import CustomAccordian from 'src/components/CustomAccordian'
import useTabs from 'src/hooks/useTabs'
import { useSendAnahFolder } from 'src/services/project.service'
import Simulator from 'src/views/simulator'
import ProjectVisitColum from 'src/views/project-visit/ProjectVisitColum'
import StepDocuments from 'src/components/StepDocuments'
import IconifyIcon from 'src/@core/components/icon'
import DevisTravaux from 'src/views/DevisTravaux/DevisTravaux'
import CustomChip from 'src/@core/components/mui/chip'

import PrevWrokDate from '../form/PrevWrokDate'
import { useAuth } from 'src/hooks/useAuth'
import { useGetListCompany } from 'src/services/company.service'
import Visit from '../stepperProject/steps/Visit'
import BtnColorSecondary from 'src/components/BtnColorSecondary'
import { useCreateProjectVisit } from 'src/services/projectVisit.service'
import moment from 'moment/moment'
import ProjectVisiteTable from '../components/ProjectVisiteTable'
import useStates from 'src/@core/hooks/useStates'
import { LoadingButton } from '@mui/lab'
import { useForwardStep, useGoToNextStepInProject } from 'src/services/steps.service'

const CurrentStepIns = ({ detailsProject, getDetailsIsLoading, getDetailsIsSuccess, getDetailsIsFetching }) => {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = router.query
  const [clearedStep, setClearedStep] = useState(1)
  const [activeStep, setActiveStep] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const visit = detailsProject?.visits?.find(visit => visit?.type?.type === 0)
  const ListCompanies = [detailsProject?.installer, detailsProject?.mar]
  const { getStateByModel } = useStates()

  const goToNextStepInProjectMutation = useGoToNextStepInProject({ id })

  const defaultCompany =
    visit === undefined
      ? user?.company?.trade_name
      : visit?.d_company_id === user?.company?.id
      ? user?.company?.trade_name
      : null

  const [formInputMar, setFormInputMar] = useState({
    name: 'Visite entreprise Retenue',
    type: 0,
    user_id: visit?.user?.id || '',
    d_company_id: visit?.d_company_id || user?.company?.id,
    state: visit?.state,
    visit_date: visit?.visit_date || moment(new Date()).format('YYYY-MM-DD hh:mm')
  })

  const [formInput, setFormInput] = useState({
    anah_folder: null
  })

  // const { addTabs, activeTab, clearTabs, setActiveTab } = useTabs()
  const { initTabs, activeTab } = useTabs()

  const sendAnahFolderMutation = useSendAnahFolder({ id })
  const forwardStepMutation = useForwardStep({ id })

  // const { data: listProjectVisit } = useGetProjectVisitForProjects({ id })
  // const nextStepMutation = useGoToNextStepInProject({ id })

  //**************** */ QUERY
  const createProjectVisitMutation = useCreateProjectVisit({})

  const projectVisitColumn = ProjectVisitColum({
    userRole: user.role.slice(5),
    resource: 'project-visit'
  })

  useEffect(() => {
    if (getDetailsIsSuccess && !getDetailsIsFetching) {
      // setProcessEnded(detailsProject?.state === 3)
      setActiveStep(detailsProject?.cleared_step_order)

      setClearedStep(detailsProject?.cleared_step_order)
    }
  }, [getDetailsIsSuccess, getDetailsIsFetching])

  useEffect(() => {
    detailsProject &&
      setFormInput({
        anah_folder: detailsProject?.anah_folder?.anah_folder
      })
  }, [getDetailsIsSuccess])

  const hideSimulatorButton = useMemo(() => {
    return detailsProject?.documents?.find(item => item?.p_document_id === 4 && item?.status === 3)?.status
      ? true
      : false
  }, [getDetailsIsSuccess])

  const { data: listCollaborators } = useGetListCompany({
    profile: 'users/inspectors',
    state: 1
  })

  const onSubmitAnahFolder = async () => {
    const data = {
      anah_folder: formInput?.anah_folder
    }

    try {
      await sendAnahFolderMutation.mutateAsync(data)
    } catch (error) {}
  }

  const handleSaveVisit = async () => {
    try {
      await createProjectVisitMutation.mutateAsync({
        d_project_id: id,
        visits: [formInputMar]
      })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleforwardStep = async id => {
    try {
      await forwardStepMutation.mutateAsync(id)
    } catch (error) {}
  }

  const handleNextStep = async id => {
    try {
      await goToNextStepInProjectMutation.mutateAsync(id)
    } catch (error) {}
  }

  return (
    <Grid container spacing={2} p={5}>
      <Grid item xs={12} md={12}>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            display: 'flex',
            px: 4,
            mb: 4
          }}
        >
          <Grid container item xs={12}>
            <Grid item xs={12} display={'flex'} mt={3} justifyContent={'end'} mb={3}>
              <CustomChip
                skin='light'
                color={'primary'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.9rem',
                  height: '26px'
                }}
                label={detailsProject?.cleared_step?.display_name}
              />
            </Grid>
            {detailsProject?.cleared_step_order == 5 && (
              <Grid item xs={12} display={'flex'} mt={3} justifyContent={'end'} mb={3}>
                <Box ml={2}>
                  <CustomChip
                    skin='light'
                    color={getStateByModel('DProjectVisit', visit?.state)?.color}
                    sx={{
                      fontWeight: '600',
                      fontSize: '.9rem',
                      height: '26px'
                    }}
                    label={getStateByModel('DProjectVisit', visit?.state)?.name}
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography textTransform={'uppercase'} variant='h5' sx={{ color: 'primary.main', mt: 4, mb: 4 }}>
                N° Dossier Anah
              </Typography>
            </Grid>
            <Grid container item xs={6} display={'flex'}>
              <Grid item my={2} xs={4} display={'flex'} alignItems={'center'}>
                <TextField
                  placeholder='N° Dossier Anah'
                  size='small'
                  variant='standard'
                  sx={{ fontSize: '10px !important', width: '6rem' }}
                  value={formInput?.anah_folder}
                  disabled={detailsProject?.anah_folder?.editable ? false : true}
                  onChange={e => {
                    setFormInput({
                      ...formInput,
                      anah_folder: e.target.value
                    })
                  }}
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
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mx: 4 }} />
        {detailsProject?.cleared_step_order !== 8 &&
          detailsProject?.cleared_step_order !== 4 &&
          detailsProject?.cleared_step_order !== 5 &&
          detailsProject?.cleared_step_order !== 6 &&
          detailsProject?.cleared_step_order !== 1 && (
            <Box mt={25} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
              <img src={'/images/pages/waiting.png'} width={100} alt='waiting' />

              <Typography variant='h5' sx={{ mt: 6 }}>
                {detailsProject?.cleared_step?.init_state_message}{' '}
              </Typography>
            </Box>
          )}
        {/* {detailsProject?.cleared_step_order == 10 && detailsProject?.accordions?.start_work ? (
          <CustomAccordian open={true} titleAccordian={'Début de travaux'}>
            <Grid container spacing={2} p={5} pt={10}>
              <Grid item xs={12} mt={3}>
                <PrevWrokDate
                  id={detailsProject?.id}
                  detailsProject={detailsProject}
                  titleBtn={'Enregistrer'}
                  variant={'contained'}
                  color='primary'
                  disabled={!detailsProject?.accordions?.save_work_date_prevu}
                />
              </Grid>
            </Grid>
          </CustomAccordian>
        ) : null} */}
        {detailsProject?.cleared_step_order == 8 ? (
          <>
            {user?.company?.quotation_interne == 1 ? (
              <DevisTravaux
                id={detailsProject?.id}
                detailsProject={detailsProject}
                getDetailsIsLoading={getDetailsIsLoading}
                editableUser={false}
              />
            ) : (
              <CustomAccordian titleAccordian={'Devis Entreprise retenue'}>
                <Grid container spacing={2} p={5}>
                  <StepDocuments
                    typeProject={detailsProject?.type}
                    stepDocuments={detailsProject?.step_documents}
                    id={detailsProject?.id}
                    detailsProject={detailsProject}
                  />
                </Grid>
              </CustomAccordian>
            )}
          </>
        ) : null}
        {detailsProject?.cleared_step_order == 6 ? (
          <CustomAccordian open={true} titleAccordian={'Vérification des documents'}>
            <Grid container spacing={2} p={5}>
              <Grid item xs={12}>
                <StepDocuments
                  typeProject={detailsProject?.type}
                  stepDocuments={detailsProject?.step_documents}
                  id={detailsProject?.id}
                  detailsProject={detailsProject}
                />
              </Grid>
            </Grid>
          </CustomAccordian>
        ) : null}
        {detailsProject?.cleared_step_order == 4 && detailsProject?.accordions?.visits ? (
          <>
            <CustomAccordian open={true} titleAccordian={'RENDEZ-VOUS'}>
              <Grid container spacing={2} p={5}>
                <Grid item xs={12}>
                  <Visit
                    disabled={visit?.state === 3 || (visit && visit?.d_company_id !== user?.company?.id)}
                    defaultCompany={defaultCompany}
                    ListCompanies={ListCompanies}
                    collaboratorsList={listCollaborators}
                    displayName={''}
                    detailsProject={detailsProject}
                    visit={formInputMar}
                    visitDetails={visit}
                    displayOption={'trade_name'}
                    collaboratorsDisplayOption={'full_name'}
                    disableCollaborator={visit && visit?.d_company_id !== user?.company?.id}
                    setVisit={setFormInputMar}
                    titleTypeAudit={'1ère visite Mar'}
                    title={'Planifier la premiere visite (Entreprise Retenue / Accompagnateur rénov)'}
                    formErrors={formErrors}
                  />
                </Grid>
                <Grid item xs={12} className='!my-2 flex justify-end'>
                  <BtnColorSecondary
                    disabled={visit?.state === 3 || (visit && visit?.d_company_id !== user?.company?.id)}
                    action={handleSaveVisit}
                    title='Enregistrer'
                    isLoading={createProjectVisitMutation?.isPending}
                  />
                </Grid>
              </Grid>
            </CustomAccordian>
            <Box textAlign={'end'}>
              <LoadingButton
                variant='contained'
                color='primary'
                loading={goToNextStepInProjectMutation?.isPending}
                loadingPosition='start'
                size='small'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleNextStep()}
                endIcon={<IconifyIcon icon='material-symbols:double-arrow' />}
              >
                Suivant
              </LoadingButton>
            </Box>
          </>
        ) : null}
        {detailsProject?.cleared_step_order == 5 ? (
          <Grid container spacing={2} p={5}>
            {/* <Grid item xs={12}>
              <CustomAccordian open={true} titleAccordian={'Liste des Visites'}>
                <Box mt={5} />
                <ProjectVisiteTable projectVisitColumn={projectVisitColumn} listProjectVisit={detailsProject?.visits} />
              </CustomAccordian>
            </Grid> */}
            <Grid item xs={12}>
              <CustomAccordian open={true} titleAccordian={'Liste des Documents'}>
                <StepDocuments
                  typeProject={detailsProject?.type}
                  stepDocuments={detailsProject?.step_documents}
                  id={detailsProject?.id}
                  detailsProject={detailsProject}
                />
              </CustomAccordian>
            </Grid>
          </Grid>
        ) : null}

        {detailsProject?.cleared_step_order == 1 && detailsProject?.accordions?.simulation ? (
          <>
            {detailsProject?.documents?.filter(item => item.reference === 'simulationData').length > 0 ? (
              <CustomAccordian open={false} titleAccordian={'Document de Simulation'}>
                <Grid container spacing={2} p={5}>
                  <Grid item xs={12}>
                    <StepDocuments
                      typeProject={detailsProject?.type}
                      stepDocuments={
                        detailsProject?.documents?.filter(item => item.reference === 'simulationData') ?? []
                      }
                      id={detailsProject?.id}
                      detailsProject={detailsProject}
                    />
                  </Grid>
                </Grid>
              </CustomAccordian>
            ) : null}
            <>
              <CustomAccordian open={true} titleAccordian={'Simulation'}>
                <Grid container spacing={2} p={5}>
                  <Grid item xs={12}>
                    <Simulator hideButton={hideSimulatorButton} detailsProject={detailsProject} />
                  </Grid>
                </Grid>
              </CustomAccordian>
              <Box textAlign={'end'}>
                <LoadingButton
                  variant='contained'
                  color='primary'
                  loading={forwardStepMutation?.isPending}
                  loadingPosition='start'
                  size='small'
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  onClick={() => handleforwardStep()}
                  endIcon={<IconifyIcon icon='material-symbols:double-arrow' />}
                >
                  Suivant
                </LoadingButton>
              </Box>
            </>
          </>
        ) : null}
      </Grid>
    </Grid>
  )
}

export default CurrentStepIns
