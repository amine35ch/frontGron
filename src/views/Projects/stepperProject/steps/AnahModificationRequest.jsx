import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { Divider, IconButton, Stack, Typography } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import ModificationOrSuspendRequestCommentsSection from './ModificationRequestCommentsSection'
import { useUpdateProjectAnahResponse } from 'src/services/project.service'
import ClavisDocuments from './ClavisDocuments'

export default function AnahModificationRequest({ detailsProject }) {
  const [showCommentsSection, setShowCommentsSection] = useState(false)

  const { mutate, isPending } = useUpdateProjectAnahResponse({ id: detailsProject?.id })

  return (
    <Stack spacing={2} p={2} divider={<Divider orientation='horizontal' flexItem />} position='relative'>
      <ClavisDocuments clavisDocs={detailsProject?.clavis_documents} projectId={detailsProject?.id} />

      <>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography variant='body1' color='black'>
            Les modification sont terminées:{' '}
          </Typography>
          <LoadingButton variant='contained' size='small' loading={isPending} onClick={mutate}>
            Envoyer
          </LoadingButton>
        </Stack>
        {!showCommentsSection && (
          <IconButton
            color='primary'
            onClick={() => setShowCommentsSection(true)}
            sx={{
              position: 'absolute',
              bottom: '0',
              right: '0'
            }}
          >
            <IconifyIcon icon='ix:pen-filled' />
          </IconButton>
        )}
      </>

      {showCommentsSection && (
        <ModificationOrSuspendRequestCommentsSection
          projectId={detailsProject?.id}
          isReversible
          onCancel={() => setShowCommentsSection(false)}
        />
      )}
    </Stack>
  )
}
