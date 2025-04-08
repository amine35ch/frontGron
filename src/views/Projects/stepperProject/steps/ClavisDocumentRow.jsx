import { CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import IconifyIcon from 'src/@core/components/icon'
import DisplayFileDialog from 'src/components/DisplayFileDialog'
import { usePatchCurrentStep } from 'src/services/project.service'

export default function ClavisDocumentRow({ projectId, document }) {
  const { mutate, isPending } = usePatchCurrentStep({ id: projectId })
  const [open, setOpen] = useState(false)

  const onEditIconClick = () => {
    mutate({ step_order: document.order_step })
  }

  const handleDisplayFile = async file => {
    const reference = file?.reference
    try {
      await viewGeneralDocumentData.mutateAsync(reference)
    } catch (error) {}
    setOpen(true)
  }

  return (
    <>
      <Stack display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='body1' color='black' fontWeight={600}>
          {document.name}
        </Typography>
        <Stack display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Tooltip title='Voir document'>
            <IconButton onClick={() => handleDisplayFile(document.order_step)} color='secondary' title='Voir Document'>
              <IconifyIcon icon='carbon:data-view-alt' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Modifier le document'>
            <IconButton onClick={onEditIconClick} disabled={isPending}>
              {isPending ? <CircularProgress size={15} /> : <IconifyIcon icon='akar-icons:edit' />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      {open ? (
        <DisplayFileDialog
          src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + `/project-documents/${document?.id}/download`}
          open={open}
          handleCloseOpen={() => {
            setOpen(false)
          }}
          file={document}
        />
      ) : null}
    </>
  )
}
