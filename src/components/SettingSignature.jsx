import React, { useEffect, useState } from 'react'
import CustomModal from './CustomModal'
import { Grid, TextField, Typography } from '@mui/material'
import CustomInputPhoneNumber from './CustomInputPhoneNumber'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetDetailClient, useUpdateClient, useUpdateClientContactInfo } from 'src/services/client.service'
import { LoadingButton } from '@mui/lab'

const SettingSignature = ({
  openModalSettingSignature,
  setOpenModalSettingSignature,
  id,
  contactInfo,
  setContactInfo,
  countSignature
}) => {
  const updateClientMutation = useUpdateClientContactInfo({ id })

  const [formErrors, setFormErrors] = useState({})

  const handleChange = (key, value) => {
    setContactInfo({
      ...contactInfo,
      [key]: value
    })
  }

  const onSubmit = async () => {
    try {
      await updateClientMutation.mutateAsync(contactInfo)
      setOpenModalSettingSignature(false)
    } catch (error) {
      setFormErrors(error.response.data.errors)
    }
  }

  return (
    <CustomModal
      open={openModalSettingSignature}
      handleCloseOpen={() => setOpenModalSettingSignature(false)}
      handleActionModal={() => setOpenModalSettingSignature(false)}
      btnTitle={'Enregistrer'}
      ModalTitle={'Paramétrages Signature'}
      widthModal={'sm'}
      btnTitleClose={false}
      action={() => onSubmit()}
      bottomAction={false}
    >
      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Email
          </Typography>
          <TextField
            placeholder='Email'
            type='email'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={contactInfo.email}
            onChange={e => {
              handleChange('email', e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Numéro de téléphone
          </Typography>

          <CustomInputPhoneNumber
            phoneValue={contactInfo.phone_number}
            setPhoneNumber={value => handleChange('phone_number', value)}
          />
        </Grid>
        {/* <Grid item xs={12} md={12} className='!mb-2 !pt-0 flex justify-end'>
          <LoadingButton loading={updateClientMutation.isPending} onClick={onSubmit} variant='contained'>
            Enregistrer
          </LoadingButton>
        </Grid> */}
      </Grid>
    </CustomModal>
  )
}

export default SettingSignature
