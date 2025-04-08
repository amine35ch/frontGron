import React, { useState } from 'react'
import CrudDataTable from 'src/components/CrudDataTable'

import useDebounce from 'src/hooks/useDebounce'
import ArticlesColum from './ArticlesColum'
import { useGetArticles } from 'src/services/articles.service'

const ListArticles = ({ type }) => {
  // const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [state, setState] = useState('')
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 1000)
  const [showAll, setShowAll] = useState('1')

  // **LIST COLUMNS
  const articlesColum = ArticlesColum({
    userRole: 'admin',
    resource: 'articles',
    resource_name: 'Articles',
    type: type
  })

  const { data, isLoading, isSuccess } = useGetArticles({
    debouncedSearchTerm,
    paginated: true,
    pageSize,
    page,
    state,
    type
  })

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  return (
    <CrudDataTable
      query={data}
      columns={articlesColum}
      data={data?.data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      addNew={true}
      addNewLink={
        type == '1'
          ? '/Catalog/services/create'
          : type == '0'
          ? '/Catalog/products/create'
          : '/Catalog/prestations-mar/create'
      }
      handleChangeState={handleChangeState}
      state={state}
      resource='articles'
      resource_name='Articles'
      titleCrud={type == '1' ? 'Prestations' : type == '0' ? 'Produits' : type == '2' ? 'Prestations Mar' : ''}
      total={data?.total}
      showFilter={true}
      showAllSection={true}
      setState={setState}
      showAll={showAll}
      setShowAll={setShowAll}
    />
  )
}

export default ListArticles
