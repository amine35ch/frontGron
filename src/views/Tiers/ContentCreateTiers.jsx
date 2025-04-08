import { FormControlLabel, Grid, IconButton, Switch, TextField, Typography } from '@mui/material'

// ** Icon Imports
import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import InputPassword from 'src/components/InputPassword'
import renderArrayMultiline, { round } from 'src/@core/utils/utilities'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import CustomDatePicker from 'src/components/CustomDatePicker'
import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'
import { useEffect, useState } from 'react'
import {
  useDeleteDocumentForCompany,
  useDeleteDocumentCompanySpecificVersion,
  useUploadDocumentForCompany
} from 'src/services/tiers.service'
import CustomInputSirenSiretNumber from 'src/components/CustomInputSirenSiretNumber'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomUserPictureUpload from 'src/components/CustomUserPictureUpload'
import CustomBtnUpload from 'src/components/CustomBtnUpload'
import { useGetRaisonTypes } from 'src/services/settings.service'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import IdentifiantTVA from 'src/components/IdentifiantTVA'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'
import CustomInputRge from 'src/components/CustomInputRge'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import { useGetWorks } from 'src/services/work.service'
import IconifyIcon from 'src/@core/components/icon'
import { useGetListQualification } from 'src/services/company.service'
import { genreList } from '../clients/ContentCreateClient'

// ** Custom Component Imports

// ** Custom Components Imports

// ** Styled Components

const ContentCreateTiers = ({
  path,
  formInput,
  setFormInput,
  formErrors,
  showCompte,
  formInputFile,
  setformInputFile,
  handleChange,
  update,
  id,
  role,
  handleAddRemoveRge,
  listQualifications
}) => {
  // ** States
  const [openModalFile, setopenModalFile] = useState(false)
  const [formErrorsFiles, setformErrorsFiles] = useState(false)
  const [userData, setUserData] = useState(null) // State to hold user data

  const handleSelfCheckoutIn = e => {
    setFormInput({ ...formInput, selfCheckIn: e.target.checked ? 1 : 0 })
  }

  // ** REACT QUERY
  const { data: wroksData, isLoading, isSuccess } = useGetWorks({})
  const { data: listTypeSociete } = useGetRaisonTypes()

  const deleteDocumentCompanyMutation = useDeleteDocumentForCompany()
  const deleteSpecificVersionDocumentThirdPartyMutation = useDeleteDocumentCompanySpecificVersion()
  const uploadDocumentToCompanyMutation = useUploadDocumentForCompany({ id })

  const uploadDocumentToTiers = async nameOfVersion => {
    const formData = new FormData()

    for (let key in formInputFile) {
      if (key == 'files') {
        formInputFile?.files?.map((file, index) => {
          // formData.append(`signature`, file)
          formData.append(`documents[${index}][file]`, file?.file)

          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else if (nameOfVersion !== undefined) {
            formData.append(`documents[${index}][name]`, nameOfVersion)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      }
    }

    try {
      await uploadDocumentToCompanyMutation.mutateAsync(formData)
      setopenModalFile(false)
      setFormInput({ ...formInput, files: [] })
      setformInputFile({ ...formInputFile, files: [] })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setformErrorsFiles(errorsObject)
    }
  }

  const deleteDocument = async idDoc => {
    try {
      await deleteDocumentCompanyMutation.mutateAsync({ id: idDoc })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const deleteSpecificVersion = async idVersion => {
    try {
      await deleteSpecificVersionDocumentThirdPartyMutation.mutateAsync({ id: idVersion })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }
  const label = { inputProps: { 'aria-label': 'Color switch demo' } }
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData))
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error)
      }
    }
  }, [])

  return (
    <div className='h-full '>
      <CustomAccordian titleAccordian={'Informations générales'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid container item xs={12} md={6} className='!mb-2 !pt-0  '>
            <Grid item xs={12} md={3} className='!mb-2 !pt-0 '>
              <CustomUserPictureUpload
                fileTypes={['.png', '.jpeg', '.jpg']}
                limit={100}
                multiple={true}
                formInput={formInput}
                setFormInput={setFormInput}
                name='logo'
                update={update}
              />
            </Grid>
            <Grid container item xs={12} md={9} className='!mb-2  !pt-0'>
              <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Raison Social <strong className='text-red-500'>*</strong>
                </Typography>
                <TextField
                  placeholder='Raison Social'
                  size='small'
                  variant='outlined'
                  className='!mt-1 w-full !mr-2'
                  value={formInput?.trade_name}
                  onChange={e => {
                    handleChange('trade_name', e.target.value)
                  }}
                  error={formErrors?.trade_name}
                  helperText={renderArrayMultiline(formErrors?.trade_name)}
                />
              </Grid>
              <Grid item xs={12} md={12} className='!pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Forme juridique
                </Typography>

                <CustomeAutoCompleteSelect
                  value={formInput?.type_raison_sociale}
                  onChange={value => handleChange('type_raison_sociale', value)}
                  data={listTypeSociete}
                  option={'type'}
                  formError={formErrors}
                  error={formErrors?.type_raison_sociale}
                  displayOption={'entitled'}
                  helperText={renderArrayMultiline(formErrors?.type_raison_sociale)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={6} className='!mb-2 !pt-0'>
            <Grid item xs={12} md={12} className=' !pt-0'>
              <Grid item xs={12} md={12} className=' !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Numéro de téléphone
                </Typography>
                <CustomInputPhoneNumber
                  phoneValue={formInput?.phone_number_1}
                  setPhoneNumber={value => {
                    handleChange('phone_number_1', value)
                  }}
                  error={formErrors?.phone_number_1}
                  helperText={renderArrayMultiline(formErrors?.phone_number_1)}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} className='!pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Email
              </Typography>
              <TextField
                placeholder='Email'
                type='email'
                size='small'
                variant='outlined'
                className='w-full !mt-1'
                value={formInput?.email}
                onChange={e => {
                  handleChange('email', e.target.value)
                }}
                error={formErrors?.email}
                helperText={renderArrayMultiline(formErrors?.email)}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Adresse <strong className='text-red-500'>*</strong>
            </Typography>
            <TextField
              placeholder='Adresse'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.address}
              onChange={e => {
                handleChange('address', e.target.value)
              }}
              error={formErrors?.address}
              helperText={renderArrayMultiline(formErrors?.address)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Ville <strong className='text-red-500'>*</strong>
            </Typography>
            <TextField
              placeholder='Ville'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.city}
              onChange={e => {
                handleChange('city', e.target.value)
              }}
              error={formErrors?.city}
              helperText={renderArrayMultiline(formErrors?.city)}
            />
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Code postal <strong className='text-red-500'>*</strong>
            </Typography>

            <OnlyNumbersInput
              max={99999}
              placeholder='code postal'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.zip_code}
              onChange={e => {
                handleChange('zip_code', e.target.value)
              }}
              error={formErrors?.zip_code}
              helperText={renderArrayMultiline(formErrors?.zip_code)}
            />
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Site Web
            </Typography>
            <TextField
              placeholder='Site Web'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.website}
              onChange={e => {
                handleChange('website', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.website}
              helperText={renderArrayMultiline(formErrors?.website)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Montant du capital
            </Typography>
            <CustomCurrencyInput
              onChange={event => handleChange('capital', event.floatValue)}
              value={formInput?.capital}
              name='capital'
              fullWidth
              size='small'
              variant='outlined'
              error={formErrors?.capital}
              helperText={renderArrayMultiline(formErrors?.capital)}
            />
          </Grid>
          {formInput?.profile !== 'STT' ? (
            <>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Taux TVA
                </Typography>

                <CustomCurrencyInput
                  variant='outlined'
                  value={formInput?.tva * 100}
                  onChange={event => {
                    handleChange('tva', event.floatValue / 100)
                  }}
                  suffix={' %'}
                  decimalScale={2}
                  error={formErrors?.tva}
                  helperText={renderArrayMultiline(formErrors?.tva)}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ alignSelf: 'center' }} className='!mt-3 !pt-0'>
                <CustomBtnUpload
                  titleBtnUpload={'Signature'}
                  name='signature'
                  formInput={formInput}
                  setFormInput={setFormInput}
                />
              </Grid>
              {userData?.profile === 'VAE' && (
                <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Self check In
                  </Typography>
                  <Switch
                    {...label}
                    color='warning'
                    onChange={e => handleSelfCheckoutIn(e)}
                    checked={formInput?.selfCheckIn == 1 ? true : false}
                  />
                </Grid>
              )}
            </>
          ) : null}
        </Grid>
      </CustomAccordian>

      <CustomAccordian titleAccordian={'Représenté par'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Nom
            </Typography>
            <TextField
              placeholder='Nom'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.representative_last_name}
              onChange={e => {
                handleChange('representative_last_name', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.representative_last_name}
              helperText={renderArrayMultiline(formErrors?.representative_last_name)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prénom
            </Typography>
            <TextField
              placeholder='Prénom'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.representative_first_name}
              onChange={e => {
                handleChange('representative_first_name', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.representative_first_name}
              helperText={renderArrayMultiline(formErrors?.representative_first_name)}
            />
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Genre
            </Typography>
            <CustomeAutoCompleteSelect
              value={formInput?.representative_gender}
              onChange={value => handleChange('representative_gender', value)}
              data={genreList}
              option={'type'}
              formError={formErrors}
              error={formErrors?.representative_gender}
              displayOption={'entitled'}
              helperText={renderArrayMultiline(formErrors?.representative_gender)}
            />
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Fonction
            </Typography>
            <TextField
              placeholder='Fonction'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.position}
              onChange={e => {
                handleChange('position', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.position}
              helperText={renderArrayMultiline(formErrors?.position)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro de téléphone
            </Typography>
            <CustomInputPhoneNumber
              phoneValue={formInput?.phone_number_2}
              setPhoneNumber={value => {
                handleChange('phone_number_2', value)
              }}
              error={formErrors?.phone_number_2}
              helperText={renderArrayMultiline(formErrors?.phone_number_2)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Email
            </Typography>
            <TextField
              placeholder='Email'
              type='email'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.email_two}
              onChange={e => {
                handleChange('email_two', e.target.value)
              }}
              error={formErrors?.email_two}
              helperText={renderArrayMultiline(formErrors?.email_two)}
            />
          </Grid>

          {/* {formInput?.profile == 'AUD' ? (
            <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Qualifaction
              </Typography>
              <TextField
                placeholder='Qualifaction'
                size='small'
                variant='outlined'
                className='!mt-1 w-full !mr-2'
                value={formInput?.qualification_auditor}
                onChange={e => {
                  handleChange('qualification_auditor', e.target.value)
                }}
                error={formErrors?.qualification_auditor}
                helperText={renderArrayMultiline(formErrors?.qualification_auditor)}
              />
            </Grid>
          ) : null} */}
        </Grid>
      </CustomAccordian>

      <CustomAccordian
        titleAccordian={'RGE'}
        open={true}
        secondary={
          <IconButton
            onClick={event => {
              event.stopPropagation()
              handleAddRemoveRge('add')
            }}
            color={'primary'}
          >
            <IconifyIcon icon='ic:round-plus' />
          </IconButton>
        }
      >
        <Grid className='!mt-4' container spacing={5}>
          {formInput?.rges?.map((rge, index) => (
            <>
              <Grid item xs={12} md={3} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Qualification
                </Typography>
                <CustomeAutoCompleteSelectMultiple
                  data={listQualifications}
                  onChange={value => {
                    handleChange('rges', value, 'qualifications', index)
                  }}
                  value={rge.qualifications}
                  error={formErrors?.[`rges.${index}.qualifications`] ?? false}
                  helperText={renderArrayMultiline(formErrors?.[`rges.${index}.qualifications`])}
                  optionLabel='entitled'

                  // disabled={formInput?.profile !== 'INS'}
                />
              </Grid>

              <Grid item xs={12} md={3} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Numéro RGE
                </Typography>
                <TextField
                  placeholder='RGE'
                  size='small'
                  variant='outlined'
                  className='w-full'
                  value={rge.rge}
                  onChange={e => {
                    handleChange('rges', e.target.value, 'rge', index)
                  }}
                  sx={{ fontSize: '10px !important' }}
                  error={formErrors?.[`rges.${index}.rge`] ?? false}
                  helperText={renderArrayMultiline(formErrors?.[`rges.${index}.rge`])}
                />
              </Grid>
              <Grid item xs={12} md={2.5} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Edité le
                </Typography>
                <CustomDatePicker
                  dateFormat={'dd/MM/yyyy'}
                  backendFormat={'YYYY-MM-DD'}
                  dateValue={rge.start_date}
                  setDate={date => handleChange('rges', date, 'start_date', index)}
                />
              </Grid>
              <Grid item xs={12} md={2.5} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  VALABLE JUSQU'AU
                </Typography>
                <CustomDatePicker
                  dateFormat={'dd/MM/yyyy'}
                  backendFormat={'YYYY-MM-DD'}
                  dateValue={rge.end_date}
                  setDate={date => handleChange('rges', date, 'end_date', index)}
                  error={formErrors?.[`rges.${index}.end_date`] ?? false}
                  helperText={formErrors?.[`rges.${index}.end_date`]}
                />
              </Grid>
              <Grid item xs={12} md={0.5}></Grid>
              <Grid item xs={12} md={0.5}>
                <IconButton onClick={() => handleAddRemoveRge('remove', index)} color={'error'}>
                  <IconifyIcon icon='ic:round-minus' />
                </IconButton>
              </Grid>
            </>
          ))}
        </Grid>
      </CustomAccordian>

      <CustomAccordian titleAccordian={'Identifiants'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              SIREN
            </Typography>

            <CustomInputSirenSiretNumber
              value={formInput?.siren}
              setNumber={value => {
                handleChange('siren', value)
              }}
              error={formErrors?.siren}
              helperText={renderArrayMultiline(formErrors?.siren)}
            />
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              SIRET <strong className='text-red-500'>*</strong>
            </Typography>
            <CustomInputSirenSiretNumber
              value={formInput?.siret}
              setNumber={value => {
                handleChange('siret', value)
              }}
              error={formErrors?.siret}
              helperText={renderArrayMultiline(formErrors?.siret)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Identifiant TVA
              {/* <strong className='text-red-500'>*</strong> */}
            </Typography>
            <IdentifiantTVA
              value={formInput?.identifiant_tva}
              setNumber={value => {
                handleChange('identifiant_tva', value)
              }}
              error={formErrors?.identifiant_tva}
              helperText={renderArrayMultiline(formErrors?.identifiant_tva)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              RCS
            </Typography>
            <TextField
              placeholder='Numéro RCS'
              size='small'
              variant='outlined'
              className='!mt-1 w-full !mr-2'
              value={formInput?.company_rcs}
              onChange={e => {
                handleChange('company_rcs', e.target.value)
              }}
              error={formErrors?.company_rcs}
              helperText={renderArrayMultiline(formErrors?.company_rcs)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro APE
            </Typography>
            <TextField
              placeholder='Numéro APE'
              size='small'
              variant='outlined'
              className='!mt-1 w-full !mr-2'
              value={formInput?.num_ape}
              onChange={e => {
                handleChange('num_ape', e.target.value)
              }}
              error={formErrors?.num_ape}
              helperText={renderArrayMultiline(formErrors?.num_ape)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro d'agrément
            </Typography>
            <TextField
              placeholder="Numéro d'agrément"
              size='small'
              variant='outlined'
              className='!mt-1 w-full !mr-2'
              value={formInput?.approval_number}
              onChange={e => {
                handleChange('approval_number', e.target.value)
              }}
              error={formErrors?.approval_number}
              helperText={renderArrayMultiline(formErrors?.approval_number)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro décennal
            </Typography>
            <TextField
              placeholder='Numéro décennal'
              size='small'
              variant='outlined'
              className='!mt-1 w-full !mr-2'
              value={formInput?.num_decennale}
              onChange={e => {
                handleChange('num_decennale', e.target.value)
              }}
              error={formErrors?.num_decennale}
              helperText={renderArrayMultiline(formErrors?.num_decennale)}
            />
          </Grid>
          {/**  rge */}
          {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro RGE
            </Typography>
            <CustomInputRge
              value={formInput?.num_rge}
              setNumber={value => {
                handleChange('num_rge', value)
              }}
              error={formErrors?.num_rge}
              helperText={renderArrayMultiline(formErrors?.num_rge)}
            />

          </Grid> */}

          {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Date d'expiration RGE
            </Typography>
            <CustomDatePicker
              dateFormat={'dd/MM/yyyy'}
              backendFormat={'YYYY-MM-DD'}
              dateValue={formInput?.date_expiration_rge}
              setDate={date => handleChange('date_expiration_rge', date)}
              error={formErrors?.date_expiration_rge}
              helperText={renderArrayMultiline(formErrors?.date_expiration_rge)}
              minDate={true}
              maxDate={false}
            />
          </Grid> */}
        </Grid>
      </CustomAccordian>
      <CustomAccordian titleAccordian={'Assurance'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Raison Sociale
            </Typography>

            <TextField
              placeholder='Raison Sociale'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.insurance_name}
              onChange={e => {
                handleChange('insurance_name', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.insurance_name}
              helperText={renderArrayMultiline(formErrors?.insurance_name)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Adresse
            </Typography>

            <TextField
              placeholder=' Adresse'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.insurance_address}
              onChange={e => {
                handleChange('insurance_address', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.insurance_address}
              helperText={renderArrayMultiline(formErrors?.insurance_address)}
            />
          </Grid>
          {/*<Grid item xs={12} md={6} className='!mb-2 !pt-0'>
             <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Montant du capital social
            </Typography>
            <CustomCurrencyInput
              onChange={event => handleChange('insurance_capital', event.value)}
              value={formInput?.insurance_capital}
              name='insurance_capital'
              fullWidth
              size='small'
              variant='outlined'

              // label='Prix de vente'
            /> */}
          {/* <TextField
              placeholder='Résponsabilité Travaux'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.insurance_capital}
              onChange={e => {
                handleChange('insurance_capital', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.insurance_capital}
              helperText={renderArrayMultiline(formErrors?.insurance_capital)}
            />
          </Grid>*/}
          {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              RCS
            </Typography>
            <TextField
              placeholder='RCS'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.insurance_rcs}
              onChange={e => {
                handleChange('insurance_rcs', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.insurance_rcs}
              helperText={renderArrayMultiline(formErrors?.insurance_rcs)}
            />
          </Grid> */}

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro police
            </Typography>
            <TextField
              placeholder=' Numéro police'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput?.insurance_police}
              onChange={e => {
                handleChange('insurance_police', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.insurance_police}
              helperText={renderArrayMultiline(formErrors?.insurance_police)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Date d'émission
            </Typography>
            <CustomDatePicker
              dateFormat={'dd/MM/yyyy'}
              backendFormat={'YYYY-MM-DD'}
              dateValue={formInput?.emissions_date_assurance && formInput?.emissions_date_assurance}
              setDate={date => handleChange('emissions_date_assurance', date)}
              error={formErrors?.emissions_date_assurance}
              helperText={renderArrayMultiline(formErrors?.emissions_date_assurance)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Date de fin
            </Typography>
            <CustomDatePicker
              dateFormat={'dd/MM/yyyy'}
              backendFormat={'YYYY-MM-DD'}
              dateValue={formInput?.end_date_assurance && formInput?.end_date_assurance}
              setDate={date => handleChange('end_date_assurance', date)}
              error={formErrors?.end_date_assurance}
              helperText={renderArrayMultiline(formErrors?.end_date_assurance)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      {formInput?.profile == 'INS' && (
        <CustomAccordian titleAccordian={'Paramétrage'}>
          <Grid container mt={2} alignItems={'center'} spacing={2}>
            {/* <Grid item xs={12} md={2.5}>
              {formInput?.signature_interne !== undefined ? (
                <FormControlLabel
                  onChange={e => handleChange('signature_interne', e.target.checked ? 1 : 0)}
                  control={<Switch checked={formInput?.signature_interne} />}
                  label='Signature DoCuSign'
                />
              ) : null}
            </Grid> */}
            <Grid item xs={12} md={2.5}>
              {formInput?.fiche_navette_interne !== undefined ? (
                <FormControlLabel
                  onChange={e => handleChange('fiche_navette_interne', e.target.checked ? 1 : 0)}
                  control={<Switch checked={formInput?.fiche_navette_interne} />}
                  label="Générer Relevé d'audit "
                />
              ) : null}
            </Grid>
            <Grid item xs={12} md={2}>
              {formInput?.quotation_interne !== undefined ? (
                <FormControlLabel
                  onChange={e => handleChange('quotation_interne', e.target.checked ? 1 : 0)}
                  control={<Switch checked={formInput?.quotation_interne} />}
                  label='Générer Devis'
                />
              ) : null}
            </Grid>

            {/* <Grid
              item
              xs={12}
              md={5}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              className=' !pt-0 d-flex'
            >
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Nombre des dossiers maximal à crée par mois
              </Typography>
              <TextField
                placeholder='Numéro police'
                size='small'
                variant='outlined'
                className='!mt-1'
                value={formInput?.max_projects_per_month}
                onChange={e => {
                  handleChange('max_projects_per_month', e.target.value)
                }}
                sx={{ fontSize: '10px !important' }}
                error={formErrors?.max_projects_per_month}
                helperText={renderArrayMultiline(formErrors?.max_projects_per_month)}
              />
            </Grid> */}
          </Grid>
        </CustomAccordian>
      )}

      {update ||
        (role == 'collab' && (
          <CustomAccordian titleAccordian={'Identifiant plateforme'}>
            <Grid className='!mt-0' container spacing={5}>
              <Grid item xs={12} md={6}>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Identifiant
                </Typography>
                <TextField
                  placeholder='Identifiant'
                  size='small'
                  variant='outlined'
                  className='w-full !mt-1'
                  value={formInput?.username}
                  onChange={e => {
                    handleChange('username', e.target.value)
                  }}
                  error={formErrors?.username}
                  helperText={renderArrayMultiline(formErrors?.username)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  Mot de passe
                </Typography>
                <InputPassword
                  value={formInput?.password}
                  disabled={!showCompte}
                  handleChange={e => {
                    handleChange('password', e.target.value)
                  }}
                  error={formErrors?.password}
                  helperText={renderArrayMultiline(formErrors?.password)}
                />
              </Grid>
            </Grid>
          </CustomAccordian>
        ))}

      <CustomAccordian titleAccordian={'Documents'}>
        <Grid className='!mt-0' container spacing={5}>
          <Grid item xs={12} md={6}>
            {update ? (
              <AttachFileModalWithTable
                openModalFile={openModalFile}
                setopenModalFile={setopenModalFile}
                formInput={formInputFile}
                setFormInput={setformInputFile}
                arrayDocuments={formInput?.documents || []}
                uploadDocument={uploadDocumentToTiers}
                deleteDocument={deleteDocument}
                deleteSpecificVersion={deleteSpecificVersion}
                authorizeDelete={true}
                showInputName={true}
                formErrors={formErrorsFiles}
                onlyOthers={true}
                detailsProject={detailsProject}
              />
            ) : (
              <CustomComponentFileUpload
                fileTypes={['.png', '.pdf', '.jpeg', '.xlsx']}
                limit={50}
                multiple={true}
                formInput={formInput}
                setFormInput={setFormInput}
                name='documents'
                showInputName={true}
                formErrors={formErrors}
                onlyOthers={true}
              />
            )}
          </Grid>
        </Grid>
      </CustomAccordian>
    </div>
  )
}

export default ContentCreateTiers
