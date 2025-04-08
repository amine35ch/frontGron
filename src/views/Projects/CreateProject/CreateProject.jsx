// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import {
  Typography,
  IconButton,
  Divider,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Autocomplete,
  useTheme,
  FormGroup,
  Switch
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// ** Third Party Imports

// ** Icon Imports

// ** Custom Components Imports

import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import {
  useCreateProject,
  useGetListTypeDemade,
  useGetProjectsCreationDocuments,
  useUpdateProject
} from 'src/services/project.service'
import { useGetAcceptedClients } from 'src/services/client.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import IconifyIcon from 'src/@core/components/icon'
import CreateClient from 'src/views/clients/CreateClient'
import Form1 from '../form/form-1'
import {
  useGetListEnergyClasses,
  useGetListIncomeClasses,
  useGetListProjectResidences
} from 'src/services/settings.service'
import { useGetListCompany } from 'src/services/company.service'
import CustomAccordian from 'src/components/CustomAccordian'
import { useAuth } from 'src/hooks/useAuth'
import CreateInstallateur from 'src/views/installateur/CreateInstallateur'
import CustomeTypography from 'src/components/CustomeTypography'
import CreateMandataire from 'src/views/mandataire/CreateMandataire'
import useTabs from 'src/hooks/useTabs'
import StepDocuments from 'src/components/StepDocuments'
import AttachDocumentsFromList from 'src/components/AttachDocuments'

const CreateProject = ({ update, detailsProject, getDetailsIsSuccess }) => {
  const router = useRouter()
  const auth = useAuth()
  const formOneRef = useRef(null)
  const theme = useTheme()
  const { setActiveTab } = useTabs()
  const [documents, setDocument] = useState([])

  // ** States
  const [formInput, setFormInput] = useState({
    d_client_id: '',
    type: 0,
    process: 0,
    performance_energy_before_work: '',
    project_residence: 0,
    income_class: '',
    demande_project: 1,
    installer: auth?.user?.profile === 'INS' ? auth?.user?.company?.id : '',
    agent: null,
    files: [],
    parinage: 0,
    anah_folder: null,
    merge_agent: 0
  })

  const [formErrors, setFormErrors] = useState(null)

  const [openModalAddClient, setOpenModalAddClient] = useState(false)
  const [openModalAddEntreprise, setOpenModalAddEntreprise] = useState(false)
  const [openModalAddAgent, setOpenModalAddAgent] = useState(false)

  // ** Query
  const createProjectMutation = useCreateProject()
  const updateProjectMutation = useUpdateProject({ id: detailsProject?.id })

  const { data: clientList, isLoading: isLoadingAcceptedClients } = useGetAcceptedClients()
  const { data: lisEnergyClasses } = useGetListEnergyClasses()
  const { data: listProjectResidences } = useGetListProjectResidences()
  const { data: projectCreationDocumentList } = useGetProjectsCreationDocuments()
  const { data: listIncomeClasses } = useGetListIncomeClasses()
  const { data: lisTypeDemande } = useGetListTypeDemade()

  const { data: listTiers } = useGetListCompany({
    type: 'ins',
    profile: 'installers'
  })

  useEffect(() => {
    if (getDetailsIsSuccess) {
      setFormInput({
        d_client_id: detailsProject?.d_client_id,
        type: detailsProject?.type,
        process: detailsProject?.process,
        performance_energy_before_work: detailsProject?.performance_energy_before_work,
        project_residence: detailsProject?.project_residence?.type,
        income_class: detailsProject?.income_class,
        demande_project: detailsProject?.demande_project?.type,
        installer: detailsProject?.installer?.id ?? null,
        agent: detailsProject?.agent,
        parinage: detailsProject?.installer === null ? '0' : '1',
        anah_folder: detailsProject?.anah_folder?.anah_folder
      })
    }
  }, [getDetailsIsSuccess])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const formData = new FormData()
    const formOneData = formOneRef.current?.handleReturnComponentData()
    const createForm = { ...formInput, ...formOneData }

    const removeLeadingZero = value => {
      if (typeof value === 'string' && value.startsWith('0')) {
        return value.replace(/^0+/, '')
      }

      return value
    }

    for (let key in createForm) {
      if (key === 'files') {
        formInput?.files?.map((file, index) => {
          formData.append(`documents[${index}][file]`, file?.file)
          formData.append(`documents[${index}][name]`, file?.nom)
        })
      } else if (key === 'occupants') {
        createForm?.occupants?.forEach((element, index) => {
          for (let [key, value] of Object.entries(element)) {
            formData.append(`occupants[${index}][${key}]`, removeLeadingZero(value))
          }
        })
      } else {
        let value = createForm[key]
        if (key !== 'parinage') {
          value = removeLeadingZero(createForm[key])
        }
        if (value === true) {
          formData.append(key, 1)
        } else if (value === false) {
          formData.append(key, 0)
        } else {
          formData.append(key, value === null ? '' : createForm[key])
        }
      }
    }

    for (let index = 0; index < projectCreationDocumentList?.length; index++) {
      const localDocument = documents?.find(doc => doc?.type === projectCreationDocumentList[index].type)
      if (localDocument?.type) {
        formData.append(`${projectCreationDocumentList[index]?.reference}[name]`, localDocument.name)
        formData.append(`${projectCreationDocumentList[index]?.reference}[file]`, localDocument.file)
        formData.append(`${projectCreationDocumentList[index]?.reference}[p_document_type]`, localDocument.type)
      }
    }

    // formData.append(`anah_folder`, createForm.anah_folder)

    try {
      const result = await createProjectMutation.mutateAsync(formData)
      const id = result?.data?.data?.id
      router.push(`/projects/${id}/edit`)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const updateProject = async () => {
    const formData = new FormData()
    const formOneData = formOneRef.current?.handleReturnComponentData()
    const createForm = { ...formInput, ...formOneData }
    for (let key in createForm) {
      if (key == 'documents') {
        formInput?.files?.map((file, index) => {
          formData.append(`documents[${index}][file]`, file?.file)
          formData.append(`documents[${index}][name]`, file?.nom)
        })
      } else if (key == 'occupants') {
        // formInput?.occupants?.map((occupant, index) => {
        createForm?.occupants?.forEach((element, index) => {
          for (let [key, value] of Object.entries(element)) {
            formData.append(`occupants[${index}][${key}]`, value)
          }
        })
      } else {
        if (createForm[key] === true) {
          formData.append(key, 1)
        } else if (createForm[key] === false) {
          formData.append(key, 0)
        } else {
          formData.append(key, createForm[key] === null ? '' : createForm[key])
        }
      }
    }

    try {
      const result = await updateProjectMutation.mutateAsync(formData)
      const id = result?.data?.data?.id
      router.push(`/projects/${id}/edit`)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleSetDocument = file => {
    setDocument(prev => {
      // if file type exist inside array update it if not added it
      const index = prev.findIndex(doc => doc.type === file.type)
      if (index !== -1) {
        prev[index] = file

        return [...prev]
      }

      return [...prev, file]
    })
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              {update ? (
                <IconButton
                  onClick={() => {
                    router.push(`/projects/${detailsProject?.id}/edit`)
                    setActiveTab(0)
                  }}
                >
                  <IconifyIcon
                    color={theme.palette.primary.main}
                    icon='icon-park-outline:arrow-left'
                    width={20}
                    height={20}
                  />
                </IconButton>
              ) : null}
            </Grid>
            <Grid item xs={6} className='flex justify-end'>
              {update ? (
                <LoadingButton
                  variant='contained'
                  loading={updateProjectMutation?.isPending}
                  loadingPosition='start'
                  className='h-[29px] w-[105px]'
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  onClick={updateProject}
                >
                  Modifier
                </LoadingButton>
              ) : (
                <LoadingButton
                  variant='contained'
                  loading={createProjectMutation?.isPending}
                  loadingPosition='start'
                  className='h-[29px] w-[105px]'
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  onClick={onSubmit}
                >
                  Créer
                </LoadingButton>
              )}
            </Grid>
          </Grid>
          <CustomAccordian titleAccordian={'Informations générales'}>
            <Grid p={5} container spacing={5}>
              <Grid item xs={12} md={6} className='!mb-2'>
                <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  N° Dossier Anah
                </Typography>
                <TextField
                  placeholder='N° Dossier Anah'
                  size='small'
                  variant='outlined'
                  className='w-full '
                  error={formErrors?.anah_folder}
                  disabled={detailsProject?.anah_folder?.editable == false ? true : false}
                  sx={{ fontSize: '10px !important', mt: 1 }}
                  value={formInput?.anah_folder}
                  onChange={e =>
                    setFormInput({
                      ...formInput,
                      anah_folder: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid container item xs={12} md={6} className='!mb-2'>
                <Grid item xs={12} md={12}>
                  <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Bénéficiaire <strong className='text-red-500'>*</strong>
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} md={11.4}>
                      <div className='mt-1'>
                        <Autocomplete
                          size='small'
                          fullWidth
                          disabled={update}
                          noOptionsText='Aucun data'
                          value={clientList?.find(item => item?.id === formInput.d_client_id) || null}
                          onChange={(event, value) => {
                            handleChange('d_client_id', value?.id)
                            formOneRef.current?.handleChange('address', value?.address)
                            formOneRef.current?.handleChange('zip_code', value?.zip_code)
                            formOneRef.current?.handleChange('floor', value?.floor)
                            formOneRef.current?.handleChange('house_number', value?.house_number)
                            formOneRef.current?.handleChange('street', value?.street)
                            formOneRef.current?.handleChange('stairs', value?.stairs)
                            formOneRef.current?.handleChange('common', value?.commune)
                            formOneRef.current?.handleChange('door', value?.door)
                            formOneRef.current?.handleChange('city', value?.city)
                            formOneRef.current?.handleChange('batiment', value?.building)
                          }}
                          loading={isLoadingAcceptedClients}
                          loadingText='Chargement des clients...'
                          options={clientList || []}
                          getOptionLabel={option => option.first_name + ' ' + option.last_name || ''}
                          renderOption={(props, option) => (
                            <li {...props}>{option.first_name + ' ' + option.last_name}</li>
                          )}
                          renderInput={params => (
                            <TextField
                              {...params}
                              helperText={renderArrayMultiline(formErrors?.d_client_id)}
                              error={formErrors?.d_client_id}
                            />
                          )}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={0.6}>
                      <IconButton
                        disabled={update}
                        onClick={() => setOpenModalAddClient(true)}
                        aria-label='Ajouter Bénéficiaire'
                        size='small'
                      >
                        <IconifyIcon icon='lets-icons:user-add-duotone' color='#585DDB' fontSize='35px' />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} className='!pt-0 !mb-2'>
                <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Source <strong className='text-red-500'>*</strong>
                </Typography>

                <CustomeAutoCompleteSelect
                  value={formInput.demande_project}
                  onChange={value => handleChange('demande_project', value)}
                  data={lisTypeDemande}
                  option={'type'}
                  formError={formErrors}
                  error={formErrors?.demande_project}
                  displayOption={'entitled'}
                  helperText={renderArrayMultiline(formErrors?.demande_project)}
                />
              </Grid>
              <Grid item xs={12} md={6} className={`${auth?.user?.profile !== 'INS' ? '!pt-0' : '!pt-0'} !mb-2`}>
                <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Classe Énergétique
                </Typography>
                <CustomeAutoCompleteSelect
                  option={'type'}
                  value={formInput.performance_energy_before_work}
                  onChange={value => handleChange('performance_energy_before_work', value)}
                  data={lisEnergyClasses}
                  formError={formErrors}
                  error={formErrors?.performance_energy_before_work}
                  displayOption={'entitled'}
                  backgroundColorLi={'pink'}
                  helperText={renderArrayMultiline(formErrors?.performance_energy_before_work)}
                />
              </Grid>
              <Grid item xs={12} md={6} className='!pt-0 !mb-2'>
                <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Résidence <strong className='text-red-500'>*</strong>
                </Typography>
                <CustomeAutoCompleteSelect
                  option={'type'}
                  value={formInput?.project_residence}
                  onChange={value => handleChange('project_residence', value)}
                  data={listProjectResidences}
                  formError={formErrors}
                  error={formErrors?.project_residence}
                  displayOption={'entitled'}
                  helperText={renderArrayMultiline(formErrors?.project_residence)}
                />
              </Grid>

              <Grid item xs={12} md={6} className='!pt-0 !mb-2'>
                <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Classe du revenue
                </Typography>
                <CustomeAutoCompleteSelect
                  option={'type'}
                  value={formInput.income_class}
                  onChange={value => handleChange('income_class', value)}
                  data={listIncomeClasses}
                  formError={formErrors}
                  error={formErrors?.income_class}
                  displayOption={'entitled'}
                  helperText={renderArrayMultiline(formErrors?.income_class)}
                />
              </Grid>
            </Grid>

            {auth?.user?.profile !== 'INS' && (
              <Grid pl={5} pt={4} container spacing={5}>
                <Grid item xs={12} md={6} className='!mb-2 '>
                  <div className='flex items-center'>
                    <CustomeTypography>Parrainage :</CustomeTypography>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby='demo-controlled-radio-buttons-group'
                        name='controlled-radio-buttons-group'
                        value={formInput.parinage}
                        onChange={event => {
                          handleChange('parinage', event.target.value)
                        }}
                      >
                        {' '}
                        <FormControlLabel labelPlacement='start' value={0} control={<Radio />} label='Non' />
                        <FormControlLabel labelPlacement='start' value={1} control={<Radio />} label='Oui' />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
                {formInput?.parinage === '1' ? (
                  <Grid container item xs={12} md={6} className='!mb-2 !pt-0'>
                    <Grid item xs={12} md={12}>
                      <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                        Entreprise retenue
                      </Typography>
                      <Grid container>
                        <Grid item xs={12} md={11.4} pt={2}>
                          <CustomeAutoCompleteSelect
                            option={'id'}
                            value={formInput.installer}
                            onChange={value => handleChange('installer', value)}
                            data={listTiers}
                            formError={formErrors}
                            error={formErrors?.installer}
                            displayOption={'trade_name'}
                            helperText={renderArrayMultiline(formErrors?.installer)}
                          />
                        </Grid>
                        <Grid item xs={12} md={0.6}>
                          <IconButton
                            onClick={() => setOpenModalAddEntreprise(true)}
                            aria-label='Ajouter Tiers'
                            size='small'
                          >
                            <IconifyIcon icon='material-symbols-light:add-home-work' color='#585DDB' fontSize='35px' />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            )}
          </CustomAccordian>
          <Form1
            ref={formOneRef}
            SubmitButton={false}
            detailsProject={detailsProject}
            getDetailsIsSuccess={getDetailsIsSuccess}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
          {!update ? (
            <CustomAccordian titleAccordian={'Liste des documents'}>
              <Grid container spacing={2} p={5}>
                <AttachDocumentsFromList
                  documents={documents}
                  handleSetDocument={handleSetDocument}
                  documentsList={projectCreationDocumentList}
                  formErrorsFiles={{}}
                  setFormErrorsFiles={() => {}}
                />
              </Grid>
            </CustomAccordian>
          ) : null}
          <Grid container>
            <Grid item xs={12} md={6}>
              <CustomComponentFileUpload
                fileTypes={['.png', '.pdf', '.jpeg', '.xlsx']}
                limit={50}
                multiple={true}
                formInput={formInput}
                setFormInput={setFormInput}
                formErrors={formErrors}
                name='files'
                showInputName={true}
                onlyOthers={true}
              />
            </Grid>
          </Grid>
          <Grid container className='mt-16'>
            <Grid item xs={6}></Grid>
            <Grid item xs={6} className='flex justify-end'>
              {update ? (
                <LoadingButton
                  variant='contained'
                  loading={updateProjectMutation?.isPending}
                  loadingPosition='start'
                  className='h-[29px] w-[105px]'
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  onClick={updateProject}
                >
                  Modifier
                </LoadingButton>
              ) : (
                <LoadingButton
                  variant='contained'
                  loading={createProjectMutation?.isPending}
                  loadingPosition='start'
                  className='h-[29px] w-[105px]'
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  onClick={onSubmit}
                >
                  Créer
                </LoadingButton>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {openModalAddClient && (
        <CreateClient
          setProjectAddress={formOneRef.current?.handleChange}
          setProjectFormInput={setFormInput}
          addClientWithModal={true}
          setOpenModalAddClient={setOpenModalAddClient}
          openModalAddClient={openModalAddClient}
        />
      )}
      {openModalAddEntreprise && (
        <CreateInstallateur
          setProjectFormInput={setFormInput}
          path={'/entreprise'}
          addTiersWithModal={true}
          setOpenModalAddEntreprise={setOpenModalAddEntreprise}
          openModalAddEntreprise={openModalAddEntreprise}
        />
      )}
      {openModalAddAgent && (
        <CreateMandataire
          setProjectFormInput={setFormInput}
          path={'/agents'}
          modalTitle={'Ajouter Mandataire'}
          addTiersWithModal={true}
          setOpenModalAddEntreprise={setOpenModalAddAgent}
          openModalAddEntreprise={openModalAddAgent}
        />
      )}
    </>
  )
}

export default CreateProject
