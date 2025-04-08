import { LoadingButton, TabContext, TabPanel } from '@mui/lab'
import { Box, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { use, useEffect, useMemo, useState } from 'react'
import CustomAccordian from 'src/components/CustomAccordian'
import useTabs from 'src/hooks/useTabs'
import {
  useGetDetailProject,
  useGetListStepsForProject,
  useGetProjectVisitForProjects,
  useSendAnahFolder
} from 'src/services/project.service'
import Simulator from 'src/views/simulator'
import ProjectVisiteTable from '../components/ProjectVisiteTable'
import ProjectVisitColum from 'src/views/project-visit/ProjectVisitColum'
import StepDocuments from 'src/components/StepDocuments'
import DetailsProject from '../detailsProject/DetailsProject'
import IconifyIcon from 'src/@core/components/icon'
import DevisTravaux from 'src/views/DevisTravaux/DevisTravaux'
import CustomChip from 'src/@core/components/mui/chip'
import { useForwardStep, useGoToNextStepInProject } from 'src/services/steps.service'

import PrevWrokDate from '../form/PrevWrokDate'
import StepsSideBar from '../components/stepsSideBar'
import { useAuth } from 'src/hooks/useAuth'
import StepAppointmentMarAndTech from '../stepperProject/steps/StepAppointmentMarAndTech'
import { useGetListCompany } from 'src/services/company.service'
import CurrentStepIns from './CurrentStepIns'
import BtnColorSecondary from 'src/components/BtnColorSecondary'
import Visit from '../stepperProject/steps/Visit'
import moment from 'moment'
import { useCreateProjectVisit, useTerminateProjectVisit } from 'src/services/projectVisit.service'
import useStates from 'src/@core/hooks/useStates'

const DetailsProjectIns = ({}) => {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = router.query
  const [clearedStep, setClearedStep] = useState(1)
  const [activeStep, setActiveStep] = useState(null)
  const { getStateByModel } = useStates()

  const [formInput, setFormInput] = useState({
    anah_folder: null
  })
  const [visit, setVisit] = useState({})
  const [statusDocPréco, setStatusDocPréco] = useState(null)

  // const visit = detailsProject?.visits?.find(visit => visit.type.type === 0)

  const [formInputMar, setFormInputMar] = useState({
    name: '1ère visite Mar',
    type: 0,
    user_id: '',
    d_company_id: '',
    state: 0,
    visit_date: visit?.visit_date || moment(new Date()).format('YYYY-MM-DD hh:mm')
  })
  const [formErrors, setFormErrors] = useState({})

  // const { addTabs, activeTab, clearTabs, setActiveTab } = useTabs()
  const { initTabs, activeTab, setActiveTab } = useTabs()

  const { data: listSteps, isSuccess } = useGetListStepsForProject({ id })

  // ** react query
  const {
    data: detailsProject,
    isLoading: getDetailsIsLoading,
    isSuccess: getDetailsIsSuccess,
    isFetching: getDetailsIsFetching,
    isRefetching: getDetailsIsRefetching
  } = useGetDetailProject({ id })

  //**************** */ QUERY
  const createProjectVisitMutation = useCreateProjectVisit({})

  const sendAnahFolderMutation = useSendAnahFolder({ id })
  const { data: listProjectVisit } = useGetProjectVisitForProjects({ id })
  const nextStepMutation = useGoToNextStepInProject({ id })
  const terminateProjectVisitMutation = useTerminateProjectVisit()

  const ListCompanies = [detailsProject?.installer, detailsProject?.mar]

  const defaultCompany =
    visit === undefined
      ? user?.company?.trade_name
      : visit?.d_company_id === user?.company?.id
      ? user?.company?.trade_name
      : null

  const projectVisitColumn = ProjectVisitColum({
    userRole: user.role.slice(5),
    resource: 'project-visit'
  })

  useEffect(() => {
    if (getDetailsIsSuccess && !getDetailsIsFetching) {
      let tabs = []

      if (Number(detailsProject?.step?.order) <= 6) {
        tabs = [
          { label: 'Information ménage', disabled: false },
          {
            label: `${detailsProject?.works?.length == 0 ? 'Simulation' : 'Première visite'}`,
            disabled: false
          },
          { label: 'Information Dossier', disabled: false }
        ]
      } else {
        tabs = [
          { label: 'Information ménage', disabled: false },
          {
            label: `Etape Actuelle`,
            disabled: false
          },
          { label: 'Information Dossier', disabled: false }
        ]
      }

      initTabs(tabs, 1, `/projects/${id}/edit`, `/projects/[id]/`)

      // setProcessEnded(detailsProject?.state === 3)
      setActiveStep(detailsProject?.step?.order)

      setClearedStep(detailsProject?.cleared_step_order)
      const localVisit = detailsProject?.visits?.find(visit => visit.type.type === 0)
      setVisit(localVisit)
      setFormInputMar({
        name: 'Visite entreprise Retenue',
        type: 0,
        user_id: localVisit?.user?.id || '',
        d_company_id: localVisit?.d_company_id || user?.company?.id,
        state: localVisit?.state || 0,
        visit_date: localVisit?.visit_date || moment(new Date()).format('YYYY-MM-DD hh:mm')
      })
      const docPréco = detailsProject?.documents?.find(item => item.type === 5)
      setStatusDocPréco(docPréco?.status)
    }
  }, [detailsProject, getDetailsIsSuccess, getDetailsIsFetching])

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
    profile: 'users',
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

  const handleTerminateProjectVisit = async id => {
    try {
      await terminateProjectVisitMutation.mutateAsync(id)
    } catch (error) {}
  }

  return getDetailsIsLoading ? (
    <Box
      sx={{
        py: 6,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        minHeight: '85vh'
      }}
    >
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Chargement...</Typography>
    </Box>
  ) : (
    <TabContext value={activeTab}>
      <TabPanel value={0}>
        <DetailsProject detailsProject={detailsProject} />
      </TabPanel>
      <TabPanel value={1}>
        {Number(detailsProject?.step?.order) > 6 && (
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              display: 'flex',
              minHeight: '85vh'
            }}
          >
            <CurrentStepIns detailsProject={detailsProject} getDetailsIsSuccess={getDetailsIsSuccess} />
          </Box>
        )}

        {Number(detailsProject?.step?.order) <= 6 && (
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              display: 'flex',
              minHeight: '95vh',
              px: 6
            }}
          >
            <Grid container spacing={2}>
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
                      {detailsProject?.visits[0]?.state == 3 ? (
                        <Box
                          p={4}
                          sx={{
                            mb: 1.5,
                            width: '30%',
                            backgroundColor: '#FFF6E5',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Grid container spacing={4}>
                            <Grid item xs={1.5}>
                              {statusDocPréco == 4 ? (
                                <IconifyIcon icon='ci:check-all' fontSize='35px' color={'#e3a224'} />
                              ) : (
                                <IconifyIcon icon='fluent:alert-on-20-filled' fontSize='35px' color={'#e3a224'} />
                              )}
                            </Grid>
                            <Grid item xs={10}>
                              {' '}
                              <div className='flex items-center '>
                                {statusDocPréco == 4 ? (
                                  <Typography sx={{ color: '#e3a224', fontWeight: '700', fontSize: '15px' }}>
                                    Les documents ont bien été attachés, en attendant la validation du MAR et l'audit
                                  </Typography>
                                ) : (
                                  <Typography sx={{ color: '#e3a224', fontWeight: '700', fontSize: '15px' }}>
                                    La visite est terminée, en attendant que MAR vérifie ces documents, merci d'ajouter
                                    la préconisation
                                  </Typography>
                                )}
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      ) : (
                        <CustomChip
                          skin='light'
                          color={'primary'}
                          sx={{
                            fontWeight: '600',
                            fontSize: '.9rem',
                            height: '26px'
                          }}
                          label={`${
                            detailsProject?.works?.length == 0
                              ? 'Simulation'
                              : detailsProject?.visits?.length == 0
                              ? 'Planification de(s) 1ére(s) visite(s)'
                              : '1ére visite'
                          }`}
                        />
                      )}
                    </Grid>
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
                {detailsProject?.works?.length == 0 ? (
                  <CustomAccordian open={true} titleAccordian={'Simulation'}>
                    <Grid container spacing={2} p={5}>
                      <Grid item xs={12}>
                        <Simulator hideButton={hideSimulatorButton} detailsProject={detailsProject} />
                      </Grid>
                    </Grid>
                  </CustomAccordian>
                ) : (
                  <>
                    <CustomAccordian open={visit?.state === 3 ? false : true} titleAccordian={'RENDEZ-VOUS'}>
                      <Grid container spacing={2} p={5}>
                        <Grid item xs={12}>
                          <Box display='flex'>
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
                              title={'Planifier la premiere visite'}
                              formErrors={formErrors}
                              titleAction={
                                <>
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
                                </>
                              }
                            />

                            {visit && visit?.state !== 3 && (
                              <LoadingButton
                                disabled={visit?.state === 3 || (visit && visit?.d_company_id !== user?.company?.id)}
                                variant='outlined'
                                color='success'
                                loading={terminateProjectVisitMutation?.isPending}
                                loadingPosition='start'
                                sx={{ fontSize: '12px', marginTop: 14, height: 33 }}
                                size='small'
                                startIcon={<IconifyIcon icon={'mdi:check'} fontSize='15px' />}
                                onClick={() => handleTerminateProjectVisit(visit?.id)}
                              >
                                Terminer
                              </LoadingButton>
                            )}
                          </Box>
                        </Grid>

                        <Grid item xs={10} className='!my-2 flex justify-end'>
                          <BtnColorSecondary
                            disabled={visit?.state === 3 || (visit && visit?.d_company_id !== user?.company?.id)}
                            action={handleSaveVisit}
                            title='Enregistrer'
                            isLoading={createProjectVisitMutation?.isPending}
                          />
                        </Grid>
                      </Grid>
                    </CustomAccordian>

                    {detailsProject?.visits?.length !== 0 && (
                      <CustomAccordian open={true} titleAccordian={'Liste des Documents'}>
                        <StepDocuments
                          typeProject={detailsProject?.type}
                          stepDocuments={detailsProject?.documents}
                          id={detailsProject?.id}
                          detailsProject={detailsProject}
                        />
                      </CustomAccordian>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </TabPanel>
      <TabPanel value={2}>
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
            <Grid item xs={1} md={0.6} sx={{ minHeight: '100%' }}>
              {detailsProject?.accordions?.invoice && (
                <StepsSideBar
                  isLoading={getDetailsIsFetching}
                  id={detailsProject?.id}
                  clearedStep={clearedStep}
                  currentStep={activeStep}
                  steps={listSteps ? listSteps : []}
                  changeBetweenStep={false}
                />
              )}
            </Grid>
            <Grid item xs={11} md={11.2}>
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
                      label={detailsProject?.step?.display_name}
                    />
                  </Grid>
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
              {detailsProject?.cleared_step_order > 9 && detailsProject?.accordions?.start_work ? (
                <CustomAccordian open={false} titleAccordian={'Début de travaux'}>
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
              ) : null}
              {detailsProject?.cleared_step_order > 8 &&
              detailsProject?.accordions?.invoice &&
              user?.company?.quotation_interne == 1 ? (
                <DevisTravaux
                  id={detailsProject?.id}
                  detailsProject={detailsProject}
                  getDetailsIsLoading={getDetailsIsLoading}
                  editableUser={false}
                  noDocs={true}
                  open={false}
                />
              ) : null}
              {detailsProject?.cleared_step_order > 4 && detailsProject?.accordions?.visits ? (
                <CustomAccordian open={false} titleAccordian={'RENDEZ-VOUS'}>
                  <Grid container spacing={2} p={5}>
                    <Grid item xs={12}>
                      <Box display='flex'>
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
                          titleAction={
                            <>
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
                            </>
                          }
                        />

                        {visit?.state !== 3 ? (
                          <LoadingButton
                            disabled={visit?.state === 3 || (visit && visit?.d_company_id !== user?.company?.id)}
                            variant='outlined'
                            color='success'
                            loading={terminateProjectVisitMutation?.isPending}
                            loadingPosition='start'
                            sx={{ fontSize: '12px', marginTop: 14, height: 33 }}
                            size='small'
                            startIcon={<IconifyIcon icon={'mdi:check'} fontSize='15px' />}
                            onClick={() => handleTerminateProjectVisit(visit?.id)}
                          >
                            Terminer
                          </LoadingButton>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={10} className='!my-2 flex justify-end'>
                      <BtnColorSecondary
                        disabled={visit?.state === 3 || (visit && visit?.d_company_id !== user?.company?.id)}
                        action={handleSaveVisit}
                        title='Enregistrer'
                        isLoading={createProjectVisitMutation?.isPending}
                      />
                    </Grid>
                  </Grid>
                </CustomAccordian>
              ) : null}
              {/* {detailsProject?.cleared_step_order > 1 && detailsProject?.accordions?.simulation ? ( */}
              <>
                <CustomAccordian open={true} titleAccordian={'Simulation'}>
                  <Grid container spacing={2} p={5}>
                    <Grid item xs={12}>
                      <Simulator
                        hideButton={hideSimulatorButton}
                        detailsProject={detailsProject}
                        openAccordian={true}
                      />
                    </Grid>
                  </Grid>
                </CustomAccordian>
              </>
              {/* // ) : null} */}
              <CustomAccordian
                open={detailsProject?.documents?.length === 0 ? false : true}
                titleAccordian={'Liste des documents'}
              >
                <Grid container spacing={2} p={5}>
                  {detailsProject?.documents?.length === 0 && (
                    <div className='flex w-full h-64 place-content-center'>
                      <div className='self-center text-center'>
                        <IconifyIcon
                          color={'#FFAF6C'}
                          className='w-[100px] md:w-[200px] h-10 md:h-10 self-center '
                          icon='pepicons-pencil:file-off'
                        />
                        <Typography sx={{ fontSize: '15px' }}>Aucun document</Typography>
                      </div>
                    </div>
                  )}
                  <StepDocuments
                    typeProject={detailsProject?.type}
                    stepDocuments={detailsProject?.documents?.filter(item => item.nature !== null)}
                    id={detailsProject?.id}
                    detailsProject={detailsProject}
                  />
                </Grid>
              </CustomAccordian>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
    </TabContext>
  )
}

export default DetailsProjectIns
