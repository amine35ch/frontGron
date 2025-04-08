import React, { useState } from 'react'

// ** React Imports

// ** MUI Imports
import { Grid, Card, TextField, CardContent, Box, Switch, Typography } from '@mui/material'
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

const schema = yup.object().shape({
  username: yup.string().required("Le champ nom d'utilisateur est obligatoire"),
  password: yup.string().required('Le champ mot de passe est obligatoire')
})

const ContentCreateGovernment = ({
  handleChange,
  formInput,
  setFormInput,
  formErrors,
  showCompte,
  listTypeClient,
  setShowCompte,
  update,
  id,
  formInputFile,
  setformInputFile
}) => {
  const [openModalFile, setopenModalFile] = useState(false)

  const { handleSubmit, control, setError, formState } = useForm({
    resolver: yupResolver(schema)
  })


  return (
    <div className='h-full'>
      <CustomAccordian titleAccordian={'Informations générales'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Nom
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
            <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Prénom
            </Typography>
            <TextField
              placeholder='Prénom'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.last_name}
              onChange={e => {
                handleChange('last_name', e.target.value)
              }}
              error={formErrors?.last_name}
              helperText={renderArrayMultiline(formErrors?.last_name)}
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
              value={formInput.email}
              onChange={e => {
                handleChange('email', e.target.value)
              }}
              error={formErrors?.email}
              helperText={renderArrayMultiline(formErrors?.email)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Numéro de téléphone
            </Typography>

            <CustomInputPhoneNumber
              error={formErrors?.phone_number}
              helperText={renderArrayMultiline(formErrors?.phone_number)}
              phoneValue={formInput.phone_number}
              setPhoneNumber={value => handleChange('phone_number', value)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>
      <CustomAccordian titleAccordian={'Identifiant plateforme'}>
        <Grid className='!mt-4' container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Identifiant <strong className='text-red-500'>*</strong>
            </Typography>
            <FormControl fullWidth>
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    placeholder='Identifiant'
                    size='small'
                    variant='outlined'
                    className='w-full !mt-1'
                    value={formInput.username}
                    onChange={e => handleChange('username', e.target.value)}
                    onBlur={onBlur}
                    error={formErrors?.username}
                    helperText={renderArrayMultiline(formErrors?.username)}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Mot de passe <strong className='text-red-500'>*</strong>
            </Typography>
            <FormControl fullWidth>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <InputPassword
                    value={value}
                    handleChange={e => handleChange('password', e.target.value)}
                    error={formErrors?.password}
                    helperText={renderArrayMultiline(formErrors?.password)}
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
              />
            ) : (
              <CustomComponentFileUpload
                fileTypes={['.png', '.pdf', '.jpeg', '.xlsx']}
                limit={50}
                multiple={true}
                formInput={formInput}
                setFormInput={setFormInput}
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

export default ContentCreateGovernment
