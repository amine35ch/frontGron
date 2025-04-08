import { useRouter } from 'next/router'
import React from 'react'
import FormulaireCardUpdate from 'src/views/components/Formulaire/FormulaireCardUpdate'

const Formulaire = () => {
  const router = useRouter()
  const { id, idDocument } = router.query
 

  return <FormulaireCardUpdate idProject={id} idDocument={idDocument} />
}

export default Formulaire
