import React, { useEffect, useState } from 'react'
import { Checkbox, Typography, Grid, Card, CardContent, Button, TextField } from '@mui/material'
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { usePostDataSyntheseAuditProject, usePvReceptionDataProject } from 'src/services/documentQuestions.service'
import { useRouter } from 'next/router'
import TextareaAutosize from '@mui/material/TextareaAutosize'

const PvReception = ({ redirect = false, idProject = '', detailsProject }) => {
  const router = useRouter()
  const { id } = router.query

  const [formInput, setFormInput] = useState({
    consistency_of_work_scenarios_checked: null,
    reception_is_pronounced: null,
    description_reception_is_pronounced: null
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (detailsProject) {
      setFormInput({
        consistency_of_work_scenarios_checked: detailsProject?.consistency_of_work_scenarios_checked,
        reception_is_pronounced: detailsProject?.reception_is_pronounced,
        description_reception_is_pronounced: detailsProject?.description_reception_is_pronounced
      })
    }
  }, [detailsProject])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const postPvReceptionDataMuattion = usePvReceptionDataProject({ id })

  const onSubmit = async () => {
    try {
      await postPvReceptionDataMuattion.mutateAsync(formInput)

      if (redirect) router.push(`/projects/${idProject}/edit`)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      {/* <CardContent>
        <div className='text-center'>
          <Typography color={'primary'} fontSize={20} sx={{ fontWeight: '600' }}>
            Synthèse à remplir par le professionnel ayant réalisé l'audit énergétique{' '}
          </Typography>
        </div>
      </CardContent> */}

      <CardContent sx={{ mt: 5 }}>
        <Grid mt={5} container alignItems={'center'}>
          <Grid item xs={12} md={2}>
            <Typography color={'secondary'} fontSize={16} sx={{ fontWeight: '600' }}>
              Après avoir visité la maison,
            </Typography>
          </Grid>
        </Grid>

        <Grid mt={2} container>
          <Grid item xs={12} md={12} display={'flex'} alignItems={'center'}>
            <Typography color={'text.text'} fontSize={16} sx={{ fontWeight: '400' }}>
              La cohérence des travaux entre les travaux réalisés et la scénario de travaux prévu a bien été vérifié ce
              jour en présence du bénéficiare et de l'accompagnateur rénov.
            </Typography>
            <FormControl sx={{ ml: '20px' }}>
              <RadioGroup
                row
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={formInput.consistency_of_work_scenarios_checked}
                onChange={event => {
                  handleChange('consistency_of_work_scenarios_checked', event.target.value)
                }}
              >
                <FormControlLabel labelPlacement='end' value={1} control={<Radio />} label='Oui' />
                <FormControlLabel labelPlacement='end' value={0} control={<Radio />} label='Non' />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid mt={5} container alignItems={'center'}>
          <Grid item xs={12} md={2} display={'flex'}>
            <Typography color={'text.text'} fontSize={16} sx={{ fontWeight: '400' }}>
              Et par suite
            </Typography>
            <Typography color={'secondary'} fontSize={16} sx={{ fontWeight: '600' }}>
              &nbsp;je déclare que :
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={formInput.reception_is_pronounced}
                onChange={event => {
                  handleChange('reception_is_pronounced', event.target.value)
                }}
              >
                <FormControlLabel
                  labelPlacement='end'
                  value={1}
                  control={<Radio />}
                  label='La réception est prononcée sans réserve'
                />
                <FormControlLabel
                  labelPlacement='end'
                  value={0}
                  control={<Radio />}
                  label='La réception est prononcée avec réserve
              mentionnées dans la liste suivante'
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container mt={5}>
          <Grid item xs={12} md={12}>
            <TextareaAutosize
              style={{
                width: '100%',
                border: '1px solid #0000003b',
                outline: 'none',
                padding: '10px',
                borderRadius: '10px'
              }}
              value={formInput?.description_reception_is_pronounced}
              onChange={e => handleChange('description_reception_is_pronounced', e.target.value)}
              aria-label='minimum height'
              minRows={6}
              placeholder='..................................................................................................................................................................................................................................................................................................................................................................'
            />
          </Grid>
        </Grid>
        <Grid mt={5} container item xs={12}>
          <div className='flex justify-end w-full mt-4'>
            <LoadingButton
              variant='contained'
              color='secondary'
              loading={postPvReceptionDataMuattion?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onSubmit()}
            >
              Enregistrer
            </LoadingButton>
          </div>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PvReception
