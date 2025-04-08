import React from 'react'
import { Grid, Stack, TextField, Typography, useTheme } from '@mui/material'
import CardBgBorderGreen from 'src/components/CardBgBorderGreen'
import { useState } from 'react'
import CustomDatePicker from 'src/components/CustomDatePicker'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { reference } from '@popperjs/core'

const QuoteHeader = ({
  detailsProject,
  projectInvoice,
  displayOnly,
  editableNumFacture,
  detailsProfile,
  editableUser,
  installer,
  setInstaller,
  ListInstaller,
  formErrors,
  invoiceDate,
  setInvoiceDate,
  isUpdate
}) => {
  const theme = useTheme()

  const [localDetailsProfile, setLocalDetailsProfile] = useState(detailsProfile)
  const isDisabled = detailsProject.isEditable

  const updateInstallerDetails = installerId => {
    const selectedInstaller = ListInstaller.find(inst => inst.id === installerId)

    setInstaller(prev => ({
      ...prev,
      id: installerId,
      reference: selectedInstaller?.reference || ''
    }))

    setLocalDetailsProfile({
      trade_name: selectedInstaller?.trade_name,
      email: selectedInstaller?.email || '',
      phone_number_1: selectedInstaller?.phone_number_1 || '',
      address: selectedInstaller?.address || '',
      zip_code: selectedInstaller?.zip_code || '',
      city: selectedInstaller?.city || ''
    })
  }

  return (
    <>
      <Grid item xs={12} md={7}>
        {/* <Image src={projectInvoice?.installer?.logo} width={250} height={100} alt='logo' /> */}
      </Grid>
      <Grid item xs={0} md={2.5}></Grid>
      <Grid item xs={12} md={2.5}>
        <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
          <Stack spacing={2}>
            {!editableNumFacture ? (
              <Typography sx={{ fontWeight: 'bold' }}>{projectInvoice?.reference}</Typography>
            ) : (
              <TextField
                size='small'
                variant='standard'
                sx={{
                  '& .MuiInputBase-root': {
                    '& input': {
                      fontWeight: 'bold',
                      fontSize: '1rem !important',
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
                  }
                }}
                onChange={e => setInstaller({ ...installer, reference: e.target.value })}
                value={installer?.reference}
              />
            )}

            {displayOnly ? (
              <Typography sx={{ fontWeight: 'bold' }}>{projectInvoice?.invoice_date}</Typography>
            ) : (
              <>
                <CustomDatePicker
                  CustomeInputProps={{
                    variant: 'standard',
                    sx: {
                      '& .MuiInputBase-root': {
                        '& input': {
                          textAlign: 'center',
                          cursor: 'pointer'
                        }
                      },
                      '& .MuiInput-underline:before': {
                        borderBottom: 'none'
                      },

                      // remove focus underline
                      '& .MuiInput-underline:after': {
                        borderBottom: 'none'
                      },

                      // remove hover underline
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottom: 'none'
                      }
                    }
                  }}
                  dateFormat={'dd/MM/yyyy'}
                  backendFormat={'YYYY-MM-DD'}
                  dateValue={invoiceDate}
                  setDate={date => {
                    setInvoiceDate(date)
                  }}
                  disabled={isDisabled}
                />
              </>
            )}
          </Stack>
        </CardBgBorderGreen>
      </Grid>
      <Grid item xs={12} md={3}>
        <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
          <Stack spacing={2}>
            {editableUser ? (
              <CustomeAutoCompleteSelect
                value={installer?.id}
                onChange={value => updateInstallerDetails(value)}
                data={ListInstaller}
                disabled={isUpdate}
                option={'id'}
                displayOption={'trade_name'}
                withIcon={true}
                error={formErrors?.installer}
                helperText={formErrors?.installer}
                variant={'standard'}
              />
            ) : (
              <Typography sx={{ fontWeight: 'bold' }}>{localDetailsProfile?.trade_name}</Typography>
            )}

            <Typography sx={{}}>{localDetailsProfile?.email}</Typography>
            <Typography sx={{}}>{localDetailsProfile?.phone_number_1}</Typography>
            <Stack spacing={2}>
              <Typography sx={{}}>{localDetailsProfile?.city}</Typography>
              <Typography sx={{}}>{localDetailsProfile?.zip_code}</Typography>
              <Typography sx={{}}>{localDetailsProfile?.address}</Typography>
            </Stack>
          </Stack>
        </CardBgBorderGreen>
      </Grid>
      <Grid item xs={12} md={6}></Grid>
      <Grid item xs={12} md={3}>
        <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 'bold' }}>{detailsProject?.client?.reference}</Typography>
            <Typography
              sx={{}}
            >{`${detailsProject?.client?.first_name} ${detailsProject?.client?.last_name}`}</Typography>
            <Typography sx={{}}>{detailsProject?.client?.address}</Typography>
            <Typography sx={{}}>{detailsProject?.client?.city}</Typography>
            <Typography sx={{}}>{detailsProject?.client?.zip_code}</Typography>
            <Typography sx={{}}>{detailsProject?.client?.email_contact}</Typography>
            <Typography sx={{}}>{detailsProject?.client?.phone_number_1}</Typography>
          </Stack>
        </CardBgBorderGreen>
      </Grid>
    </>
  )
}

export default QuoteHeader
