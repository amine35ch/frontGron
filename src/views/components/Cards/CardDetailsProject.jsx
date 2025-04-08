import React, { useRef, useState } from 'react'

// ** MUI Imports
import { Card, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Box } from '@mui/material'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import { AlertTitle, Alert } from '@mui/material'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import CustomChip from 'src/@core/components/mui/chip'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import IconifyIcon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import CustomModal from 'src/components/CustomModal'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'

// ** Styled <sup> component

// ** Styled <sub> component
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  padding: theme.spacing(4),
  maxHeight: '420px'
}))

const CardDetailsProject = ({ project, listTypeDocumentClient }) => {
  const auth = useAuth()
  const theme = useTheme()
  const [openModalFile, setopenModalFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(false)
  const chatArea = useRef(null)

  const onOpenModalFile = file => {
    setopenModalFile(!openModalFile)
    setSelectedFile(file)
  }

  function testIfIdExist(arrayDoc, idProject) {
    for (let i = 0; i < arrayDoc.length; i++) {
      if (arrayDoc[i].d_project_id === idProject) {
        return true
      }
    }

    return false
  }

  return (
    <>
      <Card sx={{ my: 2 }}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, display: 'flex' }}>
                <Typography sx={{ mb: 1, fontWeight: 500, fontSize: 14 }}>Source:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp;{project?.type_demande_project?.entitled}
                </Typography>
              </Box>
              <Box sx={{ mb: 2, display: 'flex' }}>
                <Typography sx={{ mb: 1, fontWeight: 500, fontSize: 14 }}>Classe Énergétique:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp;{project?.project_energy_class?.entitled}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}> Classe du revenue:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp; {project?.project_income_class?.entitled}{' '}
                </Typography>
              </Box>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}>Résidence:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp;{project?.project_energy_class?.entitled}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 16 }}>Logement à améliorer:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp;{project?.nature_residence?.entitled}
                </Typography>
              </Box>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}>Année de construction:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp;{project?.logement_date_creation}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}>Nombre d'occupant:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp; {project?.total_number_occupants}{' '}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box p={4} sx={{ mb: 1.5, width: '100%', backgroundColor: '#FFF6E5', borderRadius: '8px' }}>
                <div className='flex items-center '>
                  <Typography sx={{ color: '#e3a224', fontWeight: '700', fontSize: '15px' }}>
                    Coût des travaux HT (Є):
                  </Typography>
                  <Typography sx={{ color: '#e3a224', fontWeight: '500', ml: 2 }}>
                    {' '}
                    <CustomCurrencyInput displayType='text' custom={true} value={project?.cost_ht_simulation} />
                  </Typography>
                </div>
                <div className='flex items-center mt-2'>
                  <Typography sx={{ color: '#e3a224', fontWeight: '700', fontSize: '15px' }}>
                    Reste à charge HT (Є):
                  </Typography>
                  <Typography sx={{ color: '#e3a224', fontWeight: '500', ml: 2 }}>
                    {' '}
                    <CustomCurrencyInput displayType='text' custom={true} value={project?.rest_ht_simulation} />
                  </Typography>
                </div>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}>Étape actuelle :</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  &nbsp;{' '}
                  <CustomChip
                    skin='light'
                    size='small'
                    label={project?.step?.display_name}
                    color={'info'}
                    sx={{
                      height: 28,
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      alignSelf: 'flex-start',
                      marginLeft: '10px',
                      cursor: 'pointer'
                    }}
                  />
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 2,
              display: 'flex',
              borderRadius: 1,
              flexDirection: ['column', 'row'],
              justifyContent: ['space-between'],
              alignItems: ['flex-start', 'center'],
              mt: 5,
              border: theme => `1px solid ${theme.palette.divider}`,
              width: '100%'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}> Travaux souhaités:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                    {' '}
                    &nbsp;{project?.work_type?.entitled}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}> Scénario:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                    {' '}
                    &nbsp;{project?.scenario}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}> SHAB:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                    {' '}
                    &nbsp;{project?.surface_housing_before_work}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}> Sauts de classe:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                    {' '}
                    &nbsp;{project?.skip_class?.entitled}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}>Auditeur:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                    {' '}
                    &nbsp;{project?.auditor_company?.trade_name}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}>Entreprise retenue:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                    {' '}
                    &nbsp;{project?.installer_company?.trade_name}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 15 }}>Mandataire:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: '600' }}>
                    &nbsp;{project?.mandataire_company?.trade_name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          sx={{ pb: 0 }}
          title={
            <Typography color={'primary'} fontSize={'15px'} sx={{ fontWeight: '600' }}>
              Liste des fichiers
            </Typography>
          }
        />
        <CardContent>
          {auth?.user?.profile !== 'AUD' ? (
            <Timeline>
              <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
                {listTypeDocumentClient ? (
                  listTypeDocumentClient?.map((document, key) => (
                    <TimelineItem key={key}>
                      <TimelineSeparator>
                        <TimelineDot color={document?.required_document == 1 ? 'error' : 'primary'} />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                        <Box
                          sx={{
                            mb: 2,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                            {document?.entitled}
                          </Typography>

                          {document?.required_document == 1 ? (
                            <Typography variant='caption' color='error' sx={{ fontWeight: '600' }}>
                              Obligatoire
                            </Typography>
                          ) : (
                            <Typography variant='caption' sx={{ fontWeight: '600' }}>
                              Facultatif
                            </Typography>
                          )}
                        </Box>

                        {document?.project_documents?.length < 1 ? (
                          <div className='flex items-center'>
                            <IconifyIcon
                              color={theme.palette.primary.main}
                              className='!m-0'
                              fontSize={'17px'}
                              icon='pepicons-pencil:file-off'
                            />
                            <Typography variant='caption' sx={{ ml: 2, fontWeight: 600, color: 'text.error' }}>
                              Aucun document ajouté
                            </Typography>
                          </div>
                        ) : (
                          <>
                            {document?.project_documents?.map((doc, key) =>
                              doc.d_project_id === project?.id ? (
                                doc?.versions.length == 0 ? (
                                  <div className='flex items-center'>
                                    <IconifyIcon
                                      color={theme.palette.primary.main}
                                      className='!m-0'
                                      fontSize={'17px'}
                                      icon='pepicons-pencil:file-off'
                                    />
                                    <Typography variant='caption' sx={{ ml: 2, fontWeight: 600, color: 'text.error' }}>
                                      Aucun document ajouté
                                    </Typography>
                                  </div>
                                ) : (
                                  doc?.versions?.map((version, index) =>
                                    index == doc?.versions?.length - 1 ? (
                                      <Box
                                        onClick={() => onOpenModalFile(version)}
                                        key={key}
                                        sx={{ mt: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                      >
                                        <img
                                          width={25}
                                          height={25}
                                          alt='invoice.pdf'
                                          src='/images/icons/file-icons/pdf.png'
                                        />
                                        <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
                                          {version?.name}{' '}
                                        </Typography>
                                        <Typography fontSize={12} variant='body2' color='primary'>
                                          &nbsp; (V{doc?.versions?.length}){' '}
                                        </Typography>
                                      </Box>
                                    ) : null
                                  )
                                )
                              ) : null
                            )}

                            {testIfIdExist(document?.project_documents, project?.id) === false ? (
                              <div className='flex items-center'>
                                <IconifyIcon
                                  color={theme.palette.primary.main}
                                  className='!m-0'
                                  fontSize={'17px'}
                                  icon='pepicons-pencil:file-off'
                                />
                                <Typography variant='caption' sx={{ ml: 2, fontWeight: 600, color: 'text.error' }}>
                                  Aucun document ajouté
                                </Typography>
                              </div>
                            ) : null}
                          </>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))
                ) : (
                  <>
                    <Skeleton variant='rectangular' width='100%' height={100} />
                  </>
                )}
              </PerfectScrollbar>
            </Timeline>
          ) : null}
        </CardContent>
      </Card>

      <CustomModal
        open={openModalFile}
        handleCloseOpen={() => setopenModalFile(!openModalFile)}
        handleActionModal={() => setopenModalFile(!openModalFile)}
        ModalTitle={selectedFile?.name}
        widthModal={'lg'}
        btnCanceledTitle={'Non'}
        btnTitleClose={false}
      >
        {selectedFile?.extension?.toLowerCase() == 'PNG' ? (
          <img
            src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + `/documents/${selectedFile.id}/download`}
            alt={selectedFile.name}
            style={{ maxWidth: '100%', height: '100%' }}
          />
        ) : (
          <iframe
            style={{
              borderRadius: 10,
              borderColor: '#90caf975',
              boxShadow:
                '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
              border: '0px solid'
            }}
            title='contrat-pdf'
            src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + `/project-document-versions/${selectedFile.id}/download`}
            width='100%'
            height='700px'
          ></iframe>
        )}
      </CustomModal>
    </>
  )
}

export default CardDetailsProject
