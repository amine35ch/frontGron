import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'
import {
  useGetClients,
  useGetClientsProspects,
  useGetTypeClients,
  useUpdateTypeClients
} from 'src/services/client.service'
import CLientColum from './CLientColum'
import useStates from 'src/@core/hooks/useStates'
import useDebounce from 'src/hooks/useDebounce'

const ListClient = props => {
  const { getStatesByModel } = useStates()
  let clientType = props.clientType

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState(1)
  const [type, setType] = useState('')
  const [arrayStateFilter, setArrayStateFilter] = React.useState([])
  const debouncedSearchTerm = useDebounce(search, 1000)

  //** Query */
  const { data, isLoading, isSuccess } = useGetClients({
    search,
    paginated: true,
    pageSize,
    page,
    type: type.toString(),
    state,
    debouncedSearchTerm,
    clientType
  })
  const { data: listTypeClient, isPending, isError } = useGetTypeClients()
  const { mutate: acceptClient, isPendingAccept, isErrorAccept } = useUpdateTypeClients()

  //
  React.useEffect(() => {
    const stateList = getStatesByModel('DClient').filter(item => item.state !== null)

    setArrayStateFilter([
      {
        title: 'Type',
        setState: setType,
        data: listTypeClient,
        state: type,
        attribute: 'state',
        type: 'select',
        displayOption: 'entitled',
        option: 'type'
      }
    ])
  }, [getStatesByModel])

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  // **LIST COLUMNS
  const clientColumn = CLientColum({
    userRole: 'admin',
    resource: 'Clients',
    acceptFunct: client => acceptClient(client)
  })

  const exportListClients = async () => {
    window.open(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/clients/export?${search ? `search=${search}` : ''}`,
      '_blank'
    )
  }

  return (
    <CrudDataTable
      displayGeneratLink={true}
      query={data}
      columns={clientColumn}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      searchState={state}
      setSearch={setSearch}
      handleChangeState={handleChangeState}
      state={state}
      isLoading={isLoading}
      addNewLink='/beneficiaries/create'
      resource='clients'
      resource_name='Clients'
      total={data?.total}
      showFilter={true}
      exportList={true}
      functionExportList={exportListClients}
      isProspects={clientType === 1 ? 'prospect' : null}
    />
  )
}

export default ListClient
