import React, { useEffect, useState } from 'react'
import FacturesColumns from './FactureColumns'
import useDebounce from 'src/hooks/useDebounce'
import { useGetSubscriptionInvoices } from 'src/services/subscription.service'
import { useAuth } from 'src/hooks/useAuth'

import CustomCollapsibleTable from 'src/components/table/CustomCollapseTable'
import FacturesLinesColumn from './FacturesLinesColumn'

const ListFactures = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')

  const stateInvoice = [
    {
      entitled: 'Nouveau facture',
      state: '0'
    },
    {
      entitled: 'Facture validé',
      state: 1
    },
    {
      entitled: 'Facture annulé',
      state: 2
    }
  ]

  const [rowTable, setrowTable] = React.useState(null)
  const debouncedSearchTerm = useDebounce(search, 1000)

  const {
    data: invoiceList,
    isLoading,
    isSuccess
  } = useGetSubscriptionInvoices({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    userId: user?.id,
    state
  })

  // **LIST COLUMNS
  const factureColumn = FacturesColumns({
    userRole: 'admin',
    resource_name: 'Abonnement',
    resource: 'subscription'
  })

  const factureLinesColumn = FacturesLinesColumn({
    userRole: 'admin',
    resource_name: 'Abonnement',
    resource: 'subscription'
  })

  // filter array
  const [arrayStateFilter, setArrayStateFilter] = React.useState([
    {
      title: 'État',
      setState: setState,
      data: stateInvoice,
      state: state,
      type: 'select',
      displayOption: 'entitled',
      option: 'state',
      value: state
    }
  ])

  useEffect(() => {
    setArrayStateFilter([
      {
        title: 'État',
        setState: setState,
        data: stateInvoice,
        state: state,
        type: 'select',
        displayOption: 'entitled',
        option: 'state',
        value: state
      }
    ])
  }, [state])

  return (
    <div className='mt-3'>
      <CustomCollapsibleTable
        query={invoiceList?.data}
        data={invoiceList?.data?.data}
        columns={factureColumn}
        columnsWork={factureLinesColumn}
        setrowTable={setrowTable}
        displayNameLines='lines'
        custom={false}
        isLoading={isLoading}
        showTitleDetails={true}
        titleCrud={'Factures'}
        total={invoiceList?.data?.data?.length}
        exportList={false}
        setSearch={setSearch}
        showHeader={true}
        resource_name='Abonnement'
        resource='subscription'
        showFilter={true}
        filterArray={arrayStateFilter}
        state={state}
        setState={setState}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      {/* <CustomeCollapsibleTable /> */}
    </div>
  )
}

export default ListFactures
