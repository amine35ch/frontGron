import React, { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography, Divider, FormControlLabel, Switch } from '@mui/material'

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
import { useGetBars, useGetWorks } from 'src/services/work.service'
import { Tooltip, IconButton } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Textarea from 'src/components/TextArea'
import CustomDatePicker from 'src/components/CustomDatePicker'
import {
  useGetCategoriesList,
  useGetScaleList,
  useGetSubCategoriesList,
  useGetTVAList
} from 'src/services/articles.service'
import { set } from 'nprogress'
import { MaterialUISwitch } from 'src/components/MuiSwitch'
import UploadButton from 'src/components/UploadButton'
import dynamic from 'next/dynamic'
import CustomCurrencyInputV2 from 'src/components/CustomCurrencyInputV2'

const DynamicQuill = dynamic(() => import('../Projects/components/work-service/QuillJs'), { ssr: false })

const ContentCreateProduct = ({
  formInput,
  setFormInput,
  formErrors,
  handleChange,
  update,
  handleToggleAccesArticlesMuatation,
  disabledInput,
  detailsArticlesIsLoading,
  toggleAccessArticlesMutation,
  detailsArticlesIsFetching,
  type
}) => {
  const { data: listScale, isSuccess: localeScaleListIsSuccess } = useGetScaleList()

  // const { data: listUnit } = useGetUnitType()
  const [currentQuillInstance, setCurrentQuillInstance] = useState(null)
  const { data: listBrands } = useGetBrands({ state: '1' })
  const { data: listWorks } = useGetBars({})
  const { data: listCategories } = useGetCategoriesList({})
  const { data: listTVAS } = useGetTVAList({})
  const { data: listSubCategories } = useGetSubCategoriesList({})
  const { user } = useAuth()
  const [openModalFile, setopenModalFile] = useState(false)

  useEffect(() => {
    if (!currentQuillInstance) return

    // Handle text change
    currentQuillInstance.on('text-change', () => {
      const content = currentQuillInstance.root.innerHTML
      setFormInput(prev => {
        return {
          ...prev,
          designation: content
        }
      })
    })
  }, [!currentQuillInstance])

  const handleScaleChange = (index, value) => {
    setFormInput(prev => {
      const scales = prev?.scales || []

      scales[index].value = value

      return {
        ...prev,
        scales: scales
      }
    })
  }

  const handleBarsChange = value => {
    const scales = []

    value?.forEach(element => {
      // const scale = formInput?.scales?.find(scale => scale?.bars?.includes(element))
      // if (!scale) {
      const newScales = listScale
        ?.map(scale => {
          if (scale?.bars?.includes(element)) {
            const currentScale = formInput?.scales?.find(
              currentScale => currentScale?.scale_reference === scale?.reference
            )

            return {
              entitled: scale?.entitled,
              scale_reference: scale?.reference,
              value: currentScale?.value || '',
              unit: scale?.unit?.entitled,
              type: scale?.type,
              scale_list: scale?.scale_list,
              bars: scale?.bars
            }
          }
        })
        .filter(Boolean)

      // only  push scales that does not exist in the scales array
      const newScalesFiltered = newScales.filter(newScale => {
        return !scales.some(scale => scale?.scale_reference === newScale?.scale_reference)
      })
      scales.push(...newScalesFiltered)

      // } else {
      //   scales.push(scale)
      // }
    })
    setFormInput({
      ...formInput,
      bars: value,
      scales
    })
  }

  const handleSetCurrentQuillInstance = quillInstance => {
    setCurrentQuillInstance(quillInstance)
  }
  const { getAutorizedActionByModel } = useAuth()

  return (
    <div className='h-full '>
      <CustomAccordian className='' titleAccordian={'Informations générales'}>
        {detailsArticlesIsFetching ? (
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
                {getAutorizedActionByModel('articles', 'update access') && (
                  <div className='flex items-center'>
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
                )}
              </div>
            )}
            <Divider className='!mt-4' sx={{ mx: 10 }} />
            <Grid mt={6} container spacing={5}>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Type isolant/ Produit
                </Typography>
                <TextField
                  placeholder='Type isolant/ Produit'
                  size='small'
                  variant='outlined'
                  className='w-full !mt-1'
                  disabled={disabledInput}
                  value={formInput.type_produit_isolant}
                  onChange={e => {
                    handleChange('type_produit_isolant', e.target.value)
                  }}
                  error={formErrors?.type_produit_isolant}
                  helperText={renderArrayMultiline(formErrors?.type_produit_isolant)}
                />
              </Grid>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Catégorie <strong className='text-red-500'>*</strong>
                </Typography>
                <CustomeAutoCompleteSelect
                  option='category'
                  disabled={disabledInput}
                  value={formInput?.category}
                  onChange={value => handleChange('category', value)}
                  data={listCategories}
                  formError={formErrors}
                  error={formErrors?.category}
                  displayOption={'category'}
                  helperText={renderArrayMultiline(formErrors?.category)}
                />
              </Grid>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Marque <strong className='text-red-500'>*</strong>
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
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Sous-Catégorie <strong className='text-red-500'>*</strong>
                </Typography>
                <CustomeAutoCompleteSelect
                  option='sub_category'
                  disabled={disabledInput}
                  value={formInput?.sub_category}
                  onChange={value => handleChange('sub_category', value)}
                  data={listSubCategories}
                  formError={formErrors}
                  error={formErrors?.sub_category}
                  displayOption={'sub_category'}
                  helperText={renderArrayMultiline(formErrors?.sub_category)}
                />
              </Grid>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Référence <strong className='text-red-500'>*</strong>
                </Typography>
                <TextField
                  placeholder='Référence '
                  size='small'
                  variant='outlined'
                  className='w-full !mt-1'
                  disabled={disabledInput}
                  value={formInput.reference}
                  onChange={e => {
                    handleChange('reference', e.target.value)
                  }}
                  error={formErrors?.reference}
                  helperText={renderArrayMultiline(formErrors?.reference)}
                />
              </Grid>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Norme
                </Typography>
                <TextField
                  placeholder='Norme '
                  size='small'
                  variant='outlined'
                  className='w-full !mt-1'
                  disabled={disabledInput}
                  value={formInput.norme}
                  onChange={e => {
                    handleChange('norme', e.target.value)
                  }}
                  error={formErrors?.norme}
                  helperText={renderArrayMultiline(formErrors?.norme)}
                />
              </Grid>
              <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Désignation <strong className='text-red-500'>*</strong>
                </Typography>
                <DynamicQuill
                  disabled={disabledInput}
                  value={formInput.designation}
                  error={formErrors?.designation}
                  helperText={renderArrayMultiline(formErrors?.designation)}
                  handleSetCurrentQuillInstance={handleSetCurrentQuillInstance}
                />
              </Grid>
              <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
                <Divider sx={{ mx: 10 }} />
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography align='center' className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Acermi
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder='Reference'
                  size='small'
                  variant='outlined'
                  disabled={disabledInput}
                  value={formInput.reference_acerni}
                  onChange={e => {
                    handleChange('reference_acerni', e.target.value)
                  }}
                  error={formErrors?.reference_acerni}
                  helperText={renderArrayMultiline(formErrors?.reference_acerni)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDatePicker
                  placeholder='Date de validité'
                  disabled={disabledInput}
                  dateFormat={'dd/MM/yyyy'}
                  backendFormat={'YYYY-MM-DD'}
                  dateValue={formInput.date_validite_acerni}
                  setDate={date => handleChange('date_validite_acerni', date)}
                  error={formErrors?.date_validite_acerni}
                  helperText={renderArrayMultiline(formErrors?.date_validite_acerni)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <UploadButton titleBtnUpload={''} name='doc_acerni' formInput={formInput} setFormInput={setFormInput} />
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider sx={{ mx: 10 }} />
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography align='center' className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Certita
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder='Reference'
                  size='small'
                  variant='outlined'
                  disabled={disabledInput}
                  value={formInput.reference_certita}
                  onChange={e => {
                    handleChange('reference_certita', e.target.value)
                  }}
                  error={formErrors?.reference_certita}
                  helperText={renderArrayMultiline(formErrors?.reference_certita)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDatePicker
                  placeholder='Date de validité'
                  disabled={disabledInput}
                  dateFormat={'dd/MM/yyyy'}
                  backendFormat={'YYYY-MM-DD'}
                  dateValue={formInput.date_validite_certita}
                  setDate={date => handleChange('date_validite_certita', date)}
                  error={formErrors?.date_validite_certita}
                  helperText={renderArrayMultiline(formErrors?.date_validite_certita)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <UploadButton
                  titleBtnUpload={''}
                  name='doc_certita'
                  formInput={formInput}
                  setFormInput={setFormInput}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider sx={{ mx: 10 }} />
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography align='center' className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Avis technique
                </Typography>
              </Grid>
              <Grid item xs={12} md={3} className='!mb-2 '>
                <TextField
                  fullWidth
                  placeholder='Reference'
                  size='small'
                  variant='outlined'
                  disabled={disabledInput}
                  value={formInput.reference_avis_tech}
                  onChange={e => {
                    handleChange('reference_avis_tech', e.target.value)
                  }}
                  error={formErrors?.reference_avis_tech}
                  helperText={renderArrayMultiline(formErrors?.reference_avis_tech)}
                />
              </Grid>
              <Grid item xs={12} md={3} className='!mb-2 '>
                <CustomDatePicker
                  placeholder='Date de validité'
                  disabled={disabledInput}
                  dateFormat={'dd/MM/yyyy'}
                  backendFormat={'YYYY-MM-DD'}
                  dateValue={formInput.date_validite_avis_tech}
                  setDate={date => handleChange('date_validite_avis_tech', date)}
                  error={formErrors?.date_validite_avis_tech}
                  helperText={renderArrayMultiline(formErrors?.date_validite_avis_tech)}
                />
              </Grid>
              <Grid item xs={12} md={4} className='!mb-2 '>
                <UploadButton
                  titleBtnUpload={''}
                  name='doc_avis_tech'
                  formInput={formInput}
                  setFormInput={setFormInput}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider sx={{ mx: 10 }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography align='center' className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Fiche Technique
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <UploadButton
                  titleBtnUpload={''}
                  name='fiche_tech'
                  formInput={formInput}
                  setFormInput={setFormInput}
                  error={formErrors?.fiche_tech}
                  helperText={renderArrayMultiline(formErrors?.fiche_tech)}
                />
              </Grid>
              {/* <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
                <Divider sx={{ mx: 10 }} />
              </Grid>
              <Grid item xs={12} md={12} display='flex' justifyContent='space-around' className='!mb-2 !pt-0'>
                <FormControlLabel
                  sx={{
                    '.MuiFormControlLabel-label': {
                      fontWeight: 600,
                      color: '#2a2e34'
                    }
                  }}
                  control={<Switch defaultChecked />}
                  labelPlacement='start'
                  label='Marquage CE :'
                />
                <FormControlLabel
                  sx={{
                    '.MuiFormControlLabel-label': {
                      fontWeight: 600,
                      color: '#2a2e34'
                    }
                  }}
                  control={<Switch defaultChecked />}
                  labelPlacement='start'
                  label='Activer :'
                />
              </Grid> */}
            </Grid>
          </>
        )}
      </CustomAccordian>
      <CustomAccordian titleAccordian={'Prix'}>
        <Grid mt={5} mb={5} container display='flex' justifyContent='center' spacing={5}>
          <Grid item xs={12} md={3}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prix achat HT
            </Typography>
            <CustomCurrencyInputV2
              custome={true}
              variant='outlined'
              disabled={disabledInput}
              value={formInput.prix_achat_ht}
              onChange={event => handleChange('prix_achat_ht', event)}
              error={formErrors?.prix_achat_ht}
              helperText={renderArrayMultiline(formErrors?.prix_achat_ht)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prix achat TTC
            </Typography>
            <CustomCurrencyInputV2
              custome={true}
              variant='outlined'
              disabled={disabledInput}
              value={formInput.prix_achat_ttc}
              onChange={event => handleChange('prix_achat_ttc', event)}
              error={formErrors?.prix_achat_ttc}
              helperText={renderArrayMultiline(formErrors?.prix_achat_ttc)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prix de vente
            </Typography>
            <CustomCurrencyInputV2
              custome={true}
              variant='outlined'
              disabled={disabledInput}
              value={formInput.prix_vente_ht}
              onChange={event => handleChange('prix_vente_ht', event)}
              error={formErrors?.prix_vente_ht}
              helperText={renderArrayMultiline(formErrors?.prix_vente_ht)}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mx: 10 }} />
        <Grid container display='flex' justifyContent='center' spacing={5}>
          <Grid item xs={12} md={6}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Règle de taxe
            </Typography>
            <CustomeAutoCompleteSelect
              option='code'
              disabled={disabledInput}
              value={formInput?.tva}
              onChange={value => handleChange('tva', value)}
              data={listTVAS}
              formError={formErrors}
              error={formErrors?.tva}
              displayOption={'entitled'}
              helperText={renderArrayMultiline(formErrors?.tva)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      <CustomAccordian titleAccordian={'Caractéristiques'}>
        <Grid className='!mt-5' container spacing={5}>
          <Grid item xs={12} md={3} className='!mb-2 !pt-0'>
            <Typography align='center' className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Barèmes concernés
            </Typography>
          </Grid>
          <Grid item xs={12} md={5} className='!mb-2 !pt-0'>
            <CustomeAutoCompleteSelectMultiple
              uniqueOption={'reference'}
              disabled={disabledInput}
              value={formInput?.bars}
              onChange={handleBarsChange}
              data={listWorks}
              formError={formErrors}
              error={formErrors?.bars}
              optionLabel={'reference'}
              helperText={renderArrayMultiline(formErrors?.bars)}
            />
          </Grid>
          <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
            <Divider sx={{ mx: 10 }} />
          </Grid>
        </Grid>
        <Grid mt={8} px={10} container spacing={5}>
          {formInput?.scales?.map((item, index) => (
            <>
              <Grid key={index} item xs={12} md={1} className='!mb-2 !pt-0'></Grid>
              <Grid key={index} item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography align='right' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  {`${item?.entitled} :`}
                </Typography>
              </Grid>
              <Grid key={index} item xs={12} md={5} className='!mb-2 !pt-0'>
                {item?.type === 1 || item?.type === 2 ? (
                  <TextField
                    InputProps={{
                      endAdornment: item?.unit
                    }}
                    fullWidth
                    type={'text'}
                    size='small'
                    variant='outlined'
                    value={item?.value || ''}
                    onChange={e => {
                      handleScaleChange(index, e.target.value)
                    }}
                    error={formErrors[`scales.${index}.value`]}
                    helperText={renderArrayMultiline(formErrors[`scales.${index}.value`])}
                  />
                ) : null}
                {item?.type === 5 ? (
                  <CustomeAutoCompleteSelect
                    option={'entitled'}
                    disabled={disabledInput}
                    value={item?.value}
                    onChange={value => handleScaleChange(index, value)}
                    data={item?.scale_list}
                    formError={formErrors}
                    error={formErrors[`scales.${index}.value`]}
                    displayOption={'entitled'}
                    helperText={renderArrayMultiline(formErrors[`scales.${index}.value`])}
                  />
                ) : null}
              </Grid>
            </>
          ))}
        </Grid>
      </CustomAccordian>

      {/* <CustomAccordian titleAccordian={'Documents'}>
        <Grid className='!mt-0' container spacing={5}>
          <Grid item xs={12} md={12}>
            {update ? (
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
              />
            ) : (
              <CustomComponentFileUpload
                showInputName={true}
                fileTypes={['.png', '.pdf', '.jpeg', '.xlsx']}
                limit={1}
                multiple={false}
                formInput={formInput}
                setFormInput={setFormInput}
                name='file'
              />
            )}
          </Grid>
        </Grid>
      </CustomAccordian> */}
    </div>
  )
}

export default ContentCreateProduct
