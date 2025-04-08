import { Divider, Stack, Typography } from '@mui/material'

import ClavisDocumentRow from './ClavisDocumentRow'

export default function ClavisDocuments({ clavisDocs, projectId }) {
  if (clavisDocs?.length === 0)
    return (
      <Typography variant='body1' textAlign='center'>
        Aucun document Clavis
      </Typography>
    )

  return (
    <Stack spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
      {clavisDocs?.map((doc, index) => (
        <ClavisDocumentRow key={index} projectId={projectId} document={doc} />
      ))}
    </Stack>
  )
}
