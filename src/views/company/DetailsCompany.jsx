import React from 'react'
import CardDetails from '../components/CardDetails'
import { useRouter } from 'next/router'
import { useGetDetailClient } from 'src/services/client.service'

const DetailsCompany = () => {
  const router = useRouter()
  const { id } = router.query
  const { data } = useGetDetailClient({ id })

  return <CardDetails dataDetails={data} />
}

export default DetailsCompany
