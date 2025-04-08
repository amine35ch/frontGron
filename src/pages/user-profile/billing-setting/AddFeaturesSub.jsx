import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import {
  useAddFeatures,
  useGetSubscriberFeatures,
  useGetSubscriberFeaturesUnit
} from 'src/services/subscription.service'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'

const AddFeaturesSub = ({ setOpen }) => {
  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
    p_feature_id: '',
    quantity: null,
    price: 0
  })
  const { data: listFeatures, isPending } = useGetSubscriberFeatures()
  const { data: listUnitFeature } = useGetSubscriberFeaturesUnit({ id: formInput?.p_feature_id })
  const addFeaturesMutation = useAddFeatures()

  const handleChange = (key, value) => {
    if (key === 'p_feature_id') {
      setFormInput({
        ...formInput,
        [key]: value,
        quantity: null
      })
    } else {
      setFormInput({
        ...formInput,
        [key]: value
      })
    }
  }
  useEffect(() => {
    const unitPrice = listFeatures?.data?.find(item => item.id == formInput?.p_feature_id)
    const price = Number(unitPrice?.unit_price).toFixed(2) || {} // Assurez-vous qu'il y a une valeur par défaut si unitPrice est undefined

    if (formInput?.quantity === null || formInput?.quantity === 0) {
      setFormInput({
        ...formInput,
        price: price
      })
    } else {
      setFormInput({
        ...formInput,
        price: price * formInput?.quantity
      })
    }
  }, [formInput])

  const onSubmit = async () => {
    try {
      await addFeaturesMutation.mutateAsync(formInput)
      setOpen(false)
    } catch (error) {}
  }

  return (
    <div className='mt-6'>
      <Box>
        <FormControl>
          <RadioGroup aria-labelledby='demo-radio-buttons-group-label' defaultValue='female' name='radio-buttons-group'>
            <Grid container spacing={4}>
              {listFeatures?.data?.map((feat, index) => (
                <Grid key={index} item xs={6}>
                  <Box
                    px={4}
                    style={{
                      border: feat?.id == formInput?.p_feature_id ? '1px solid #86a039' : '1px solid #F0F3E7',
                      borderRadius: '10px'
                    }}
                  >
                    <FormControlLabel
                      value={feat?.id}
                      onChange={e => handleChange('p_feature_id', e.target.value)}
                      control={<Radio />}
                      label={
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:user'
                            color={feat?.id == formInput?.p_feature_id ? '#86a039' : '#9495A2'}
                          />
                          <Typography ml={2}> {feat?.display_name} </Typography>
                        </div>
                      }
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            {/* <FormControlLabel value='male' control={<Radio />} label='Male' />
            <FormControlLabel value='other' control={<Radio />} label='Other' /> */}
          </RadioGroup>
        </FormControl>
      </Box>
      <Grid container spacing={4}>
        <Grid mt={4} item xs={6}>
          <Typography fontWeight={600} mb={1}>
            Quantité
          </Typography>

          <CustomeAutoCompleteSelect
            option={'quantity'}
            value={formInput?.quantity}
            onChange={value => handleChange('quantity', value)}
            data={listUnitFeature?.data}
            formError={formErrors}
            error={formErrors?.quantity}
            displayOption={'unit'}
            helperText={renderArrayMultiline(formErrors?.quantity)}
          />
        </Grid>
        <Grid mt={4} item xs={6}>
          <Typography fontWeight={600} mb={1}>
            {' '}
            &nbsp;
          </Typography>
          {/* <div className='flex justify-between items-center'> */}
          {/* <Typography fontWeight={600} mb={1}>
              Montant HT &nbsp;
            </Typography> */}
          <Typography color={'secondary'} fontWeight={'bold'} align='right' variant='subtitle1'>
            <CustomCurrencyInput displayType='text' value={formInput?.price} />
          </Typography>
          {/* </div> */}
        </Grid>
      </Grid>

      <Box display={'flex'} mt={6} justifyContent={'end'}>
        <LoadingButton
          variant='contained'
          loading={addFeaturesMutation?.isPending}
          loadingPosition='start'
          className='h-[29px] w-[105px]'
          sx={{ fontSize: '12px', cursor: 'pointer' }}
          onClick={() => onSubmit()}
        >
          Ajouter
        </LoadingButton>
      </Box>
    </div>
  )
}

export default AddFeaturesSub
