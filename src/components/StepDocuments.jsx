import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DisplayFileDialog from './DisplayFileDialog'
import AttachPDocumentDialog from './AttachPDocumentDialog'
import { useTheme } from '@emotion/react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Box, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import {
  useGenerateDocument,
  useSentDocumentForSignature,
  useUploadDocumentToProject
} from 'src/services/project.service'
import CustomCounterTimeDown from './CustomCounterTimeDown'
import { setSeconds } from 'date-fns'
import { useViewGeneralDocumentData } from 'src/services/document.service'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import SettingSignature from './SettingSignature'
import CustomAccordian from './CustomAccordian'

const StepDocuments = ({
  clavis = false,
  onlyView = false,
  typeProject = '',
  stepDocuments,
  groupedDocuments = null,
  id,
  detailsProject = {}
}) => {
  const [contactInfo, setContactInfo] = useState({})
  useEffect(() => {
    setContactInfo({
      email: detailsProject?.e_signature_credentials?.email,
      phone_number: detailsProject?.e_signature_credentials?.phone_number
    })
  }, [])

  // ** theme
  const theme = useTheme()
  const { user } = useAuth()

  const [currentLoadingIndex, setCurrentLoadingIndex] = useState(0)
  const [singleFile, setSingleFile] = useState([])
  const [openModalSettingSignature, setOpenModalSettingSignature] = useState(false)
  const isDisabled = detailsProject?.isEditable

  //** STATES
  const [open, setOpen] = useState(false)
  const [attachFileDialog, setAttachFileDialog] = useState(false)
  const [documentToAttach, setDocumentToAttach] = useState(null)
  const [fileToDisplay, setFileToDisplay] = useState(null)
  const [countSignature, setCountSignature] = useState(null)
  const [timeSendDocument, setTimeSendDocument] = useState(0)
  const [idFile, setIdFile] = useState(null)
  const generateDocumentMutation = useGenerateDocument({ id })
  const [formErrorsFiles, setformErrorsFiles] = useState(false)

  const uploadDocumentToProjectMutation = useUploadDocumentToProject({ id })
  const sentDocumentForSignatureMutation = useSentDocumentForSignature({ id })
  const viewGeneralDocumentData = useViewGeneralDocumentData({ id })
  const router = useRouter()

  const goToform = async (document, index) => {
    try {
      if (document?.nature === 1) {
        setCurrentLoadingIndex(index)

        return await generateDocumentMutation.mutateAsync(document)
      }
      if (document?.name === "Relevé d'audit") {
        router.push(`${process.env.NEXT_PUBLIC_BETA_FICHE_NAVETTE}/${id}`)

        return
      }
      router.push(`/documents/projects/${id}/${document?.reference}`, undefined, { shallow: true })
    } catch (error) {}
  }

  const handleAttacheDocument = async file => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', documentToAttach?.entitled)
      formData.append('title', documentToAttach?.name)
      formData.append('docId', documentToAttach?.id)

      await uploadDocumentToProjectMutation.mutateAsync({ formData, idDocument: documentToAttach?.type })
      handleCloseAttachFileDialog()
      setSingleFile([])
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setformErrorsFiles(errorsObject)
    }
  }

  const handleDownloadFile = file => {
    // on the button click trigger download file from api
    window.open(`${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/projects/${file?.reference}/download-document`)
  }

  const handleSentForSignature = async file => {
    setIdFile(file.id)
    const newStepDocuments = [...stepDocuments] // Copie l'array pour éviter la mutation directe
    const stepDocument = newStepDocuments.find(item => item.id === file.id) // Utilise find pour obtenir l'élément correspondant
    const step = stepDocument?.step // Assure-toi d'accéder à la propriété correcte

    try {
      await sentDocumentForSignatureMutation.mutateAsync({ fileType: file?.reference, contactInfo })
    } catch (error) {
      if (error?.response?.status === 429) {
        setTimeSendDocument(error?.response?.data?.errors?.retry_after)
        stepDocument.timeSendDocument = error?.response?.data?.errors?.retry_after // Corrige la syntaxe pour assigner une propriété
      }
    }
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleDisplayFile = async file => {
    const reference = file?.reference
    try {
      await viewGeneralDocumentData.mutateAsync(reference)
    } catch (error) {}
    setOpen(true)
    setFileToDisplay(file)
  }

  const handleCloseAttachFileDialog = () => {
    setAttachFileDialog(false)
    setformErrorsFiles(false)
    setSingleFile([])
  }

  const handleAttachFileDialog = document => {
    setAttachFileDialog(true)
    setDocumentToAttach(document)
  }

  const handleOpenModalSettingSignature = count => {
    setOpenModalSettingSignature(true)
    setCountSignature(count)
  }

  return (
    <>
      {stepDocuments?.map((stepDoc, index) => (
        <Grid
          key={index}
          container
          item
          sx={{
            padding: '3px'
          }}
          justifyItems={'center'}
        >
          <Grid item className='flex items-center ' xs={5} md={5}>
            {stepDoc?.type == 5 && stepDoc?.status !== 4 && user?.profile === 'INS' && (
              <IconifyIcon icon='mingcute:alert-line' color={'#e3a224'} style={{ marginTop: '.5rem' }} />
            )}
            <Typography
              className='!font-semibold  !mt-2 !ml-2'
              sx={{
                fontSize: '15px',
                color: stepDoc?.type == 5 && stepDoc?.status !== 4 && user?.profile === 'INS' ? '#e3a224' : '#2a2e34'
              }}
            >
              {stepDoc?.name}
            </Typography>
            <Typography
              className='!font-medium  !mt-2 !ml-1'
              sx={{
                fontSize: '13px',
                color:
                  stepDoc?.type == 5 && stepDoc?.status !== 4 && user?.profile === 'INS' ? '#e3a224' : 'secondary.main'
              }}
            >
              {stepDoc?.required == 1 ? '(Obligatoire)' : '(Facultatif)'}
            </Typography>
            {stepDoc?.new && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px',
                  cursor: 'pointer',
                  ml: 2
                }}
                icon={<Icon icon='material-symbols:notifications-active-outline-sharp' fontSize={20} />}
                label={'Nouveau'}
              />
            )}
          </Grid>
          <Grid item xs={2} md={2} className='flex items-center text-center'>
            <Typography
              className='!font-medium  !mt-2 !ml-2'
              color={stepDoc?.nature_color ? `${stepDoc?.nature_color}` : 'secondary.main'}
            >
              {stepDoc?.status_entitled}
            </Typography>
          </Grid>
          <Grid item xs={5} md={5} className='flex items-center justify-evenly'>
            <Box width={50}>
              <>
                {stepDoc?.status > 2 || stepDoc?.reference === 'RecapDevisInstallateur' ? (
                  <IconButton onClick={() => handleDisplayFile(stepDoc)} color='secondary' title='Voir Document'>
                    <IconifyIcon icon='carbon:data-view-alt' />
                  </IconButton>
                ) : null}
              </>
            </Box>
            {!onlyView && stepDoc?.editable && stepDoc?.reference !== 'RecapDevisInstallateur' ? (
              <>
                <Box width={50}>
                  <>
                    {stepDoc?.nature === 0 ||
                    (stepDoc?.signature === 1 && stepDoc?.status > 2) ||
                    user?.profile === 'MAR' ||
                    (user?.profile == 'INS' && stepDoc.type == 16) ? (
                      <IconButton
                        onClick={() => handleAttachFileDialog(stepDoc)}
                        color='secondary'
                        title='Attacher Document'
                        disabled={isDisabled}
                      >
                        <IconifyIcon icon='ion:document-attach-outline' />
                      </IconButton>
                    ) : null}
                  </>
                </Box>
                <Box width={50}>
                  <>
                    {stepDoc?.nature === 2 || stepDoc?.nature === 1 ? (
                      <IconButton
                        disabled={(generateDocumentMutation.isPending && index !== currentLoadingIndex) || isDisabled}
                        onClick={() => goToform(stepDoc, index)}
                        color='secondary'
                        title='Editer Document'
                      >
                        {generateDocumentMutation.isPending && index === currentLoadingIndex ? (
                          <CircularProgress
                            size={24}
                            thickness={6}
                            sx={{
                              color: hexToRGBA(theme.palette.primary.main, 0.6)
                            }}
                          />
                        ) : (
                          <IconifyIcon icon='mage:edit' />
                        )}
                      </IconButton>
                    ) : null}
                  </>
                </Box>
                <Box width={25}>
                  <>
                    {stepDoc?.downloadable ? (
                      <IconButton
                        onClick={() => handleDownloadFile(stepDoc)}
                        color='secondary'
                        title='Telecharger Document'
                      >
                        <IconifyIcon icon='et:download' />
                      </IconButton>
                    ) : null}
                    {stepDoc?.docu_signature === 1 ? (
                      <IconButton
                        onClick={() => handleSentForSignature(stepDoc)}
                        color={stepDoc?.count_signature === 0 ? 'secondary' : 'primary'}
                        title='Envoi pour signature'
                      >
                        {stepDoc?.timeSendDocument ? (
                          <div className='flex items-center'>
                            <IconifyIcon icon='game-icons:sands-of-time' color='#FFB911' />
                            <CustomCounterTimeDown time={timeSendDocument} setTimeSendDocument={handeUpdateTime} />
                          </div>
                        ) : sentDocumentForSignatureMutation?.isPending && stepDoc.id == idFile ? (
                          <CircularProgress size='15px' />
                        ) : (
                          <IconifyIcon icon='lucide:file-signature' />
                        )}
                      </IconButton>
                    ) : null}
                  </>
                </Box>
                <Box width={35}>
                  <>
                    {stepDoc?.docu_signature === 1 ? (
                      <div className='flex items-center' title='Nombre des signatures' color='secondary'>
                        <IconifyIcon icon='fluent:signature-16-regular' fontSize={'40px'} color={'#585ddb'} />
                        <Typography color='secondary' fontWeight={600} fontSize={18}>
                          {' '}
                          {stepDoc?.count_signature}{' '}
                        </Typography>
                      </div>
                    ) : null}
                  </>
                </Box>
                <Box width={25}>
                  <>
                    {stepDoc?.docu_signature === 1 ? (
                      <IconButton
                        onClick={() => handleOpenModalSettingSignature(stepDoc?.count_signature)}
                        color='secondary'
                        title='Paramétrage signature'
                        disabled={isDisabled}
                      >
                        <IconifyIcon icon='ant-design:setting-outlined' />
                      </IconButton>
                    ) : null}
                  </>
                </Box>
              </>
            ) : null}
            {/* {user?.profile == 'INS' && stepDoc.reference === 'syntheseShuttleData' ? (
              <>
                <Box width={50}>
                  <>
                    {user?.company?.fiche_navette_interne == 0 ? (
                      <IconButton
                        onClick={() => handleAttachFileDialog(stepDoc)}
                        color='secondary'
                        title='Attacher Document'
                      >
                        <IconifyIcon icon='ion:document-attach-outline' />
                      </IconButton>
                    ) : null}
                  </>
                </Box>

                <Box width={25}>
                  <>
                    {stepDoc?.downloadable ? (
                      <IconButton
                        onClick={() => handleDownloadFile(stepDoc)}
                        color='secondary'
                        title='Telecharger Document'
                      >
                        <IconifyIcon icon='et:download' />
                      </IconButton>
                    ) : null}
                  </>
                </Box>
              </>
            ) : null}
            {user?.profile == 'INS' && stepDoc.reference === 'devisInstallateur' ? (
              <>
                <Box width={50}>
                  <>
                    {user?.company?.quotation_interne == 0 ? (
                      <IconButton
                        onClick={() => handleAttachFileDialog(stepDoc)}
                        color='secondary'
                        title='Attacher Document'
                      >
                        <IconifyIcon icon='ion:document-attach-outline' />
                      </IconButton>
                    ) : null}
                  </>
                </Box>

                <Box width={25}>
                  <>
                    {stepDoc?.downloadable ? (
                      <IconButton
                        onClick={() => handleDownloadFile(stepDoc)}
                        color='secondary'
                        title='Telecharger Document'
                      >
                        <IconifyIcon icon='et:download' />
                      </IconButton>
                    ) : null}
                  </>
                </Box>
              </>
            ) : null} */}
            {clavis ? (
              <Box width={150}>{stepDoc?.exported ? <Typography>Document Clavis</Typography> : null}</Box>
            ) : null}
          </Grid>
        </Grid>
      ))}
      {open ? (
        <DisplayFileDialog
          src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + `/project-documents/${fileToDisplay?.id}/download`}
          open={open}
          handleCloseOpen={handleCloseDialog}
          file={fileToDisplay}
        />
      ) : null}
      {attachFileDialog ? (
        <AttachPDocumentDialog
          actionIsLoading={uploadDocumentToProjectMutation?.isPending}
          handleActionClick={handleAttacheDocument}
          handleCloseOpen={handleCloseAttachFileDialog}
          open={attachFileDialog}
          loading={uploadDocumentToProjectMutation?.isPending}
          document={documentToAttach}
          formErrors={formErrorsFiles}
          setformErrorsFiles={setformErrorsFiles}
          singleFile={singleFile}
          setSingleFile={setSingleFile}
        />
      ) : null}
      {openModalSettingSignature && (
        <SettingSignature
          openModalSettingSignature={openModalSettingSignature}
          setOpenModalSettingSignature={setOpenModalSettingSignature}
          id={detailsProject?.client?.id}
          countSignature={countSignature}
          contactInfo={contactInfo}
          setContactInfo={setContactInfo}
        />
      )}
      {/* {groupedDocuments && groupedDocuments.length > 0 && (
        <CustomAccordian
          style={{
            width: '100%'
          }}
          open={false}
          titleAccordian={`${groupedDocuments[0]?.entitled} (${groupedDocuments.length})`}
        >
          <Grid container spacing={2} p={5}>
            <Grid item xs={12}>
              <StepDocuments typeProject={typeProject} stepDocuments={groupedDocuments} id={id} />
            </Grid>
          </Grid>
        </CustomAccordian>
      )} */}
    </>
  )
}

export default StepDocuments
