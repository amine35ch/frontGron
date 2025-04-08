import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import renderArrayMultiline from 'src/@core/utils/utilities'
import BtnColorSecondary from 'src/components/BtnColorSecondary'
import CustomFileUploadRestrictions from 'src/components/CustomFileUploadRestrictions'
import CustomModal from 'src/components/CustomModal'
import { useGetListCompany } from 'src/services/company.service'
import { useUpdateProjectOperation } from 'src/services/project.service'

const { Grid, Typography, Divider, Box, IconButton, TextField } = require('@mui/material')
const { default: CustomeAutoCompleteSelect } = require('src/components/CustomeAutoCompleteSelect')

const SetProjectInstaller = ({ formErrors, detailsProject = {}, handleSelectInstaller, installer, setInstaller }) => {
  const { data: ListInstaller } = useGetListCompany({ type: 'ins', profile: 'installers', display: 'short' })
  const updateProjectOperationMutation = useUpdateProjectOperation({ id: detailsProject?.id })
  const [openModalFile, setOpenModalFile] = useState(false)

  const [installerOperation, setInstallerOperation] = useState({
    d_company_id: detailsProject?.installer?.id || '',
    p_operation_id: 3
  })

  // useEffect(() => {
  //   setInstallerOperation(prev => {
  //     return { ...prev, d_company_id: detailsProject?.installer?.id }
  //   })
  // }, [])

  const handleSaveinstallerAction = async () => {
    try {
      await updateProjectOperationMutation.mutateAsync({ operations: [installerOperation] })
    } catch (error) {
      console.log(error)
    }
  }

  const handleOpenModalFile = () => {
    setOpenModalFile(true)
  }

  const handleCloseModalFile = () => {
    setOpenModalFile(false)
  }

  const addFile = () => {
    setOpenModalFile(false)
  }

  return (
    <>
      <Grid item xs={12} container>
        <Grid item container xs={12} md={12}>
          <Grid xs={12} md={5}>
            <Typography
              textTransform={'uppercase'}
              sx={{ fontSize: '15px', color: '#2a2e34', fontWeight: '600', mb: 6.5 }}
            >
              Entreprise retenue
            </Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <Typography
              textTransform={'uppercase'}
              sx={{ fontSize: '15px', color: '#2a2e34', fontWeight: '600', mb: 6.5 }}
            >
              Reference devis
            </Typography>
          </Grid>
        </Grid>

        <Grid item container xs={12} md={12}>
          <Grid item xs={12} md={4}>
            <CustomeAutoCompleteSelect
              value={installer?.id}
              onChange={value => {
                setInstaller(prev => {
                  return { ...prev, id: value }
                })
              }}
              data={ListInstaller}
              option={'id'}
              label='Entreprise retenue'
              displayOption={'trade_name'}
              withIcon={true}
              error={formErrors?.installer}
              helperText={formErrors?.installer}
            />
          </Grid>
          <Grid mt={1} item xs={12} md={4} display={'flex'} justifyContent={'center'}>
            <TextField
              placeholder='Référence'
              sx={{
                '& .MuiInputBase-root': {
                  '& input': {
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none'
                  }
                },
                '& .MuiInput-underline:before': {
                  borderBottom: 'none',
                  border: 'none',
                  outline: 'none'
                },

                '& .MuiInput-underline:after': {
                  border: 'none',
                  outline: 'none'
                },

                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  border: 'none',
                  outline: 'none'
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  border: 'none',
                  outline: 'none'
                },

                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                    outline: 'none'
                  },
                  '&:hover fieldset': {
                    border: 'none',
                    outline: 'none'
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                    outline: 'none'
                  }
                }
              }}
              variant='standard'
              value={installer?.reference}
              onChange={event => setInstaller(prev => ({ ...prev, reference: event.target.value }))}
              error={formErrors?.reference}
              helperText={renderArrayMultiline(formErrors?.reference)}
            />
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </>
  )
}

export default SetProjectInstaller
