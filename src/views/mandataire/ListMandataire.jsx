import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import useDebounce from 'src/hooks/useDebounce'
import { useGetListCompany } from 'src/services/company.service'
import { useAuth } from 'src/hooks/useAuth'
import EntrepriseColum from '../installateur/EntrepriseColum'
import MandataireColum from './MandataireColum'

const ListMandataire = () => {
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState(1)
  const debouncedSearchTerm = useDebounce(search, 1000)

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  // **LIST COLUMNS

  const mandataireColumn = MandataireColum({
    userRole: 'admin',
    resource: 'agents',
    resource_name: 'Mandataires'
  })

  const { data, isLoading, isSuccess } = useGetListCompany({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    type: 'man',
    profile: 'agents',
    id: auth?.user?.userable_id,
    state
  })

  return (
    <CrudDataTable
      query={data}
      columns={mandataireColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNew={true}
      addNewLink='/agents/create'
      resource='agents'
      resource_name='Mandataires'
      handleChangeState={handleChangeState}
      state={state}
      total={data?.total}
      showFilter={true}
      exportList={false}
    />
  )
}

export default ListMandataire
