import { LoadingButton } from '@mui/lab'
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { MaterialUISwitch } from 'src/components/MuiSwitch'
import StepDocuments from 'src/components/StepDocuments'
import { useUpdateDepotAnah, useUpdateProjectStatus } from 'src/services/project.service'

const StepKeyDocuments = ({ detailsProject, depot }) => {
  const depotAnah = depot === 1 ? detailsProject?.depot_anah_1 : detailsProject?.depot_anah_2
  const [currentStatus, setCurrentStatus] = useState(depotAnah)
  const updateDepotAnahMutation = useUpdateDepotAnah({ id: detailsProject?.id })
  const isDisabled = detailsProject?.isEditable

  const [filter, setFilter] = useState(0)

  const handleChangeStatus = async event => {
    try {
      const state = event?.target?.value
      setCurrentStatus(state)

      await updateDepotAnahMutation.mutateAsync({ depot, value: state })
    } catch (error) {}
  }

  const handleDownloadButton = async (key = '') => {
    try {
      const win = window.open(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/projects/${detailsProject?.id}/download-all-documents/${key}`,
        '_blank'
      )
      win.focus()
    } catch (error) {}
  }

  const documents = useMemo(() => {
    if (filter) {
      return detailsProject?.documents?.filter(doc => doc?.exported === 1 && doc?.versions.length > 0)
    }

    return detailsProject?.documents?.filter(doc => doc?.versions.length > 0)
  }, [filter, detailsProject?.documents])

  return (
    <Grid container spacing={5} className='!mt-5 '>
      <Grid container item xs={12} display={'flex'} justifyContent={'space-evenly'}>
        <Grid item xs={12} md={12} display={'flex'} justifyContent={'center'} mb={8}>
          <FormControl color='secondary'>
            <RadioGroup
              sx={{ display: 'flex', flexDirection: 'row' }}
              value={currentStatus}
              onChange={handleChangeStatus}
            >
              <FormControlLabel
                value={0}
                control={<Radio color='warning' />}
                label='Dossier en attente de dépot'
                disabled={isDisabled}
              />
              <FormControlLabel
                value={1}
                control={<Radio color='secondary' />}
                label="Dossier envoyé à l'ANAH"
                disabled={isDisabled}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <LoadingButton
            startIcon={<IconifyIcon icon={'ep:download'} />}
            onClick={() => handleDownloadButton(1)}
            color='secondary'
            variant='outlined'
          >
            Telecharger Document clavis
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={3}>
          <LoadingButton
            startIcon={<IconifyIcon icon={'ep:download'} />}
            onClick={() => handleDownloadButton()}
            color='secondary'
            variant='outlined'
          >
            Telecharger Tous les documents
          </LoadingButton>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack direction='row' spacing={1} alignItems='center' justifyContent={'flex-end'}>
          <Typography>Tout les documents</Typography>
          <MaterialUISwitch
            checked={filter}
            onChange={() => {
              setFilter(!filter)
            }}
          />
          <Typography>Documents CLAVIS</Typography>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <StepDocuments
          clavis={true}
          detailsProject={detailsProject}
          typeProject={detailsProject?.type}
          stepDocuments={documents}
          id={detailsProject?.id}
          onlyView={true}
        />
      </Grid>
    </Grid>
  )
}

export default StepKeyDocuments
