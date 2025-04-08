import React, { useState } from 'react'

// ** React Imports

// ** MUI Imports
import { Grid, Card, TextField, CardContent, Box, Switch, Typography, IconButton } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Imports

// ** Icon Imports

import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import InputPassword from 'src/components/InputPassword'
import renderArrayMultiline from 'src/@core/utils/utilities'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'
import {
  useDeleteDocumentClient,
  useDeleteDocumentClientSpecificVersion,
  useUploadDocumentForClient
} from 'src/services/client.service'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'
import CustomAccordian from 'src/components/CustomAccordian'

import FormControl from '@mui/material/FormControl'

//**yup imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'
import CustomDatePicker from 'src/components/CustomDatePicker'
import CustomInputTva from 'src/components/CustomInputTva'
import CustomMaskInputWithChiffre from 'src/components/CustomMaskIban'
import CustomInputRib from 'src/components/CustomInputRib'
import IconifyIcon from 'src/@core/components/icon'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'

// import CustomDateRangePicker from 'src/components/CustomDateRangePicker'

const schema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required')
})

export const genreList = [
  { entitled: 'M.', type: 0 },
  { entitled: 'Mme', type: 1 }
]

const ContentCreateClient = ({
  handleChange,
  formInput,
  setFormInput,
  formErrors,
  update,
  id,
  formInputFile,
  setformInputFile
}) => {
  const [openModalFile, setopenModalFile] = useState(false)
  const [formErrorsFiles, setformErrorsFiles] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const uploadDocumentToCientMutation = useUploadDocumentForClient({ id })
  const deleteDocumentCientMutation = useDeleteDocumentClient()
  const deleteSpecificVersionDocumentCientMutation = useDeleteDocumentClientSpecificVersion()

  const uploadDocumentToCient = async fileName => {
    const formData = new FormData()

    for (let key in formInputFile) {
      if (key == 'files') {
        formInputFile?.files?.map((file, index) => {
          // formData.append(`signature`, file)
          formData.append(`documents[${index}][file]`, file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else if (fileName) {
            formData.append(`documents[${index}][name]`, fileName)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      }
    }
    try {
      await uploadDocumentToCientMutation.mutateAsync(formData)
      setformInputFile({ files: [] })
      setopenModalFile(false)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setformErrorsFiles(errorsObject)
    }
  }

  const deleteDocument = async idDoc => {
    try {
      await deleteDocumentCientMutation.mutateAsync({ id: idDoc })
      setFormInput({
        files: []
      })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const deleteSpecificVersion = async idVersion => {
    try {
      await deleteSpecificVersionDocumentCientMutation.mutateAsync({ id: idVersion })
      setFormInput({
        files: []
      })
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  return (
    <div className='h-full'>
      <CustomAccordian titleAccordian={'Informations générales'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Genre <strong className='text-red-500'>*</strong>
            </Typography>
            <CustomeAutoCompleteSelect
              value={formInput?.gender}
              onChange={value => handleChange('gender', value)}
              data={genreList}
              option={'type'}
              formError={formErrors}
              error={formErrors?.gender}
              displayOption={'entitled'}
              helperText={renderArrayMultiline(formErrors?.gender)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Nom <strong className='text-red-500'>*</strong>
            </Typography>
            <FormControl className='w-full '>
              <Controller
                name='first_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='Nom'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.last_name}
                    onChange={e => {
                      handleChange('last_name', e.target.value)
                    }}
                    sx={{ fontSize: '10px !important' }}
                    error={formErrors?.last_name}
                    helperText={renderArrayMultiline(formErrors?.last_name)}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prénom <strong className='text-red-500'>*</strong>
            </Typography>
            <FormControl className='w-full '>
              <Controller
                name='first_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='Prénom'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.first_name}
                    onChange={e => {
                      handleChange('first_name', e.target.value)
                    }}
                    sx={{ fontSize: '10px !important' }}
                    error={formErrors?.first_name}
                    helperText={renderArrayMultiline(formErrors?.first_name)}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Date de naissance
            </Typography>
            {/* <CustomDateRangePicker /> */}
            <CustomDatePicker
              dateFormat={'dd/MM/yyyy'}
              backendFormat={'YYYY-MM-DD'}
              dateValue={formInput.year_of_birth}
              setDate={date => handleChange('year_of_birth', date)}
              error={formErrors?.year_of_birth}
              helperText={renderArrayMultiline(formErrors?.year_of_birth)}
              minDate={false}
              maxDate={true}
            />
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Email <strong className='text-red-500'>*</strong>
            </Typography>
            <TextField
              placeholder='Email'
              type='email'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.email_contact}
              onChange={e => {
                handleChange('email_contact', e.target.value)
              }}
              error={formErrors?.email_contact}
              helperText={renderArrayMultiline(formErrors?.email_contact)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Box display={'flex'} alignItems={'center'}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Email Anah
              </Typography>
            </Box>

            <TextField
              placeholder='email Anah'
              size='small'
              type='email'
             
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.email_anah}
              onChange={e => {
                handleChange('email_anah', e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Box display={'flex'} alignItems={'center'}>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Mot de passe Anah
              </Typography>
              {true && (
                <Box
                  sx={{ ml: 2 }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label='Ajouter Bénéficiaire'
                  size='small'
                >
                  {showPassword ? (
                    <IconifyIcon icon={'ooui:un-lock'} style={{ cursor: 'pointer' }} color='#FFAF6C' fontSize='15' />
                  ) : (
                    <IconifyIcon icon={'ooui:lock'} style={{ cursor: 'pointer' }} color='#FFAF6C' fontSize='15' />
                  )}
                </Box>
              )}
            </Box>

            <TextField
              placeholder='Mot de passe Anah'
              size='small'
              type={showPassword ? 'text' : 'password'}
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.password_anah}
              onChange={e => {
                handleChange('password_anah', e.target.value)
              }}
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
              N ° <strong className='text-red-500'>*</strong>
            </Typography>
            <TextField
              placeholder='N °'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.house_number}
              onChange={e => {
                handleChange('house_number', e.target.value)
              }}
              error={formErrors?.house_number}
              helperText={renderArrayMultiline(formErrors?.house_number)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Voie <strong className='text-red-500'>*</strong>
            </Typography>
            <TextField
              placeholder='voie'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.street}
              onChange={e => {
                handleChange('street', e.target.value)
              }}
              error={formErrors?.street}
              helperText={renderArrayMultiline(formErrors?.street)}
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
              Étage
            </Typography>
            <TextField
              placeholder='Etage'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.floor}
              onChange={e => {
                handleChange('floor', e.target.value)
              }}
              error={formErrors?.floor}
              helperText={renderArrayMultiline(formErrors?.floor)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Escalier
            </Typography>
            <TextField
              placeholder='Escalier'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.stairs}
              onChange={e => {
                handleChange('stairs', e.target.value)
              }}
              error={formErrors?.stairs}
              helperText={renderArrayMultiline(formErrors?.stairs)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Commune
            </Typography>
            <TextField
              placeholder='Commune'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.commune}
              onChange={e => {
                handleChange('commune', e.target.value)
              }}
              error={formErrors?.commune}
              helperText={renderArrayMultiline(formErrors?.commune)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Porte
            </Typography>
            <TextField
              placeholder='Porte'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.door}
              onChange={e => {
                handleChange('door', e.target.value)
              }}
              error={formErrors?.door}
              helperText={renderArrayMultiline(formErrors?.door)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Bâtiment
            </Typography>
            <TextField
              placeholder='Bâtiment'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.building}
              onChange={e => {
                handleChange('building', e.target.value)
              }}
              error={formErrors?.building}
              helperText={renderArrayMultiline(formErrors?.building)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro de téléphone <strong className='text-red-500'>*</strong>
            </Typography>

            <CustomInputPhoneNumber
              error={formErrors?.phone_number_1}
              helperText={renderArrayMultiline(formErrors?.phone_number_1)}
              phoneValue={formInput.phone_number_1}
              setPhoneNumber={value => handleChange('phone_number_1', value)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Portable
            </Typography>
            <CustomInputPhoneNumber
              error={formErrors?.phone_number_2}
              helperText={renderArrayMultiline(formErrors?.phone_number_2)}
              phoneValue={formInput.phone_number_2}
              setPhoneNumber={value => handleChange('phone_number_2', value)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              RIB
            </Typography>
            <CustomInputRib
              setNumber={value => {
                handleChange('rib', value)
              }}
              value={formInput?.rib}
              error={formErrors?.rib}
              helperText={renderArrayMultiline(formErrors?.rib)}
            />
            {/* <TextField
              placeholder='RIB'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.rip}
              onChange={e => {
                handleChange('rip', e.target.value)
              }}
              error={formErrors?.rip}
              helperText={renderArrayMultiline(formErrors?.rip)}
            /> */}
          </Grid>

          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              IBAN
            </Typography>

            <CustomMaskInputWithChiffre
              setNumber={value => {
                handleChange('iban', value)
              }}
              value={formInput.iban}
              error={formErrors?.iban}
              helperText={renderArrayMultiline(formErrors?.iban)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Zone climatique
            </Typography>
            <TextField
              placeholder='Zone climatique'
              type='text'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.climatic_zone}
              onChange={e => {
                handleChange('climatic_zone', e.target.value)
              }}
              error={formErrors?.climatic_zone}
              helperText={renderArrayMultiline(formErrors?.climatic_zone)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      <CustomAccordian titleAccordian={'Personne de confiance'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Nom et prénom
            </Typography>
            <FormControl className='w-full '>
              <Controller
                name='represented'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='Nom et prénom'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.representative}
                    onChange={e => {
                      handleChange('representative', e.target.value)
                    }}
                    sx={{ fontSize: '10px !important' }}
                    error={formErrors?.representative}
                    helperText={renderArrayMultiline(formErrors?.representative)}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              En qualité de
            </Typography>
            <FormControl className='w-full '>
              <Controller
                name='representative_contact'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='En qualité de'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.representative_contact}
                    onChange={e => {
                      handleChange('representative_contact', e.target.value)
                    }}
                    sx={{ fontSize: '10px !important' }}
                    error={formErrors?.representative_contact}
                    helperText={renderArrayMultiline(formErrors?.representative_contact)}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CustomAccordian>
      {/* <CustomAccordian titleAccordian={'Documents'}>
        <Grid className='!mt-1' container spacing={5}>
          <Grid item xs={12} md={6}>
            {update ? (
              <AttachFileModalWithTable
                openModalFile={openModalFile}
                setopenModalFile={setopenModalFile}
                formInput={formInputFile}
                setFormInput={setformInputFile}
                arrayDocuments={formInput?.documents || []}
                uploadDocument={uploadDocumentToCient}
                deleteDocument={deleteDocument}
                deleteSpecificVersion={deleteSpecificVersion}
                authorizeDelete={true}
                showInputName={true}
                formErrors={formErrorsFiles}
              />
            ) : (
              <CustomComponentFileUpload
                fileTypes={['.png', '.pdf', '.jpeg', '.xlsx']}
                limit={50}
                multiple={true}
                formInput={formInput}
                setFormInput={setFormInput}
                formErrors={formErrors}
                name='files'
                showInputName={true}
              />
            )}
          </Grid>
        </Grid>
      </CustomAccordian> */}
    </div>
  )
}

export default ContentCreateClient
