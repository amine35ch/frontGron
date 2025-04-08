import React, { useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography, Divider } from '@mui/material'

// ** Icon Imports
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useGetUnitType } from 'src/services/settings.service'
import CustomReactQuill from 'src/components/CustomReactQuill'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { useAuth } from 'src/hooks/useAuth'
import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'
import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import { useGetBrands } from 'src/services/brand.service'
import { useGetWorks } from 'src/services/work.service'
import { Tooltip, IconButton } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ContentCreateArticles = ({
  formInput,
  setFormInput,
  formErrors,
  handleChange,
  update,
  handleToggleAccesArticlesMuatation,
  disabledInput,
  detailsArticlesIsLoading,
  toggleAccessArticlesMutation,
  type
}) => {
  const { data: listUnit } = useGetUnitType()
  const { data: listBrands } = useGetBrands({ state: '1' })
  const { data: listWorks } = useGetWorks({})
  const { user } = useAuth()
  const [openModalFile, setopenModalFile] = useState(false)

  const handleUpdateDescriptio = value => {
    setFormInput(prev => {
      return { ...prev, description: value }
    })
  }

  const handleUploadFile = () => {}

  return (
    <div className='h-full '>
      <CustomAccordian className='' titleAccordian={'Informations générales'}>
        {detailsArticlesIsLoading ? (
          <Box
            sx={{
              height: '50vh',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <CircularProgress disableShrink sx={{ mt: 6 }} />
          </Box>
        ) : (
          <>
            {update && (
              <div className='flex items-center justify-between my-2'>
                <div className='flex items-center'>
                  {/* <Typography sx={{ fontWeight: '600' }}>Scoiété: &nbsp; </Typography> */}
                  <Tooltip sx={{ backgroundColor: '#72e1281f' }} title={'Propriétaire'}>
                    <IconButton>
                      <IconifyIcon color='#72E128' icon='mdi:user' />
                    </IconButton>
                  </Tooltip>
                  <Typography fontSize={15} sx={{ fontWeight: '400', ml: 2 }}>
                    {formInput?.company_name} &nbsp;{' '}
                  </Typography>
                </div>
                <div className='flex items-center'>
                  {/* <Typography sx={{ fontWeight: '600' }}>Accès: &nbsp; </Typography> */}
                  {/* <CustomChip
                    skin='light'
                    color={formInput?.access == '1' ? 'success' : 'error'}
                    onClick={() => handleToggleAccesArticlesMuatation()}
                    sx={{
                      fontWeight: '600',
                      fontSize: '.75rem',
                      height: '26px',
                      cursor: 'pointer'
                    }}
                    icon={
                      toggleAccessArticlesMutation?.isPending ? (
                        <CircularProgress size={15} />
                      ) : (
                        <Icon
                          icon={formInput?.access == '1' ? 'material-symbols:lock-open' : 'mdi:lock-off'}
                          fontSize={20}
                        />
                      )
                    }
                    label={formInput?.access == '1' ? 'Accés public' : 'Accés non public'}
                  /> */}

                  {formInput?.access == '1' ? (
                    <Tooltip
                      onClick={() => handleToggleAccesArticlesMuatation()}
                      title={user?.profile === 'MAR' ? 'Désactiver Accès pour tout le monde' : 'Désactiver'}
                    >
                      <IconButton>
                        <CustomChip
                          skin='light'
                          color={formInput?.access == '1' ? 'success' : 'error'}
                          sx={{
                            fontWeight: '600',
                            fontSize: '.75rem',
                            height: '26px',
                            cursor: 'pointer'
                          }}
                          icon={
                            toggleAccessArticlesMutation?.isPending ? (
                              <CircularProgress size={15} />
                            ) : (
                              <Icon
                                icon={formInput?.access == '1' ? 'material-symbols:lock-open' : 'mdi:lock-off'}
                                fontSize={20}
                              />
                            )
                          }
                          label={formInput?.access == '1' ? 'Accés public' : 'Accés non public'}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      onClick={() => handleToggleAccesArticlesMuatation()}
                      title={user?.profile == 'MAR' ? 'Activer Accès pour tout le monde ' : 'Activer Accès'}
                    >
                      <IconButton>
                        <CustomChip
                          skin='light'
                          color={formInput?.access == '1' ? 'success' : 'error'}
                          sx={{
                            fontWeight: '600',
                            fontSize: '.75rem',
                            height: '26px',
                            cursor: 'pointer'
                          }}
                          icon={
                            toggleAccessArticlesMutation?.isPending ? (
                              <CircularProgress size={15} />
                            ) : (
                              <Icon
                                icon={formInput?.access == '1' ? 'material-symbols:lock-open' : 'mdi:lock-off'}
                                fontSize={20}
                              />
                            )
                          }
                          label={formInput?.access == '1' ? 'Accés public' : 'Accés non public'}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
            <Divider className='!mt-4' sx={{ mx: 10 }} />
            <Grid mt={6} container spacing={5}>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Désignation <strong className='text-red-500'>*</strong>
                </Typography>
                <TextField
                  placeholder='Désignation'
                  size='small'
                  variant='outlined'
                  className='w-full !mt-1'
                  disabled={disabledInput}
                  value={formInput.designation}
                  onChange={e => {
                    handleChange('designation', e.target.value)
                  }}
                  error={formErrors?.designation}
                  helperText={renderArrayMultiline(formErrors?.designation)}
                />
              </Grid>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Unité <strong className='text-red-500'>*</strong>
                </Typography>

                <CustomeAutoCompleteSelect
                  option={'type'}
                  value={formInput.unit}
                  disabled={disabledInput}
                  onChange={value => handleChange('unit', value)}
                  data={listUnit}
                  formError={formErrors}
                  error={formErrors?.unit}
                  displayOption={'entitled'}
                  helperText={renderArrayMultiline(formErrors?.unit)}
                />
              </Grid>
              {type === '2' ? (
                <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Prix de vente HT <strong className='text-red-500'>*</strong>
                  </Typography>
                  <CustomCurrencyInput
                    onChange={event => handleChange('unit_price', event.floatValue)}
                    value={formInput.unit_price}
                    name='unit_price'
                    fullWidth
                    size='small'
                    variant='outlined'
                    error={formErrors?.unit_price}
                    helperText={renderArrayMultiline(formErrors?.unit_price)}
                  />
                </Grid>
              ) : null}
              {type === '0' ? (
                <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Marque
                  </Typography>
                  <CustomeAutoCompleteSelect
                    option={'id'}
                    disabled={disabledInput}
                    value={formInput.d_brand_id}
                    onChange={value => handleChange('d_brand_id', value)}
                    data={listBrands}
                    formError={formErrors}
                    error={formErrors?.d_brand_id}
                    displayOption={'entitled'}
                    helperText={renderArrayMultiline(formErrors?.d_brand_id)}
                  />
                </Grid>
              ) : null}
              {type !== '2' ? (
                <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Geste
                  </Typography>
                  <CustomeAutoCompleteSelectMultiple
                    option={'id'}
                    disabled={disabledInput}
                    value={formInput?.work_id}
                    onChange={value => handleChange('work_id', value)}
                    data={listWorks}
                    formError={formErrors}
                    error={formErrors?.work_id}
                    optionLabel={'reference'}
                    helperText={renderArrayMultiline(formErrors?.work_id)}
                  />
                </Grid>
              ) : null}
              {type !== '1' ? (
                <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold !mb-1' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Description Technique
                  </Typography>
                  <CustomReactQuill
                    disabled={disabledInput}
                    value={formInput.description}
                    height={'1rem'}
                    handleChange={handleUpdateDescriptio}
                  />
                </Grid>
              ) : null}
              {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Quantité
            </Typography>
            <TextField
              placeholder='Quantité'
              type='email'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.qte}
              onChange={e => {
                handleChange('qte', e.target.value)
              }}
              error={formErrors?.qte}
              helperText={renderArrayMultiline(formErrors?.qte)}
            />
          </Grid> */}
            </Grid>
          </>
        )}
      </CustomAccordian>

      {/* {!update && (
        <CustomAccordian titleAccordian={'Documents'}>
          <Grid className='!mt-0' container spacing={5}>
            <Grid item xs={12} md={12}>
              {update ? (
                <>
                  <AttachFileModalWithTable
                openModalFile={openModalFile}
                uploadDocument={() => setopenModalFile(false)}
                setopenModalFile={setopenModalFile}
                formInput={formInput}
                setFormInput={setFormInput}
                arrayDocuments={formInput?.documents || []}
                document={formInput?.download_path}
                authorizeDelete={false}
                showInputName={true}
                onlyOthers={true}
              />
                </>
              ) : (
                <CustomComponentFileUpload
                  showInputName={true}
                  fileTypes={['.png', '.pdf', '.jpeg', '.xlsx']}
                  limit={1}
                  multiple={false}
                  formInput={formInput}
                  setFormInput={setFormInput}
                  name='file'
                  onlyOthers={true}
                />
              )}
            </Grid>
          </Grid>
        </CustomAccordian>
      )} */}
    </div>
  )
}

export default ContentCreateArticles
