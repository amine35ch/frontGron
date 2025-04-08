import { LoadingButton } from '@mui/lab'
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  TextField,
  Radio,
  FormControl,
  RadioGroup,
  Typography,
  Box
} from '@mui/material'
import { useEffect, useState } from 'react'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'

import StepDocuments from 'src/components/StepDocuments'
import { useGetListCompany } from 'src/services/company.service'
import { useMergeAgent, useUpdateProjectOperation } from 'src/services/project.service'

const StepDesignationAgent = ({ detailsProject }) => {
  const [mergeAgent, setMergeAgent] = useState(0)
  const [audit, setAudit] = useState(detailsProject?.auditor?.profile ? detailsProject?.auditor?.profile : 'MAR')

  const [mandatiare, setMandatiare] = useState(() => {
    if (
      detailsProject?.mandataire_admin?.id &&
      detailsProject?.mandataire_financier?.id &&
      detailsProject.mandataire_admin.id !== detailsProject.mandataire_financier.id
    ) {
      return 'FINANCIER_ADMINISTRATIF'
    }

    return 'MANDATAIRE'
  })
  const [formErrors, setFormErrors] = useState(null)
  const [auditorsList, setAuditorsList] = useState([])
  const [installersList, setInstallersList] = useState([])
  const [mandatairesList, setMandatairesList] = useState([])

  const [auditOperation, setAuditOperation] = useState({
    d_company_id: detailsProject?.auditor?.id || detailsProject?.mar?.id,
    p_operation_id: 2
  })

  const [installerOperation, setInstallerOperation] = useState({
    d_company_id: detailsProject?.installer?.id || '',
    p_operation_id: 3
  })

  const [mandaAdministratifOperation, setAdministratifMandaOperation] = useState({
    d_company_id: detailsProject?.mandataire_admin?.id || detailsProject?.mar?.id,
    p_operation_id: 5
  })

  const [mandaFinancierOperation, setFinancierMandaOperation] = useState({
    d_company_id: detailsProject?.mandataire_financier?.id || detailsProject?.mar?.id,
    p_operation_id: 4
  })

  //**  React query

  const { data: CompaniesList, isSuccess: isComaniesListSuccess } = useGetListCompany({
    profile: 'all',
    display: 'short'
  })
  const mergeAgentMutation = useMergeAgent({ id: detailsProject?.id })
  const updateProjectOperationMutation = useUpdateProjectOperation({ id: detailsProject?.id })
  const isDisabled = detailsProject.isEditable

  useEffect(() => {
    if (isComaniesListSuccess) {
      const ListAudit = []
      const ListInstaller = []
      const ListMandataire = []
      const ListClient = []

      // if (detailsProject?.client) {
      //   let client = detailsProject?.client
      //   client['trade_name'] =
      //     (client?.first_name?.toUpperCase() || '') + ' ' + (client?.last_name?.toUpperCase() || '')
      //   ListClient.push(client)
      // }

      ListMandataire.push(detailsProject?.mar)

      CompaniesList?.map(company => {
        if (company?.profile === 'BMAN' && detailsProject?.client?.code === company.code) {
          ListMandataire.push(company)
        }
        if (company?.profile === 'AUD') {
          ListAudit.push(company)
        }
        if (company?.profile === 'INS') {
          if (detailsProject?.installer?.id === company?.id) {
            ListMandataire.push(company)
          }
          ListInstaller.push(company)
        }
        if (company?.profile === 'MAN') {
          ListMandataire.push(company)
        }
      })
      setAuditorsList([...ListAudit])
      setInstallersList([...ListInstaller])
      const allListMandataire = ListMandataire.concat(ListClient)
      setMandatairesList([...allListMandataire])
    }
  }, [CompaniesList, isComaniesListSuccess])

  const handleChangeMandataire = (value, type = null) => {
    if (mandatiare === 'MANDATAIRE') {
      setAdministratifMandaOperation(prev => {
        return { ...prev, d_company_id: value }
      })
      setFinancierMandaOperation(prev => {
        return { ...prev, d_company_id: value }
      })
    } else {
      if (type === 'ADMINISTRATIF') {
        setAdministratifMandaOperation(prev => {
          return { ...prev, d_company_id: value }
        })
      } else {
        setFinancierMandaOperation(prev => {
          return { ...prev, d_company_id: value }
        })
      }
    }
  }

  const handleChangeInstaller = value => {
    const installer = installersList.find(installer => installer.id === value)
    if (!installer) {
      if (mandaAdministratifOperation.d_company_id === installerOperation.d_company_id) {
        setAdministratifMandaOperation(prev => {
          return { ...prev, d_company_id: '' }
        })
      }
      if (mandaFinancierOperation.d_company_id === installerOperation.d_company_id) {
        setFinancierMandaOperation(prev => {
          return { ...prev, d_company_id: '' }
        })
      }
      setMandatairesList(prev => prev.filter(item => item.id !== installerOperation.d_company_id))
      setInstallerOperation(prev => ({ ...prev, d_company_id: '' }))
    } else {
      setMandatairesList(prev => [...prev.filter(item => item.id !== installerOperation.d_company_id), installer])
      setInstallerOperation(prev => ({ ...prev, d_company_id: value }))
    }
  }

  const handleChangeAuditor = value => {
    setAuditOperation(prev => {
      return { ...prev, d_company_id: value }
    })
  }

  const handleChangeMergeAgent = async value => {
    setMergeAgent(value === false ? 0 : 1)
    const mergeAgent = value === false ? 0 : 1
    try {
      await mergeAgentMutation.mutateAsync({ merge_agent: mergeAgent })
    } catch (error) {}
  }

  const handleUpdateOperation = async () => {
    try {
      await updateProjectOperationMutation.mutateAsync({
        operations: [auditOperation, installerOperation, mandaAdministratifOperation, mandaFinancierOperation]
      })
    } catch (error) {
      setFormErrors(error.response.data.errors)
    }
  }

  const handleChange = selectedValue => {
    setMandatiare(selectedValue)

    if (selectedValue === 'MANDATAIRE') {
      setMandatiare(selectedValue)
    } else if (selectedValue === 'FINANCIER_ADMINISTRATIF') {
      setAdministratifMandaOperation(prev => ({
        ...prev,
        d_company_id: detailsProject?.mandataire_admin?.id || detailsProject?.mar?.id || ''
      }))
      setFinancierMandaOperation(prev => ({
        ...prev,
        d_company_id: detailsProject?.mandataire_financier?.id || detailsProject?.mar?.id || ''
      }))
    }
  }

  return (
    <Grid container spacing={5} className='!mt-5 '>
      <Grid item xs={12} container>
        <Grid item xs={12} md={12}>
          <Typography className='' sx={{ fontSize: '15px', color: '#2a2e34', fontWeight: '600', mb: 2 }}>
            Auditeur
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography sx={{ fontSize: '15px', fontWeight: '600' }}>L'audit est pris en charge par :</Typography>

            <FormControl>
              <RadioGroup
                row
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={audit}
                onChange={event => {
                  setAudit(event.target.value)
                  if (event.target.value === 'MAR') {
                    setAuditOperation(prev => {
                      return { ...prev, d_company_id: detailsProject?.mar?.id }
                    })
                  } else {
                    setAuditOperation(prev => {
                      return { ...prev, d_company_id: '' }
                    })
                  }
                }}
              >
                <FormControlLabel
                  labelPlacement='start'
                  value={'MAR'}
                  control={<Radio />}
                  label='Accompagnateur rénov'
                  disabled={isDisabled}
                />
                <FormControlLabel
                  labelPlacement='start'
                  value={'AUD'}
                  control={<Radio />}
                  label='Auditeur'
                  disabled={isDisabled}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={4} md={3}>
          {audit !== 'MAR' ? (
            <CustomeAutoCompleteSelect
              value={auditOperation.d_company_id}
              onChange={value => handleChangeAuditor(value)}
              data={auditorsList}
              option={'id'}
              displayOption={'trade_name'}
              withIcon={true}
              error={formErrors?.[`operations.0.d_company_id`]}
              helperText={renderArrayMultiline(formErrors?.[`operations.0.d_company_id`])}
              disabled={isDisabled}
            />
          ) : (
            <TextField
              fullWidth
              placeholder='Nom'
              size='small'
              variant='outlined'
              value={detailsProject?.mar?.trade_name}
              disabled={true || isDisabled}
            />
          )}
        </Grid>
      </Grid>

      <Grid item md={12} xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={12} md={12}>
          <Typography className='' sx={{ fontSize: '15px', color: '#2a2e34', fontWeight: '600', mb: 2 }}>
            Entreprise retenu
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}></Grid>
        <Grid item xs={12} md={2} pt={2}>
          <Typography sx={{ fontSize: '15px', fontWeight: '600', mr: 2 }}>
            Le dossier est pris en charge par:
          </Typography>
        </Grid>

        <Grid item xs={12} md={3} pt={2}>
          <CustomeAutoCompleteSelect
            value={installerOperation.d_company_id}
            onChange={value => handleChangeInstaller(value)}
            data={installersList}
            option={'id'}
            displayOption={'trade_name'}
            withIcon={true}
            error={
              formErrors?.['operations.1.d_company_id']
                ? formErrors?.['operations.1.d_company_id']
                : formErrors?.['operations.1.p_operation_id']
            }
            helperText={renderArrayMultiline(
              formErrors?.['operations.1.d_company_id']
                ? formErrors?.['operations.1.d_company_id']
                : formErrors?.['operations.1.p_operation_id']
            )}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
      <Grid item md={12} xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={12} md={12}>
          <Typography className='' sx={{ fontSize: '15px', color: '#2a2e34', fontWeight: '600', mb: 2 }}>
            Mandataire
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography sx={{ fontSize: '15px', fontWeight: '600', mr: 2 }}>
              Le dossier est pris en charge par:
            </Typography>

            <FormControl>
              <RadioGroup
                row
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={mandatiare}
                onChange={event => handleChange(event.target.value)}
              >
                <FormControlLabel
                  labelPlacement='end'
                  value={'MANDATAIRE'}
                  control={<Radio />}
                  label='Mandataire Financier & Administratif'
                  disabled={isDisabled}
                />
                <FormControlLabel
                  labelPlacement='end'
                  value={'FINANCIER_ADMINISTRATIF'}
                  control={<Radio />}
                  label='Deux Mandataires : 1 Administratif et 1 Financier '
                  disabled={isDisabled}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Grid>
        {mandatiare === 'MANDATAIRE' ? (
          <>
            <Grid item xs={12} md={3} pt={2}>
              <CustomeAutoCompleteSelect
                value={mandaAdministratifOperation.d_company_id}
                onChange={value => handleChangeMandataire(value)}
                data={mandatairesList}
                option={'id'}
                displayOption={'trade_name'}
                withIcon={true}
                error={
                  formErrors?.['operations.2.d_company_id']
                    ? formErrors?.['operations.2.d_company_id']
                    : formErrors?.['operations.2.p_operation_id']
                }
                helperText={renderArrayMultiline(
                  formErrors?.['operations.2.d_company_id']
                    ? formErrors?.['operations.2.d_company_id']
                    : formErrors?.['operations.2.p_operation_id']
                )}
                disabled={isDisabled}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={3} pt={2} mr={2}>
              <CustomeAutoCompleteSelect
                value={mandaAdministratifOperation.d_company_id}
                onChange={value => handleChangeMandataire(value, 'ADMINISTRATIF')}
                data={mandatairesList}
                option={'id'}
                displayOption={'trade_name'}
                withIcon={true}
                error={
                  formErrors?.['operations.2.d_company_id']
                    ? formErrors?.['operations.2.d_company_id']
                    : formErrors?.['operations.2.p_operation_id']
                }
                helperText={renderArrayMultiline(
                  formErrors?.['operations.2.d_company_id']
                    ? formErrors?.['operations.2.d_company_id']
                    : formErrors?.['operations.2.p_operation_id']
                )}
                getOptionDisabled={option => option.id === mandaFinancierOperation.d_company_id}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item xs={12} md={3} pt={2} ml={2}>
              <CustomeAutoCompleteSelect
                value={mandaFinancierOperation.d_company_id}
                onChange={value => handleChangeMandataire(value, 'FINANCIER')}
                data={mandatairesList}
                option={'id'}
                displayOption={'trade_name'}
                withIcon={true}
                error={
                  formErrors?.['operations.3.d_company_id']
                    ? formErrors?.['operations.3.d_company_id']
                    : formErrors?.['operations.3.p_operation_id']
                }
                helperText={renderArrayMultiline(
                  formErrors?.['operations.3.d_company_id']
                    ? formErrors?.['operations.3.d_company_id']
                    : formErrors?.['operations.3.p_operation_id']
                )}
                getOptionDisabled={option => option.id === mandaAdministratifOperation.d_company_id}
                disabled={isDisabled}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Grid item md={12} xs={12} mt={5} display='flex' justifyContent='flex-end'>
        <LoadingButton
          variant='outlined'
          loading={updateProjectOperationMutation.isPending}
          onClick={handleUpdateOperation}
          disabled={isDisabled}
        >
          Enregistrer
        </LoadingButton>
      </Grid>
    </Grid>
  )
}

export default StepDesignationAgent
