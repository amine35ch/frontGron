// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import moment from 'moment'

import CustomModal from 'src/components/CustomModal'
import ContentCreateTiers from '../Tiers/ContentCreateTiers'
import { useCreateCompany } from 'src/services/company.service'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomInputSirenSiretNumber from 'src/components/CustomInputSirenSiretNumber'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'
import renderArrayMultiline from 'src/@core/utils/utilities'
import IdentifiantTVA from 'src/components/IdentifiantTVA'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import CustomBtnUpload from 'src/components/CustomBtnUpload'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import CustomUserPictureUpload from 'src/components/CustomUserPictureUpload'
import { useGetRaisonTypes } from 'src/services/settings.service'
import CustomDatePicker from 'src/components/CustomDatePicker'
import { genreList } from '../clients/ContentCreateClient'

const CreateMandataire = ({
  setProjectFormInput,
  path,
  addTiersWithModal,
  openModalAddEntreprise,
  setOpenModalAddEntreprise
}) => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    representative_last_name: '',
    representative_first_name: '',
    representative_gender: '',
    email: '',
    files: [],
    city: '',
    zip_code: '',
    address: '',
    phone_number_1: '',
    phone_number_2: '',
    representative: '',
    num_rge: '',
    siren: '',
    operations: [4],
    date_expiration_rge: moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
    email_two: '',
    identifiant_tva: '',
    tva: '',
    siret: '',
    logo: [],
    signature: [],
    profile: 'MAN',
    assurance_type: '',
    position: '',
    trade_name: '',
    type_raison_sociale: '',
    website: '',
    insurance_rcs: '',
    insurance_address: '',
    insurance_capital: 0,
    insurance_police: '',
    insurance_name: '',
    insurance_date: '',
    insurance_siret: '',
    num_ape: '',
    capital: '',
    approval_number: '',
    num_decennale: '',
    num_decennale: '',
    emissions_date_assurance: moment(new Date()).format('YYYY-MM-DD'),
    end_date_assurance: moment(new Date()).add(1, 'y').format('YYYY-MM-DD')
  })

  const [showCompte, setShowCompte] = useState(false)
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createCompanyMutation = useCreateCompany({ profile: 'agents' })
  const { data: listTypeSociete } = useGetRaisonTypes()

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const formData = new FormData()

    for (let key in formInput) {
      if (key === 'operations') {
        formInput.operations.forEach((id, index) => {
          formData.append(`operations[${index}]`, id)
        })
      } else if (key === 'logo') {
        formInput?.logo?.forEach((file, index) => {
          formData.append(`logo`, file)
        })
      } else if (key === 'signature') {
        formInput?.signature?.forEach((file, index) => {
          formData.append(`signature`, file)
        })
      } else if (key === 'files') {
        formInput?.files?.map((file, index) => {
          formData.append(`documents[${index}][file]`, file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      } else formData.append(key, formInput[key])
    }
    try {
      const response = await createCompanyMutation.mutateAsync(formData)

      if (openModalAddEntreprise) {
        setOpenModalAddEntreprise(false)
        setProjectFormInput(prev => {
          return { ...prev, agent: response?.data.data.id }
        })

        return true
      } else {
        router.push('/agents')
      }
      setOpenModalAddEntreprise(false)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)

      return false
    }
  }

  return (
    <div>
      {addTiersWithModal ? (
        <CustomModal
          open={openModalAddEntreprise}
          handleCloseOpen={() => setOpenModalAddEntreprise(false)}
          btnTitle={'Ajouter'}
          ModalTitle={'Ajouter Mandataire'}
          isLoading={false}
          action={onSubmit}
          widthModal={'lg'}
          btnTitleClose={openModalAddEntreprise}
          btnCanceledTitle='Annuler'
        >
          <div className='h-full '>
            <CustomAccordian titleAccordian={'Informations générales'}>
              <Grid className='!mt-4' container spacing={5}>
                <Grid container item xs={12} md={6} className='!mb-2 !pt-0  '>
                  <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
                    <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                      Raison Social <strong className='text-red-500'>*</strong>
                    </Typography>
                    <TextField
                      placeholder='Raison Social'
                      size='small'
                      variant='outlined'
                      className='!mt-1 w-full !mr-2'
                      value={formInput.trade_name}
                      onChange={e => {
                        handleChange('trade_name', e.target.value)
                      }}
                      error={formErrors?.trade_name}
                      helperText={renderArrayMultiline(formErrors?.trade_name)}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Grid item xs={12} md={12} className=' !pt-0'>
                    <Grid item xs={12} md={12} className=' !pt-0'>
                      <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                        Numéro de téléphone <strong className='text-red-500'>*</strong>
                      </Typography>
                      <CustomInputPhoneNumber
                        phoneValue={formInput.phone_number_1}
                        setPhoneNumber={value => {
                          handleChange('phone_number_1', value)
                        }}
                        error={formErrors?.phone_number_1}
                        helperText={renderArrayMultiline(formErrors?.phone_number_1)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6} className='!pt-0'>
                  <Grid item xs={12} md={12} className=' !pt-0'>
                    <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                      Email <strong className='text-red-500'>*</strong>
                    </Typography>
                    <TextField
                      placeholder='Email'
                      type='email'
                      size='small'
                      variant='outlined'
                      className='w-full !mt-1'
                      value={formInput.email}
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
                    Adresse
                  </Typography>
                  <TextField
                    placeholder='Adresse'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.address}
                    onChange={e => {
                      handleChange('address', e.target.value)
                    }}
                    error={formErrors?.address}
                    helperText={renderArrayMultiline(formErrors?.address)}
                  />
                </Grid>
                <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Ville
                  </Typography>
                  <TextField
                    placeholder='Ville'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.city}
                    onChange={e => {
                      handleChange('city', e.target.value)
                    }}
                    error={formErrors?.city}
                    helperText={renderArrayMultiline(formErrors?.city)}
                  />
                </Grid>

                <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    Code postal
                  </Typography>

                  <OnlyNumbersInput
                    max={99999}
                    placeholder='code postal'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.zip_code}
                    onChange={e => {
                      handleChange('zip_code', e.target.value)
                    }}
                    error={formErrors?.zip_code}
                    helperText={renderArrayMultiline(formErrors?.zip_code)}
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
                    value={formInput.representative_last_name}
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
                    value={formInput.representative_first_name}
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
                    value={formInput.representative_gender}
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
                    value={formInput.position}
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
                    phoneValue={formInput.phone_number_2}
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
                    value={formInput.email_two}
                    onChange={e => {
                      handleChange('email_two', e.target.value)
                    }}
                    error={formErrors?.email_two}
                    helperText={renderArrayMultiline(formErrors?.email_two)}
                  />
                </Grid>
              </Grid>
            </CustomAccordian>

            <CustomAccordian titleAccordian={'Identifiants'}>
              <Grid className='!mt-4' container spacing={5}>
                <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    SIREN
                  </Typography>

                  <CustomInputSirenSiretNumber
                    value={formInput.siren}
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
                    value={formInput.siret}
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
                  </Typography>
                  <IdentifiantTVA
                    value={formInput.identifiant_tva}
                    setNumber={value => {
                      handleChange('identifiant_tva', value)
                    }}
                    error={formErrors?.identifiant_tva}
                    helperText={renderArrayMultiline(formErrors?.identifiant_tva)}
                  />
                </Grid>
                {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    TVA <strong className='text-red-500'>*</strong>
                  </Typography>
                  <TextField
                    placeholder='TVA'
                    size='small'
                    variant='outlined'
                    className='!mt-1 w-full !mr-2'
                    value={formInput.tva}
                    onChange={e => {
                      handleChange('tva', e.target.value)
                    }}
                    error={formErrors?.tva}
                    helperText={renderArrayMultiline(formErrors?.tva)}
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
                    value={formInput.insurance_name}
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
                    value={formInput.insurance_address}
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
              value={formInput.insurance_capital}
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
              value={formInput.insurance_capital}
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
              value={formInput.insurance_rcs}
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
                    value={formInput.insurance_police}
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
                    SIRET
                  </Typography>

                  <CustomInputSirenSiretNumber
                    value={formInput.insurance_siret}
                    setNumber={value => {
                      handleChange('insurance_siret', value)
                    }}
                    error={formErrors?.insurance_siret}
                    helperText={renderArrayMultiline(formErrors?.insurance_siret)}
                  />
                </Grid>
              </Grid>
            </CustomAccordian>
          </div>
        </CustomModal>
      ) : (
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

                    // update={update}
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
                      value={formInput.trade_name}
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
                      value={formInput.type_raison_sociale}
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
                      phoneValue={formInput.phone_number_1}
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
                    Email <strong className='text-red-500'>*</strong>
                  </Typography>
                  <TextField
                    placeholder='Email'
                    type='email'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.email}
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
                  value={formInput.address}
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
                  value={formInput.city}
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
                  value={formInput.zip_code}
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
                  value={formInput.website}
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
                  value={formInput.capital}
                  name='capital'
                  fullWidth
                  size='small'
                  variant='outlined'
                  error={formErrors?.capital}
                  helperText={renderArrayMultiline(formErrors?.capital)}
                />
              </Grid>
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
                  value={formInput.representative_last_name}
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
                  value={formInput.representative_first_name}
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
                  value={formInput.representative_gender}
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
                  value={formInput.position}
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
                  phoneValue={formInput.phone_number_2}
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
                  value={formInput.email_two}
                  onChange={e => {
                    handleChange('email_two', e.target.value)
                  }}
                  error={formErrors?.email_two}
                  helperText={renderArrayMultiline(formErrors?.email_two)}
                />
              </Grid>
            </Grid>
          </CustomAccordian>

          <CustomAccordian titleAccordian={'Identifiants '}>
            <Grid className='!mt-4' container spacing={5}>
              <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
                <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                  SIREN
                </Typography>

                <CustomInputSirenSiretNumber
                  value={formInput.siren}
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
                  value={formInput.siret}
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
                  value={formInput.identifiant_tva}
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
                  value={formInput.company_rcs}
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
                  value={formInput.num_ape}
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
                  value={formInput.approval_number}
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
                  value={formInput.num_decennale}
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
              value={formInput.num_rge}
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
              dateValue={formInput.date_expiration_rge}
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
                  value={formInput.insurance_name}
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
                  value={formInput.insurance_address}
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
              value={formInput.insurance_capital}
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
              value={formInput.insurance_capital}
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
              value={formInput.insurance_rcs}
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
                  value={formInput.insurance_police}
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
                  dateValue={formInput.emissions_date_assurance && formInput.emissions_date_assurance}
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
                  dateValue={formInput.end_date_assurance && formInput.end_date_assurance}
                  setDate={date => handleChange('end_date_assurance', date)}
                  error={formErrors?.end_date_assurance}
                  helperText={renderArrayMultiline(formErrors?.end_date_assurance)}
                />
              </Grid>
            </Grid>
          </CustomAccordian>
        </div>

        // <ContentCreateTiers
        //   path={path}
        //   formInput={formInput}
        //   setFormInput={setFormInput}
        //   formErrors={formErrors}
        //   showCompte={showCompte}
        //   addTiersWithModal={addTiersWithModal}
        //   setShowCompte={setShowCompte}
        //   onSubmit={onSubmit}
        //   handleChange={handleChange}
        //   createTiersMutation={createCompanyMutation}
        // />
      )}
      {!addTiersWithModal && (
        <Grid container className='mt-6'>
          <Grid item xs={5}></Grid>
          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={createCompanyMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onSubmit()}
            >
              Créer
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export default CreateMandataire
