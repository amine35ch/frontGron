import React, { forwardRef, useEffect, useState } from 'react'
import { Box, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import CustomAccordian from 'src/components/CustomAccordian'

import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { useGetListCompany } from 'src/services/company.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CreateMandataire from 'src/views/mandataire/CreateMandataire'
import { useUpdateProjectAgent } from 'src/services/project.service'

const SelectMandataireFinancial = forwardRef((props, ref) => {
  const { getDetailsIsSuccess = false, SubmitButton = true, typeProject, redirect = false, detailsProject = {} } = props
  const router = useRouter()
  const theme = useTheme()

  // ** mutation pour mettre à jour le mandataire administratif
  const updatemandataireFinancialMutation = useUpdateProjectAgent({
    id: detailsProject?.id
  })

  const { data: listAgents, isFetching: agentListIsFetching } = useGetListCompany({
    profile: 'agents',
    display: 'short'
  })

  const [openModalAddAgent, setOpenModalAddAgent] = useState(false)
  const [mandataireFinancial, setMandataireFinancial] = useState({ value: false, agent: '' })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    setMandataireFinancial(prev => ({ ...prev, agent: detailsProject?.mandataire_financier?.id }))
  }, [])

  const handleSubmit = async () => {
    try {
      await updatemandataireFinancialMutation.mutateAsync({
        p_operation_id: 4,
        d_company_id: mandataireFinancial?.agent,
        general:0
      })
      redirect && router.push(`/projects/${detailsProject?.id}/edit`)
    } catch (error) {}
  }

  // const handleChangeMandataire = (name, selectedValues) => {
  //   setFormInput(prev => {
  //     return { ...prev, [name]: selectedValues }
  //   })
  // }

  return (
    <div>
      <CustomAccordian titleAccordian={'Identité du mandataire administratif'}>
        <Grid item xs={12} container mt={5}>
          <Grid item xs={12} md={12} container>
            <Grid item xs={12} md={6}>
              <Box pt={5}>
                <Typography textTransform={'uppercase'} sx={{ fontSize: '15px', color: '#2a2e34', fontWeight: '600' }}>
                  Mandataire FINANCIER
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} pt={3} container>
              <Grid item xs={12} md={11.4}>
                {!agentListIsFetching && detailsProject?.mar ? (
                  <CustomeAutoCompleteSelect
                    value={mandataireFinancial.agent}
                    onChange={value => {
                      setMandataireFinancial(prev => {
                        return { ...prev, agent: value }
                      })
                    }}
                    label='Selectionner mandataire Financier'
                    data={[...listAgents, detailsProject?.mar] || []}
                    option={'id'}
                    formError={formErrors}
                    error={formErrors?.d_company_id}
                    displayOption={'trade_name'}
                    helperText={renderArrayMultiline(formErrors?.d_company_id)}
                  />
                ) : null}
              </Grid>
              <Grid item xs={12} md={0.6}>
                <IconButton onClick={() => setOpenModalAddAgent(true)} aria-label='Ajouter Bénéficiaire' size='small'>
                  <IconifyIcon
                    icon='material-symbols-light:real-estate-agent-outline'
                    color='#585DDB'
                    fontSize='35px'
                  />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} xs={12} mb={10}>
            <Divider />
          </Grid>
        </Grid>
      </CustomAccordian>
      {SubmitButton ? (
        <Grid container justifyContent='flex-end'>
          <Grid item>
            <LoadingButton
              variant='contained'
              color='secondary'
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={handleSubmit}
            >
              Enregistrer
            </LoadingButton>
          </Grid>
        </Grid>
      ) : null}
      {openModalAddAgent && (
        <CreateMandataire
          setProjectFormInput={setMandataireAdministratif}
          path={'/agents'}
          modalTitle={'Ajouter Mandataire'}
          addTiersWithModal={true}
          setOpenModalAddEntreprise={setOpenModalAddAgent}
          openModalAddEntreprise={openModalAddAgent}
        />
      )}
    </div>
  )
})

export default SelectMandataireFinancial
