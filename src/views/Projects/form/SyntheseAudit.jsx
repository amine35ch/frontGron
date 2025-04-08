import React, { useEffect, useState } from 'react'
import { Checkbox, Typography, Grid, Card, CardContent, Button, TextField } from '@mui/material'
import CustomDatePicker from 'src/components/CustomDatePicker'
import renderArrayMultiline from 'src/@core/utils/utilities'
import moment from 'moment'
import { LoadingButton } from '@mui/lab'
import { usePostDataSyntheseAuditProject } from 'src/services/documentQuestions.service'
import { useRouter } from 'next/router'

const SyntheseAudit = ({ noBorder = false, redirect = false, idProject = '', detailsProject }) => {
  const router = useRouter()
  const { id } = router.query
  const isDisabled = detailsProject.isEditable

  const [formInput, setFormInput] = useState({
    date_audit: moment(new Date()).format('YYYY-MM-DD'),
    audit_identifier: null,
    gaz_emission_after_work: null,
    gaz_emission_before_work: null,

    surface_housing_before_work: null,
    primary_energy_before_work: null,
    primary_energy_after_work: null,
    gain_energy: null,
    total_cost_energy_audit: null,
    dpe_before: null,
    dpe_after: null
  })
  useEffect(() => {
    detailsProject &&
      setFormInput({
        date_audit:
          detailsProject?.date_audit === null ? moment(new Date()).format('YYYY-MM-DD') : detailsProject?.date_audit,
        audit_identifier: detailsProject?.audit_identifier,
        gaz_emission_after_work: detailsProject?.gaz_emission_after_work,
        gaz_emission_before_work: detailsProject?.gaz_emission_before_work,
        primary_energy_before_work: detailsProject?.primary_energy_before_work,
        primary_energy_after_work: detailsProject?.primary_energy_after_work,
        gain_energy: detailsProject?.gain_energy,
        total_cost_energy_audit: detailsProject?.total_cost_energy_audit,
        dpe_before: detailsProject?.dpe_before,
        dpe_after: detailsProject?.dpe_after,
        surface_housing_before_work: detailsProject?.surface_housing_before_work
      })
  }, [detailsProject])

  const [formErrors, setFormErrors] = useState({})

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const postSyntheseAuditMuattion = usePostDataSyntheseAuditProject({ id })

  const onSubmit = async () => {
    try {
      await postSyntheseAuditMuattion.mutateAsync(formInput)

      if (redirect) router.push(`/projects/${idProject}/edit`)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const response = {
    response: {
      columns: [
        {
          reference: 'question',
          DisplayName: 'Question'
        },
        {
          reference: 'answer',
          DisplayName: 'Answer'
        }
      ],
      content: [
        {
          answer: '',
          question: ''
        },
        {
          answer: '',
          question: 'Consomation conventionnelle du logement rénové en énergie primaire:'
        },
        {
          answer: '',
          question: 'Gain énergétiqur rxprimé en %'
        },
        {
          answer: '',
          question: 'Gain énergétiqur rxprimé en %'
        },
        {
          answer: '',
          question: 'Gain énergétiqur rxprimé en %'
        },
        {
          answer: '',
          question: 'Gain énergétiqur rxprimé en %'
        },
        {
          answer: '',
          question: 'Gain énergétiqur rxprimé en %'
        },
        {
          answer: '',
          question: 'Gain énergétiqur rxprimé en %'
        }
      ]
    }
  }

  return (
    <Card sx={{ height: '100%', border: noBorder && 'none' }}>
      <CardContent>
        <div className='text-center'>
          <Typography color={'primary'} fontSize={20} sx={{ fontWeight: '600' }}>
            Synthèse à remplir par le professionnel ayant réalisé l'audit énergétique{' '}
          </Typography>
        </div>
      </CardContent>

      <CardContent sx={{ mt: 5 }}>
        <Grid mt={5} container alignItems={'center'}>
          <Grid item xs={12} md={2}>
            <Typography color={'secondary'} fontSize={16} sx={{ fontWeight: '600' }}>
              Identifiant d'audit
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              placeholder=''
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.audit_identifier}
              onChange={e => {
                handleChange('audit_identifier', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.audit_identifier}
              helperText={renderArrayMultiline(formErrors?.audit_identifier)}
              disabled={isDisabled}
            />
          </Grid>
        </Grid>
        <Grid mt={5} container alignItems={'center'}>
          <Grid item xs={12} md={2}>
            <Typography color={'secondary'} fontSize={16} sx={{ fontWeight: '600' }}>
              Date de facturation de l'audit
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomDatePicker
              dateFormat={'dd/MM/yyyy'}
              backendFormat={'YYYY-MM-DD'}
              dateValue={formInput?.date_audit}
              setDate={date => handleChange('date_audit', date)}
              error={formErrors?.date_audit}
              helperText={renderArrayMultiline(formErrors?.date_audit)}
              disabled={isDisabled}
            />
          </Grid>
        </Grid>

        <Grid mt={2} container>
          <Grid item xs={12} md={12}>
            <Typography color={'text.text'} fontSize={16} sx={{ fontWeight: '400' }}>
              En signant le présent document, le professionnel ayant réalisé l'audit énergétique certifie sur l'hon-
              neur que Il'audit énergétique a été réalisé conformément aux dispositions prévues par farrêté du 17
              novembre 2020 relatif aux caractéristiques techniques et madalités de réalisation des travauxet
              prestations dont les dépenses sont éligibles prime de transition énergétique. renseigne cides- uniquement
              les critères du projet de travaux retenu par le demandeur.
            </Typography>
          </Grid>
        </Grid>
        <Grid mt={5} container alignItems={'center'}>
          <Grid item xs={12} md={2}>
            <Typography color={'secondary'} fontSize={16} sx={{ fontWeight: '600' }}>
              Surface habitable²:
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              placeholder='m²'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.surface_housing_before_work}
              onChange={e => {
                handleChange('surface_housing_before_work', e.target.value)
              }}
              error={formErrors?.surface_housing_before_work}
              helperText={renderArrayMultiline(formErrors?.surface_housing_before_work)}
              sx={{ fontSize: '10px !important' }}
              disabled={isDisabled}
            />
          </Grid>
        </Grid>
        <Grid mt={5} container item xs={12}>
          <div className='my-2 w-full overflow-x-auto sm:-mx-0 !lg:-mx-8'>
            <div className='inline-block min-w-full py-1 align-middle '>
              <div className='overflow-hidden !border !border-gray-200 rounded-lg'>
                <table className='h-full min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg '>
                  <tbody className='divide-y divide-gray-200'>
                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Consommation conventionnelle du bâtiment avant les travaux en énergie primaire ( le chauffage,
                          le refroidissement et ka production d'eau chaude sanitaire):{' '}
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2 !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <div className='flex items-center'>
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            C initial=
                          </Typography>

                          <TextField
                            placeholder='.............................................'
                            size='small'
                            variant='standard'
                            error={formErrors?.primary_energy_before_work}
                            helperText={renderArrayMultiline(formErrors?.primary_energy_before_work)}
                            className='!mt-1 !w-[8rem] !ml-4 !mr-2'
                            value={formInput?.primary_energy_before_work}
                            onChange={e => handleChange('primary_energy_before_work', e.target.value)}
                            sx={{ fontSize: '10px !important' }}
                            disabled={isDisabled}
                          />
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            kWh/m²/an d'énergie primaire
                          </Typography>
                        </div>
                      </td>
                    </tr>

                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Consommation conventionnelle du logement rénové en énergie primaire:
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2 !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <div className='flex items-center'>
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            C projet=
                          </Typography>

                          <TextField
                            placeholder='.............................................'
                            size='small'
                            variant='standard'
                            className='!mt-1 !w-[8rem] !ml-4 !mr-2'
                            value={formInput?.primary_energy_after_work}
                            onChange={e => handleChange('primary_energy_after_work', e.target.value)}
                            sx={{ fontSize: '10px !important' }}
                            error={formErrors?.primary_energy_after_work}
                            helperText={renderArrayMultiline(formErrors?.primary_energy_after_work)}
                            disabled={isDisabled}
                          />
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            kWh/m²/an d'énergie primaire
                          </Typography>
                        </div>
                      </td>
                    </tr>

                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Gain énergétique exprimé en %{' '}
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2 !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <div className='flex items-center'>
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            G=
                          </Typography>

                          <TextField
                            placeholder='.............................................'
                            size='small'
                            variant='standard'
                            className='!mt-1 !w-[8rem] !ml-4 !mr-2'
                            value={formInput?.gain_energy}
                            onChange={e => handleChange('gain_energy', e.target.value)}
                            sx={{ fontSize: '10px !important' }}
                            error={formErrors?.gain_energy}
                            helperText={renderArrayMultiline(formErrors?.gain_energy)}
                            disabled={isDisabled}
                          />
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            en %
                          </Typography>
                        </div>
                      </td>
                    </tr>

                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Cout total de l'audit énergitque revenant au logemengt{' '}
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2 !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <div className='flex items-center'>
                          <TextField
                            placeholder='.............................................'
                            size='small'
                            variant='standard'
                            className='!mt-1 !w-[8rem]  !mr-2'
                            value={formInput?.total_cost_energy_audit}
                            onChange={e => handleChange('total_cost_energy_audit', e.target.value)}
                            sx={{ fontSize: '10px !important' }}
                            error={formErrors?.total_cost_energy_audit}
                            helperText={renderArrayMultiline(formErrors?.total_cost_energy_audit)}
                            disabled={isDisabled}
                          />
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            € TTC
                          </Typography>
                        </div>
                      </td>
                    </tr>

                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Émissions annuelles de gaz à effet de serre avant les travaux:
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2 !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <div className='flex items-center'>
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            GES initial=
                          </Typography>
                          <TextField
                            placeholder='.............................................'
                            size='small'
                            variant='standard'
                            className='!mt-1 !w-[8rem] !ml-4 !mr-2'
                            value={formInput?.gaz_emission_before_work}
                            onChange={e => handleChange('gaz_emission_before_work', e.target.value)}
                            sx={{ fontSize: '10px !important' }}
                            error={formErrors?.gaz_emission_before_work}
                            helperText={renderArrayMultiline(formErrors?.gaz_emission_before_work)}
                            disabled={isDisabled}
                          />

                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            kgeqCO₂/m²/an
                          </Typography>
                        </div>
                      </td>
                    </tr>
                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Émissions annuelles de gaz à effet de serre après les travaux:
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2 !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <div className='flex items-center'>
                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            GES final=
                          </Typography>
                          <TextField
                            placeholder='.............................................'
                            size='small'
                            variant='standard'
                            className='!mt-1 !w-[8rem] !ml-4 !mr-2'
                            value={formInput?.gaz_emission_after_work}
                            onChange={e => handleChange('gaz_emission_after_work', e.target.value)}
                            sx={{ fontSize: '10px !important' }}
                            error={formErrors?.gaz_emission_after_work}
                            helperText={renderArrayMultiline(formErrors?.gaz_emission_after_work)}
                            disabled={isDisabled}
                          />

                          <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                            kgeqCO₂/m²/an
                          </Typography>
                        </div>
                      </td>
                    </tr>
                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Étiquette DPE avant les travaux:{' '}
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <TextField
                          placeholder='.............................................'
                          size='small'
                          variant='standard'
                          className='!mt-1 !mr-2'
                          value={formInput?.dpe_before}
                          onChange={e => handleChange('dpe_before', e.target.value)}
                          sx={{ fontSize: '10px !important' }}
                          error={formErrors?.dpe_before}
                          helperText={renderArrayMultiline(formErrors?.dpe_before)}
                          disabled={isDisabled}
                        />
                      </td>
                    </tr>
                    <tr className={``}>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          Étiquette DPE après les travaux:{' '}
                        </Typography>
                      </td>
                      <td
                        className={`text-semiBold  !p-2    !ml-2`}
                        style={{
                          width: '50%',

                          borderLeft: '1px solid #e5e7eb'
                        }}
                      >
                        <TextField
                          placeholder='.............................................'
                          size='small'
                          variant='standard'
                          className='!mt-1  !mr-2'
                          value={formInput?.dpe_after}
                          onChange={e => handleChange('dpe_after', e.target.value)}
                          sx={{ fontSize: '10px !important' }}
                          error={formErrors?.dpe_after}
                          helperText={renderArrayMultiline(formErrors?.dpe_after)}
                          disabled={isDisabled}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='flex justify-end w-full mt-4'>
            <LoadingButton
              variant='contained'
              color='secondary'
              loading={postSyntheseAuditMuattion?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onSubmit()}
              disabled={isDisabled}
            >
              Enregistrer
            </LoadingButton>
          </div>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SyntheseAudit
