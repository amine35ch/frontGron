import { useRouter } from 'next/router'
import React from 'react'

const FicheNavette = () => {
  const router = useRouter()
  const { id, idDocument } = router.query



  return <FicheNavette idProject={id} idDocument={idDocument} />
}

export default FicheNavette
