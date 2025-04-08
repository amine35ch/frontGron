import React, { useEffect, useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import { useGetListIncomeClasses, useGetListProject } from 'src/services/project.service'
import ProjectColumn from './ProjectColumn'
import useDebounce from 'src/hooks/useDebounce'
import { useAuth } from 'src/hooks/useAuth'
import { useSendUnpayedProjects } from 'src/services/subscription.service'
import { useGetListCompany } from 'src/services/company.service'
import { useGetListSteps } from 'src/services/steps.service'
import { useRefuseypeProject, useUpdateTypeProject } from 'src/services/client.service'

const ListProject = ({ state = false, withCheckbox = false, showAllColumn, projectType = null }) => {
  const { user } = useAuth()

  const { data: listIncomeClasses, isLoading: incomeClassesIsLoading } = useGetListIncomeClasses()

  const { data: installerList, isLoading: installerListIsLoading } = useGetListCompany({
    type: 'ins',
    profile: 'installers',
    id: user?.userable_id,
    state: '1'
  })

  const { data: auditorsList, isLoading: auditorsListIsLoading } = useGetListCompany({
    type: 'aud',
    profile: 'auditors',
    id: user?.userable_id,
    state: '1'
  })
  const { data: stepsList, isSuccess: stepsListIsSuccess, isLoading: stepsListIsLoading } = useGetListSteps({})

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [incomeClass, setIncomeClass] = useState('')
  const [entrepriseRetenu, setEntrepriseRetenu] = useState('')
  const [auditor, setAuditor] = useState('')
  const [step, setStep] = useState('')
  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)
  const [arrayStateFilter, setArrayStateFilter] = React.useState([])
  const [stateLocal, setStateLocal] = useState(state)
  useEffect(() => {
    if (!incomeClassesIsLoading && !installerListIsLoading && !auditorsListIsLoading && !stepsListIsLoading) {
      if (user?.profile === 'MAR') {
        setArrayStateFilter([
          {
            title: 'Classe du revenue',
            setState: setIncomeClass,
            data: listIncomeClasses,
            state: incomeClass,
            type: 'select',
            displayOption: 'entitled',
            option: 'type',
            value: incomeClass
          },
          {
            title: 'Entreprise Retenue',
            setState: setEntrepriseRetenu,
            data: installerList,
            state: entrepriseRetenu,
            type: 'select',
            displayOption: 'trade_name',
            option: 'id',
            value: entrepriseRetenu
          },
          {
            title: "Bureau d'étude",
            setState: setAuditor,
            data: auditorsList,
            state: auditor,
            type: 'select',
            displayOption: 'trade_name',
            option: 'id',
            value: auditor
          },
          {
            title: 'étape',
            setState: setStep,
            data: stepsList,
            state: step,
            type: 'select',
            displayOption: 'display_name',
            option: 'order',
            value: step
          },
          {
            title: 'Date de création',
            setStartDateRange: setStartDateRange,
            setEndDateRange: setEndDateRange,
            type: 'date',
            endDateRange: endDateRange,
            startDateRange: startDateRange
          }
        ])
      }
      if (user?.profile === 'INS') {
        setArrayStateFilter([
          {
            title: 'étape',
            setState: setStep,
            data: stepsList,
            state: step,
            type: 'select',
            displayOption: 'display_name',
            option: 'order',
            value: step
          },
          {
            title: 'Date de création',
            setStartDateRange: setStartDateRange,
            setEndDateRange: setEndDateRange,
            type: 'date',
            endDateRange: endDateRange,
            startDateRange: startDateRange
          }
        ])
      }
    }
  }, [
    endDateRange,
    startDateRange,
    step,
    auditor,
    entrepriseRetenu,
    incomeClass,
    incomeClassesIsLoading,
    installerListIsLoading,
    auditorsListIsLoading,
    stepsListIsLoading,
    listIncomeClasses,
    installerList,
    auditorsList,
    stepsList
  ])

  const { mutate: acceptProject, isPendingAccept, isErrorAccept } = useUpdateTypeProject()
  const { mutate: refuseProject, isPendingRefuse, isErrorRefuse } = useRefuseypeProject()

  // **LIST COLUMNS
  const projectColumn = ProjectColumn({
    userRole: user?.profile,
    resource: 'projects',
    resource_name: 'Projets',
    showAllColumn,
    state: stateLocal,
    acceptProject: project => acceptProject(project),
    refuseProject: project => refuseProject(project)
  })
  const debouncedSearchTerm = useDebounce(search, 1000)

  // ** FROMAT DATE
  const dateRange = startDateRange && endDateRange ? `${startDateRange},${endDateRange}` : ''

  /// **DATA
  const { data, isLoading } = useGetListProject({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    state: stateLocal,
    incomeClass,
    entrepriseRetenu,
    auditor,
    step,
    dateRange,
    projectType
  })
  useEffect(() => {
    if (search !== '') {
      setStateLocal('')
    } else {
      setStateLocal(state)
    }
  }, [search])

  const sendUnpayedProjectsMutation = useSendUnpayedProjects()

  const exportListProject = async () => {
    window.open(`${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/projects/export`, '_blank')
  }

  const handeleRemoveFilter = () => {
    setStartDateRange(null)
    setEndDateRange(null)
  }

  return (
    <CrudDataTable
      query={data}
      columns={projectColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={true}
      addNewLink='/projects/create'
      resource='projects'
      resource_name='Projets'
      total={data?.total}
      titleCrud={'Dossiers'}
      showFilter={true}
      filterArray={arrayStateFilter}
      exportList={false}
      isLoading={isLoading}
      functionExportList={exportListProject}
      withCheckbox={withCheckbox}
      mutationToolBar={sendUnpayedProjectsMutation}
      handeleRemoveFilter={handeleRemoveFilter}
      filterEnabled={endDateRange || step || auditor || entrepriseRetenu}
      displayGeneratLink={true}
      isProspects={projectType === 0 ? 'prospect' : null}
    />
  )
}

export default ListProject
