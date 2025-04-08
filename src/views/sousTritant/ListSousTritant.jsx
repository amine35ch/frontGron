import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import useDebounce from 'src/hooks/useDebounce'
import SousTraitantColumn from './SousTraitantColumn'
import { useGetListCompany } from 'src/services/company.service'
import { useAuth } from 'src/hooks/useAuth'

const ListSousTritant = () => {
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState(1)
  const [operations, setOperations] = useState(null)
  const [entreprise, setEntreprise] = useState(null)
  const [arrayStateFilter, setArrayStateFilter] = React.useState([])
  const debouncedSearchTerm = useDebounce(search, 1000)

  // **LIST COLUMNS
  const sousTraitantColumn = SousTraitantColumn({
    userRole: 'admin',
    resource: 'sub-contractors',
    resource_name: 'Sous-traitants'
  })

  const { data, isLoading, isSuccess } = useGetListCompany({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    type: 'stt',
    profile: 'sub-contractors',
    id: auth?.user?.userable_id,
    state
  })

  // const { data: listEntreprise } = useGetTiers({ paginated: false, type: 2 })

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  // React.useEffect(() => {
  //   setArrayStateFilter([
  //     {
  //       title: 'Opération',
  //       setState: setOperations,
  //       data: listOperation,
  //       state: operations,
  //       attribute: 'state',
  //       type: 'select',
  //       option: 'type',
  //       displayOption: 'reference'
  //     },
  //     {
  //       title: 'Enterprise ',
  //       setState: setEntreprise,
  //       data: listEntreprise,
  //       state: entreprise,
  //       attribute: 'status',
  //       type: 'select',
  //       option: 'id',
  //       displayOption: 'reference'
  //     }
  //   ])
  // }, [listOperation, listEntreprise])

  return (
    <CrudDataTable
      query={data}
      columns={sousTraitantColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNewLink='/subcontractor/create'
      resource='sub-contractors'
      resource_name='Sous-traitants'
      handleChangeState={handleChangeState}
      state={state}
      total={data?.total}
      showFilter={true}
    />
  )
}

export default ListSousTritant
