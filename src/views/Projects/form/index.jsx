import { useGetDetailProject } from 'src/services/project.service'
import Form1 from './form-1'
import FormulaireCardUpdate from 'src/components/FormulaireCardUpdate'
import FicheNavette from 'src/views/FicheNavette/FicheNavette'
import LigneTypeTableWithDynamicLigne from './LigneTypeTableWithDynamicLigne'
import LigneTypeTable from './ligneTypeTable'
import SelectMandataireAdmin from './SelectMandataireAdmin'
import SelectMandataireFinancial from './SelectMandataireFinancial'
import SyntheseAudit from './SyntheseAudit'
import PvReception from './PvReception'
import { Box, Card, IconButton, useTheme } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import SelectMandataireGeneral from './SelectMandataireGeneral'
import ProjectStatus from '../components/ProjectStatus'
import QuotationData from './QuotationData'

const DocumentFactory = ({ typeProject, id, document }) => {
  // ** Theme
  const theme = useTheme()
  const router = useRouter()
  const { data: detailsProject, isSuccess: getDetailsIsSuccess } = useGetDetailProject({ id })

  const componentMap = {
    syntheseShuttleData: <FicheNavette redirect={true} idProject={id} document={document} />,

    helpDemandData: (
      <Form1
        typeProject={typeProject}
        redirect={true}
        detailsProject={detailsProject}
        getDetailsIsSuccess={getDetailsIsSuccess}
      />
    ),
    grilleData: <FormulaireCardUpdate idProject={id} typeProject={typeProject} redirect={true} document={document} />,
    syntheseGrilleData: (
      <FormulaireCardUpdate idProject={id} typeProject={typeProject} redirect={true} document={document} />
    ),
    quotationData: (
      <QuotationData
        detailsProject={detailsProject}
        idProject={id}
        typeProject={typeProject}
        redirect={true}
        document={document}
        getDetailsIsSuccess={getDetailsIsSuccess}
      />
    ),
    workProjectData: (
      <LigneTypeTable
        detailsProject={detailsProject}
        idProject={id}
        typeProject={typeProject}
        redirect={true}
        document={document}
        getDetailsIsSuccess={getDetailsIsSuccess}
      />
    ),
    mandatAdminData: (
      <SelectMandataireAdmin
        detailsProject={detailsProject}
        idProject={id}
        typeProject={typeProject}
        redirect={true}
        document={document}
        getDetailsIsSuccess={getDetailsIsSuccess}
      />
    ),
    mandatFinanData: (
      <SelectMandataireFinancial
        detailsProject={detailsProject}
        idProject={id}
        typeProject={typeProject}
        redirect={true}
        document={document}
        getDetailsIsSuccess={getDetailsIsSuccess}
      />
    ),
    mandatGeneralData: (
      <SelectMandataireGeneral
        detailsProject={detailsProject}
        idProject={id}
        typeProject={typeProject}
        redirect={true}
        document={document}
        getDetailsIsSuccess={getDetailsIsSuccess}
      />
    ),
    primeWorkDemandData: (
      <SyntheseAudit redirect={true} idProject={id} document={document} detailsProject={detailsProject} />
    ),
    pvReceptionData: <PvReception redirect={true} idProject={id} document={document} detailsProject={detailsProject} />
  }

  const Component = componentMap[document] || <>{document}</>

  return (
    <Box>
      <IconButton
        onClick={() => {
          router.push(`/projects/${detailsProject?.id}/edit`)
        }}
      >
        <IconifyIcon color={theme.palette.primary.main} icon='icon-park-outline:arrow-left' width={20} height={20} />
      </IconButton>
      {Component}
    </Box>
  )
}

export default DocumentFactory
