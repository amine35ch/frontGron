import { useRouter } from 'next/router'
import React from 'react'
import FicheNavette from 'src/views/FicheNavette/FicheNavette'

const Test = () => {
  const router = useRouter()
  const { id, idDocument } = router.query

  return (
    <div>
      <FicheNavette idProject={id} idDocument={idDocument} />
    </div>
  )
}

export default Test
