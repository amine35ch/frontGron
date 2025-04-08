import { useRouter } from 'next/router'
import DocumentFactory from 'src/views/Projects/form'

const DocumentForm = () => {
  const router = useRouter()

  const { id, document } = router.query

  return <DocumentFactory typeProject={'projects'} id={id} document={document} />
}

export default DocumentForm
